import { UploadNotificationService } from "./notification.service";

export interface UploadTask {
  partNumber: number;
  fileUri: string;
  url: string;
  startByte: number;
  endByte: number;
}

/**
 * Raw chunk progress payload from UploadWorker.
 * Contains only the raw bytes for this specific chunk upload.
 */
export interface ChunkProgressUpdate {
  partNumber: number;
  uploadedBytes: number;
  totalBytes: number;
}

/**
 * Callbacks for UploadWorker.
 * Worker only reports raw progress - no aggregation logic.
 */
export interface UploadWorkerCallbacks {
  /** Progress update for a single chunk */
  onChunkProgress: (update: ChunkProgressUpdate) => void;
  /** Chunk completed successfully with ETag */
  onChunkComplete: (partNumber: number, etag: string) => void;
  /** Chunk failed with error */
  onChunkError: (partNumber: number, error: Error) => void;
}

export class UploadWorker {
  private readonly xhrMap = new Map<number, XMLHttpRequest>();

  constructor(private readonly queue: UploadTask[], private readonly callbacks: UploadWorkerCallbacks) {}

  async run(): Promise<void> {
    for (const task of this.queue) {
      await this.upload(task);
    }
  }

  cancel(partNumber?: number): void {
    if (partNumber !== undefined) return this.xhrMap.get(partNumber)?.abort();
    this.xhrMap.forEach((xhr) => xhr.abort());
    this.xhrMap.clear();
  }

  private upload(task: UploadTask): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const p = task.partNumber;
      this.xhrMap.set(p, xhr);

      xhr.upload.onprogress = (e) => {
        if (!e.lengthComputable || e.total === 0) return;
        this.callbacks.onChunkProgress({ partNumber: p, uploadedBytes: e.loaded, totalBytes: e.total });
      };

      const handleErr = (err: Error) => {
        this.xhrMap.delete(p);
        this.callbacks.onChunkError(p, err);
        reject(err);
      };

      xhr.onload = () => {
        this.xhrMap.delete(p);
        if (xhr.status < 200 || xhr.status >= 300) {
          return handleErr(new Error(`Upload failed with status ${xhr.status}`));
        }
        const etag = (xhr.getResponseHeader("ETag") ?? xhr.getResponseHeader("etag") ?? "").replace(/"/g, "");
        this.callbacks.onChunkComplete(p, etag);
        resolve();
      };

      xhr.onerror = () => handleErr(new Error("Network error during upload"));
      xhr.onabort = () => (this.xhrMap.delete(p), reject(new DOMException("Upload aborted", "AbortError")));

      xhr.open("PUT", task.url);
      xhr.setRequestHeader("Content-Type", "application/octet-stream");
      xhr.send({ uri: task.fileUri, name: `chunk-${p}.bin`, type: "application/octet-stream" } as any);
    });
  }
}