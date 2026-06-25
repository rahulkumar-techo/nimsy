import { UploadNotificationService } from "./notification.service";

export interface UploadTask {
  partNumber: number;
  fileUri: string;
  url: string;
  startByte: number;
  endByte: number;
}

export interface UploadWorkerCallbacks {
  onProgress?: (partNumber: number, progress: number) => void;
  onCompleted?: (partNumber: number, etag: string) => void;
  onError?: (partNumber: number, error: Error) => void;
}

export class UploadWorker {
  private xhrMap = new Map<number, XMLHttpRequest>();

  constructor(private queue: UploadTask[], private callbacks?: UploadWorkerCallbacks) {}

  async run(): Promise<string[]> {
    const etags: string[] = [];
    for (const task of this.queue) {
      etags.push(await this.upload(task));
    }
    return etags;
  }

  cancel(partNumber?: number) {
    if (partNumber) {
      this.xhrMap.get(partNumber)?.abort();
      return;
    }
    this.xhrMap.forEach(xhr => xhr.abort());
    this.xhrMap.clear();
  }

  private upload(task: UploadTask): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      this.xhrMap.set(task.partNumber, xhr);

      xhr.upload.onprogress = event => {
        if (!event.lengthComputable) return;
        const progress = event.loaded / event.total;
        this.callbacks?.onProgress?.(task.partNumber, progress);
        UploadNotificationService.showProgress(progress * 100);
      };

      xhr.onload = () => {
        this.xhrMap.delete(task.partNumber);
        if (xhr.status >= 200 && xhr.status < 300) {
          const etag = (xhr.getResponseHeader("ETag") ?? xhr.getResponseHeader("etag") ?? "").replace(/"/g, "");
          this.callbacks?.onCompleted?.(task.partNumber, etag);
          resolve(etag);
        } else {
          const error = new Error(`Upload failed with status ${xhr.status}`);
          this.callbacks?.onError?.(task.partNumber, error);
          reject(error);
        }
      };

      xhr.onerror = () => {
        this.xhrMap.delete(task.partNumber);
        const error = new Error("Network error during upload");
        this.callbacks?.onError?.(task.partNumber, error);
        reject(error);
      };

      xhr.onabort = () => {
        this.xhrMap.delete(task.partNumber);
        reject(new DOMException("Upload aborted", "AbortError"));
      };

      xhr.open("PUT", task.url);
      xhr.setRequestHeader("Content-Type", "application/octet-stream");
      xhr.send({
        uri: task.fileUri,
        name: `chunk-${task.partNumber}.bin`,
        type: "application/octet-stream",
      } as any);
    });
  }
}