// Video multipart upload service.
// Flow: init session -> upload chunks to S3 (parallel, retry) -> complete upload.

import axios from "axios";
import axiosInstance from "@/lib/api";
import { VIDEO_ENDPOINTS } from "@/constants/video.constants";

export interface PresignedMetadata {
  title: string;
  description?: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  chapters: { id: string; time: string; title: string }[];
  madeForKids: boolean;
  allowComments: boolean;
  allowRatings: boolean;
}

export interface UploadPart {
  partNumber: number;
  url: string;
}

export interface UploadedPart {
  partNumber: number;
  etag: string;
}

export interface InitUploadResponse {
  videoId: string;
  uploadSessionId: string;
  uploadId: string;
  objectKey: string;
  chunkSize: number;
  totalChunks: number;
  urls: UploadPart[];
  thumbnailKey: string;
  previewKey: string | null;
  thumbnailUploadUrl: string | null;
}

export interface CompleteUploadPayload {
  videoId: string;
  uploadId: string;
  parts: UploadedPart[];
}

export interface UploadStatusResponse {
  status: string;
  progress: number;
  uploadedChunks: number;
  totalChunks: number;
  remainingChunks: number;
  isCompleted: boolean;
}

export type UploadCallback = (progress: number, status: string, message: string) => void;

const MAX_CONCURRENT_CHUNKS = 4;
const MAX_CHUNK_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 500;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Runs `worker` over `items` with at most `limit` concurrent executions.
async function runWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  async function runNext(): Promise<void> {
    const index = nextIndex++;
    if (index >= items.length) return;
    results[index] = await worker(items[index], index);
    return runNext();
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => runNext()));
  return results;
}

class VideoService {
  // Create a multipart upload session and get presigned URLs.
  async requestPresignedUrls(payload: PresignedMetadata): Promise<InitUploadResponse> {
    const { data } = await axiosInstance.post(VIDEO_ENDPOINTS.INITUPLOAD, payload);
    return data.data;
  }

  // Upload a single chunk to S3 via presigned URL, with retry + exponential backoff.
  // Plain axios is used (not axiosInstance) since the URL is already signed and
  // shouldn't carry app auth headers/baseURL.
  private async uploadChunkWithRetry(
    part: UploadPart,
    chunk: ArrayBuffer,
    onBytes: (loaded: number) => void,
  ): Promise<string> {
    let attempt = 0;

    while (true) {
      try {
        const response = await axios.put(part.url, chunk, {
          headers: { "Content-Type": "application/octet-stream" },
          onUploadProgress: (event) => onBytes(event.loaded),
        });

        const etag = response.headers["etag"] ?? response.headers["ETag"];
        if (!etag) throw new Error("ETag missing from upload response");

        return etag.replace(/"/g, "");
      } catch (err) {
        attempt++;
        if (attempt >= MAX_CHUNK_RETRIES) {
          throw new Error(`Part ${part.partNumber} failed after ${attempt} attempts: ${(err as Error).message}`);
        }
        await sleep(RETRY_BASE_DELAY_MS * 2 ** (attempt - 1));
      }
    }
  }

  // Persist chunk metadata for resume support (best-effort, doesn't fail the chunk).
  private async chunkUploadCompleted(videoId: string, etag: string, partNumber: number) {
    try {
      await axiosInstance.post(`/videos/${videoId}/upload/chunks`, { etag, partNumber });
    } catch (err) {
      console.error(`Failed to persist chunk metadata for part ${partNumber}:`, err);
    }
  }

  // Upload all chunks with bounded concurrency and accurate, monotonic overall progress.
  async uploadChunks(
    file: ArrayBuffer,
    upload: InitUploadResponse,
    onProgress?: (progress: number) => void,
  ): Promise<UploadedPart[]> {
    const totalBytes = file.byteLength;
    const loadedByPart = new Map<number, number>();
    let lastReported = 0;

    const reportProgress = () => {
      if (!onProgress || totalBytes === 0) return;
      let loaded = 0;
      for (const bytes of loadedByPart.values()) loaded += bytes;
      const pct = Math.min(100, Math.round((loaded / totalBytes) * 100));
      // never report a lower percentage than before (e.g. during a chunk retry)
      if (pct > lastReported) {
        lastReported = pct;
        onProgress(pct);
      }
    };

    return runWithConcurrency(upload.urls, MAX_CONCURRENT_CHUNKS, async (part, i) => {
      const start = i * upload.chunkSize;
      const end = Math.min(start + upload.chunkSize, file.byteLength);
      const chunk = file.slice(start, end);
      const chunkSize = end - start;

      const etag = await this.uploadChunkWithRetry(part, chunk, (loaded) => {
        loadedByPart.set(part.partNumber, Math.min(loaded, chunkSize));
        reportProgress();
      });

      loadedByPart.set(part.partNumber, chunkSize);
      reportProgress();

      await this.chunkUploadCompleted(upload.videoId, etag, part.partNumber);
      return { partNumber: part.partNumber, etag };
    });
  }

  // Finalize multipart upload and merge chunks.
  async completeUpload(payload: CompleteUploadPayload) {
    const { data } = await axiosInstance.post(VIDEO_ENDPOINTS.COMPLETEUPLOAD, payload);
    return data.data;
  }

  // Get multipart upload status (recovery / progress sync).
  async getUploadStatus(videoId: string): Promise<UploadStatusResponse> {
    const { data } = await axiosInstance.get(`/videos/${videoId}/upload/status`);
    return data.data;
  }

  // Full upload workflow: INITIALIZING -> UPLOADING -> COMPLETING -> PROCESSING.
  async uploadVideo(file: ArrayBuffer, metadata: PresignedMetadata, onUpdate?: UploadCallback) {
    onUpdate?.(0, "INITIALIZING", "Preparing upload...");

    const upload = await this.requestPresignedUrls(metadata);

    const parts = await this.uploadChunks(file, upload, (progress) =>
      onUpdate?.(progress, "UPLOADING", `Uploading ${progress}%`),
    );

    onUpdate?.(100, "COMPLETING", "Finalizing upload...");

    await this.completeUpload({ videoId: upload.videoId, uploadId: upload.uploadId, parts });

    onUpdate?.(100, "PROCESSING", "Video processing...");

    return { upload, parts };
  }
}

export const videoService = new VideoService();