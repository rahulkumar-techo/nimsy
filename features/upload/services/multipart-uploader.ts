// Splits the source video into S3 parts natively, then hands each part off
// to the OS-managed background uploader. Nothing here ever holds the video
// (or a chunk of it) as a JS Buffer/ArrayBuffer/Base64 string — JS only ever
// sees file paths and progress percentages.

import { InitUploadResponse, UploadedPart } from "../types/upload.types";
import { PersistedPart } from "../types/session.types";
import { uploadSessionStore } from "../storage/upload-session.store";
import { uploadCacheStore } from "../storage/upload-cache.store";
import { nativeFileChunker } from "./native-file-chunker";
import { backgroundUploadService } from "./background-upload";

const MAX_CONCURRENT_PARTS = 3;
const MAX_PART_RETRIES = 3;

async function runWithConcurrency<T>(items: T[], limit: number, worker: (item: T) => Promise<void>): Promise<void> {
  let nextIndex = 0;
  async function runNext(): Promise<void> {
    const index = nextIndex++;
    if (index >= items.length) return;
    await worker(items[index]);
    return runNext();
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => runNext()));
}

function uploadOnePart(
  videoId: string,
  part: PersistedPart,
  filePath: string,
  onPartProgress: (partNumber: number, percent: number) => void,
): Promise<UploadedPart> {
  let attempts = 0;

  return new Promise((resolve, reject) => {
    const attempt = () => {
      attempts++;
      backgroundUploadService
        .startPart(videoId, part, filePath, {
          onProgress: (percent) => onPartProgress(part.partNumber, percent),
          onCompleted: (etag) => resolve({ partNumber: part.partNumber, etag }),
          onError: (err) => {
            if (attempts >= MAX_PART_RETRIES) reject(err);
            else attempt();
          },
        })
        .catch((err) => {
          if (attempts >= MAX_PART_RETRIES) reject(err);
          else attempt();
        });
    };
    attempt();
  });
}

export const multipartUploader = {
  // Slice `sourceFilePath` into `upload.totalChunks` files on disk (native,
  // streamed) and upload each one as an OS-managed background task.
  async uploadAllParts(
    videoId: string,
    sourceFilePath: string,
    upload: InitUploadResponse,
    onProgress?: (percent: number) => void,
  ): Promise<UploadedPart[]> {
    const destDir = await uploadCacheStore.ensureDir(videoId);

    const chunks = await nativeFileChunker.splitFile(sourceFilePath, upload.chunkSize, upload.totalChunks, destDir);

    chunks.forEach((chunk) => {
      uploadSessionStore.updatePart(videoId, chunk.partNumber, {
        status: "CHUNKED",
        localChunkPath: chunk.path,
      });
    });

    const progressByPart = new Map<number, number>();
    const reportOverall = () => {
      if (!onProgress || upload.totalChunks === 0) return;
      const sum = Array.from(progressByPart.values()).reduce((a, b) => a + b, 0);
      onProgress(Math.round(sum / upload.totalChunks));
    };

    const results: UploadedPart[] = [];

    await runWithConcurrency(upload.urls, MAX_CONCURRENT_PARTS, async (part) => {
      const chunk = chunks.find((c) => c.partNumber === part.partNumber);
      if (!chunk) throw new Error(`Missing local chunk file for part ${part.partNumber}`);

      const persistedPart: PersistedPart = {
        partNumber: part.partNumber,
        url: part.url,
        status: "CHUNKED",
        localChunkPath: chunk.path,
        attempts: 0,
      };

      const result = await uploadOnePart(videoId, persistedPart, chunk.path, (partNumber, percent) => {
        progressByPart.set(partNumber, percent);
        reportOverall();
      });

      progressByPart.set(part.partNumber, 100);
      reportOverall();

      await uploadCacheStore.removePart(videoId, part.partNumber);
      results.push(result);
    });

    return results;
  },

  // Resume a single part left in CHUNKED/FAILED state — the chunk file is
  // already on disk from a previous run, so no re-slicing is needed.
  async resumePart(videoId: string, part: PersistedPart, onProgress?: (percent: number) => void): Promise<UploadedPart> {
    if (!part.localChunkPath) {
      throw new Error(`Part ${part.partNumber} has no local chunk file to resume from.`);
    }
    return uploadOnePart(videoId, part, part.localChunkPath, (_partNumber, percent) => onProgress?.(percent));
  },
};
