/**
 * Background Upload Service
 * Handles native background uploads for large files.
 * Integrates with react-native-background-upload for reliable off-main-thread uploads.
 */

import Upload from "react-native-background-upload";

export interface BackgroundUploadOptions {
  filePath: string;
  url: string;
  signal?: AbortSignal;
  onProgress?: (progress: number) => void;
}

interface CompletedData {
  responseHeaders?: Record<string, string>;
}

/**
 * Uploads a chunk using react-native-background-upload.
 * Returns the ETag from S3 on success.
 */
export async function uploadChunkInBackground(options: BackgroundUploadOptions): Promise<string> {
  // Normalize path format for Android compatibility (strips duplicate file:// schemas)
  const cleanPath = options.filePath.replace(/^file:\/\//, "");
  console.log(`[BgUpload] Initiating upload task. Path: "${cleanPath}"`);

  return new Promise<string>((resolve, reject) => {
    let uploadId: string | null = null;

    Upload.startUpload({
      url: options.url,
      path: cleanPath,
      method: "PUT",
      type: "raw",
      notification: { enabled: false, autoClear: false },
      headers: { "Content-Type": "application/octet-stream" },
    })
      .then((id) => {
        uploadId = id;
        if (!id) return reject(new Error("Unable to start upload: ID generated empty"));
        
        console.log(`[BgUpload] Native background channel opened. Upload ID assigned: ${id}`);

        options.signal?.addEventListener("abort", () => {
          console.warn(`[BgUpload] Abort signal triggered. Terminating Native ID: ${id}`);
          Upload.cancelUpload(id);
          reject(new DOMException("Aborted", "AbortError"));
        });

        Upload.addListener("progress", id, ({ progress }) => {
          options.onProgress?.(progress);
        });

        Upload.addListener("completed", id, (data: unknown) => {
          const headers = (data as CompletedData).responseHeaders;
          const etag = headers?.etag ?? headers?.ETag;
          console.log(`[BgUpload] Native task ${id} finished wire transfer. Extracted Headers:`, JSON.stringify(headers));

          if (!etag) return reject(new Error("S3 Upload verified but payload missing tracking ETag"));
          resolve(etag.replace(/"/g, ""));
        });

        Upload.addListener("error", id, ({ error }) => {
          console.error(`[BgUpload] Native error event captured on pipeline ${id}:`, error);
          reject(new Error(error));
        });

        Upload.addListener("cancelled", id, () => {
          console.log(`[BgUpload] Native channel confirmed safe teardown cancellation for stream ${id}`);
          reject(new DOMException("Cancelled", "AbortError"));
        });
      })
      .catch((err) => {
        console.error("[BgUpload] Critical system failure trying to boot startUpload configuration:", err);
        reject(err);
      });
  });
}