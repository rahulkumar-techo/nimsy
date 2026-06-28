/*
I strongly suspect one of these:

Content-Type mismatch with S3.
Temp chunk file no longer exists.
Presigned URL expired.
RNBlobUtil Android bug with chunk temp files.
--
always take care 
Content-Type/signature mismatch.
*/

import ReactNativeBlobUtil from "react-native-blob-util";

const DEBUG = typeof __DEV__ !== "undefined" && __DEV__;
const log = (s: string, ...a: unknown[]) => DEBUG && console.log(`[UW][${s}]`, ...a);

export interface UploadTask {
  partNumber: number;
  fileUri: string;
  url: string;
  mimeType: string;
}
export interface ChunkProgressEvent { partNumber: number; uploadedBytes: number; totalBytes: number; }
export interface UploadWorkerCallbacks {
  onChunkProgress?: (e: ChunkProgressEvent) => void;
  onChunkComplete?: (partNumber: number, etag: string) => void;
  onChunkError?: (partNumber: number, error: Error) => void;
}

export class UploadWorker {
  private requestTask: any = null;
  private cancelled = false;

  constructor(private tasks: UploadTask[], private callbacks?: UploadWorkerCallbacks) { }

  async run(): Promise<void> {
    for (const task of this.tasks) {
      if (this.cancelled) throw new Error("AbortError");
      await this.upload(task);
    }
  }

  cancel() {
    this.cancelled = true;
    try { this.requestTask?.cancel(); } catch { }
  }

  private async upload(task: UploadTask): Promise<void> {
    const { partNumber, fileUri, url, mimeType } = task;
    const cleanPath = fileUri.replace(/^file:\/\//, "");
    log("Upload", `part=${partNumber}`, cleanPath);

    try {
      const exists = await ReactNativeBlobUtil.fs.exists(cleanPath);

      if (!exists) {
        throw new Error(`Chunk file missing: ${cleanPath}`);
      }

      const stat = await ReactNativeBlobUtil.fs.stat(cleanPath);

      log(
        "Chunk",
        `part=${partNumber}`,
        `path=${cleanPath}`
      );

      log(
        "Chunk",
        `part=${partNumber}`,
        `size=${(Number(stat.size) / (1024 * 1024)).toFixed(2)} MB`
      );

      log(
        "Chunk",
        `part=${partNumber}`,
        `exists=${exists}`
      );

      if (Number(stat.size) <= 0) {
        throw new Error(`Chunk file empty: ${cleanPath}`);
      }

      const nativeBodyPayload =
        ReactNativeBlobUtil.wrap(cleanPath);

      // 3. Perform upload with optimized native stream
      this.requestTask = ReactNativeBlobUtil.fetch(
        "PUT",
        url,
        {
          "Content-Type": mimeType || "application/octet-stream",
          "Content-Length": String(stat.size)
        },
        nativeBodyPayload
      );

      this.requestTask.uploadProgress({ interval: 250 }, (written: number, total: number) => {
        this.callbacks?.onChunkProgress?.({ partNumber, uploadedBytes: written, totalBytes: total });
      });

      const resp = await this.requestTask;
      const status = resp.info().status;
      if (status < 200 || status >= 300) {
        const body = await resp.text().catch(() => "");
        throw new Error(`HTTP ${status}: ${body}`);
      }

      const headers = resp.info().headers;
      const etag = headers?.ETag || headers?.etag || headers?.Etag;
      if (!etag) throw new Error("Missing ETag");

      this.callbacks?.onChunkComplete?.(partNumber, etag.replace(/"/g, ""));
      log("Upload", `part=${partNumber} success`);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      if (this.cancelled) e.name = "AbortError";
      this.callbacks?.onChunkError?.(partNumber, e);
      throw e;
    } finally {
      this.requestTask = null;
    }
  }
}