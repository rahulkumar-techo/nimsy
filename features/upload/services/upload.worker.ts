import ReactNativeBlobUtil from "react-native-blob-util";
import { StalledUploadError } from "../utils/StalledUploadError";

const DEBUG = typeof __DEV__ !== "undefined" && __DEV__;
const log = (s: string, ...a: unknown[]) => DEBUG && console.log(`[UW][${s}]`, ...a);
const STALL_TIMEOUT_MS = 60_000, STALL_CHECK_INTERVAL_MS = 5_000;

export interface UploadTask { partNumber: number; fileUri: string; url: string; mimeType: string; }
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

    let lastProgressAt = Date.now();
    const stallWatcher = setInterval(() => {
      if (this.cancelled) return;
      if (Date.now() - lastProgressAt >= STALL_TIMEOUT_MS) {
        log("Stall", `part=${partNumber} stalled`);
        try { this.requestTask?.cancel(); } catch { }
        this.cancelled = true;
      }
    }, STALL_CHECK_INTERVAL_MS);

    try {
      const exists = await ReactNativeBlobUtil.fs.exists(cleanPath);
      if (!exists) throw new Error(`Chunk file missing: ${cleanPath}`);

      const stat = await ReactNativeBlobUtil.fs.stat(cleanPath);
      log("Chunk", `part=${partNumber} size=${(Number(stat.size) / (1024 * 1024)).toFixed(2)}MB exists=${exists}`);
      if (Number(stat.size) <= 0) throw new Error(`Chunk file empty: ${cleanPath}`);

      this.requestTask = ReactNativeBlobUtil.fetch("PUT", url, {
        "Content-Type": mimeType || "application/octet-stream",
        "Content-Length": String(stat.size)
      }, ReactNativeBlobUtil.wrap(cleanPath));

      this.requestTask.uploadProgress({ interval: 250 }, (written: number, total: number) => {
        lastProgressAt = Date.now();
        this.callbacks?.onChunkProgress?.({ partNumber, uploadedBytes: written, totalBytes: total });
      });

      const resp = await this.requestTask;
      const status = resp.info().status;
      if (status < 200 || status >= 300) {
        throw new Error(`HTTP ${status}: ${await resp.text().catch(() => "")}`);
      }

      const headers = resp.info().headers;
      const etag = headers?.ETag || headers?.etag || headers?.Etag;
      if (!etag) throw new Error("Missing ETag");

      this.callbacks?.onChunkComplete?.(partNumber, etag.replace(/"/g, ""));
      log("Upload", `part=${partNumber} success`);
    } catch (err) {
      let e = err instanceof Error ? err : new Error(String(err));
      if (Date.now() - lastProgressAt >= STALL_TIMEOUT_MS) e = new StalledUploadError(partNumber);
      else if (this.cancelled) e.name = "AbortError";

      this.callbacks?.onChunkError?.(partNumber, e);
      throw e;
    } finally {
      clearInterval(stallWatcher);
      this.requestTask = null;
    }
  }
}