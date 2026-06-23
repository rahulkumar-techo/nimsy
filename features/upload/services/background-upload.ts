// Thin orchestration wrapper around react-native-background-upload.
// The OS (NSURLSession on iOS, a WorkManager-backed service on Android) owns
// the actual transfer — this module only starts tasks, listens for native
// events, and mirrors state into the session store. No JS timers drive the
// upload itself; JS just reacts to native events.

import Upload from "react-native-background-upload";
import { uploadSessionStore } from "../storage/upload-session.store";
import { PersistedPart } from "../types/session.types";

type PartEventHandlers = {
  onProgress?: (percent: number) => void;
  onCompleted: (etag: string) => void;
  onError: (error: Error) => void;
};

function extractEtag(responseHeaders: Record<string, string> | undefined): string | null {
  if (!responseHeaders) return null;
  const raw = responseHeaders["ETag"] ?? responseHeaders["etag"];
  return raw ? raw.replace(/"/g, "") : null;
}

export const backgroundUploadService = {
  // Start a single S3 part as a native, OS-managed upload task. `filePath`
  // points at the native chunk file produced by the file chunker — it is
  // streamed by the OS, never read into JS.
  async startPart(
    videoId: string,
    part: PersistedPart,
    filePath: string,
    handlers: PartEventHandlers,
  ): Promise<string> {
    const nativeUploadId = await Upload.startUpload({
      url: part.url,
      path: filePath,
      method: "PUT",
      type: "raw",
      headers: { "Content-Type": "application/octet-stream" },
      notification: {
        enabled: true,
        autoClear: true,
        onProgressTitle: "Uploading video",
        onProgressMessage: `Part ${part.partNumber}`,
      },
    });

    uploadSessionStore.updatePart(videoId, part.partNumber, { status: "UPLOADING", nativeUploadId });
    backgroundUploadService.attachListeners(videoId, part.partNumber, nativeUploadId, handlers);
    return nativeUploadId;
  },

  // Re-attach JS listeners to an already-running (or already-finished)
  // native task. Needed after a JS reload / app relaunch, since the upload
  // itself survives at the OS level but JS event subscriptions don't.
  attachListeners(videoId: string, partNumber: number, nativeUploadId: string, handlers: PartEventHandlers): void {
    Upload.addListener("progress", nativeUploadId, (data: { progress: number }) => {
      handlers.onProgress?.(data.progress);
    });

    Upload.addListener(
      "completed",
      nativeUploadId,
      (data: { responseCode: number; responseHeaders?: Record<string, string> }) => {
        if (data.responseCode >= 200 && data.responseCode < 300) {
          const etag = extractEtag(data.responseHeaders);
          if (!etag) {
            handlers.onError(new Error(`Part ${partNumber} completed but response had no ETag.`));
            return;
          }
          uploadSessionStore.updatePart(videoId, partNumber, { status: "UPLOADED", etag });
          handlers.onCompleted(etag);
        } else {
          handlers.onError(new Error(`Part ${partNumber} failed with status ${data.responseCode}.`));
        }
      },
    );

    Upload.addListener("error", nativeUploadId, (data: { error: string }) => {
      uploadSessionStore.updatePart(videoId, partNumber, { status: "FAILED" });
      handlers.onError(new Error(`Part ${partNumber} error: ${data.error}`));
    });

    Upload.addListener("cancelled", nativeUploadId, () => {
      uploadSessionStore.updatePart(videoId, partNumber, { status: "FAILED" });
      handlers.onError(new Error(`Part ${partNumber} was cancelled.`));
    });
  },

  async cancel(nativeUploadId: string): Promise<void> {
    try {
      await Upload.cancelUpload(nativeUploadId);
    } catch (err) {
      console.warn("Failed to cancel native upload task:", err);
    }
  },
};
