// Called once at app startup (see hooks/use-upload-status.ts). Reconciles
// locally-persisted sessions against the backend's authoritative status,
// re-attaches listeners for parts still uploading at the OS level, and
// re-kicks any parts that need it. No JS timers are needed to keep an
// upload alive — this only runs once per app launch to pick up the pieces.

import { getUploadStatus } from "../api/status";
import { completeUpload } from "../api/complete-upload";
import { uploadSessionStore } from "../storage/upload-session.store";
import { multipartUploader } from "./multipart-uploader";
import { backgroundUploadService } from "./background-upload";
import { UploadedPart } from "../types/upload.types";
import { UploadSession, isSessionComplete } from "../types/session.types";

async function resumeSession(session: UploadSession, onProgress?: (videoId: string, percent: number) => void): Promise<void> {
  // Re-attach to parts already running at the OS level so we get their
  // completion events even though JS just (re)started.
  session.parts
    .filter((p) => p.status === "UPLOADING" && p.nativeUploadId)
    .forEach((p) => {
      backgroundUploadService.attachListeners(session.videoId, p.partNumber, p.nativeUploadId as string, {
        onProgress: (percent) => onProgress?.(session.videoId, percent),
        onCompleted: () => {},
        onError: (err) => console.warn(err.message),
      });
    });

  // Reconcile against the backend in case parts completed on S3 while the
  // app was dead.
  let serverStatus;
  try {
    serverStatus = await getUploadStatus(session.videoId);
  } catch (err) {
    console.warn(`Could not fetch server status for ${session.videoId}, will retry later.`, err);
    return;
  }

  if (serverStatus.isCompleted) {
    uploadSessionStore.setPhase(session.videoId, "COMPLETED");
    return;
  }

  // Re-kick any part that isn't actively uploading and hasn't succeeded yet.
  const staleParts = session.parts.filter((p) => p.status !== "UPLOADED" && p.status !== "UPLOADING");

  const results: UploadedPart[] = session.parts
    .filter((p) => p.status === "UPLOADED" && p.etag)
    .map((p) => ({ partNumber: p.partNumber, etag: p.etag as string }));

  for (const part of staleParts) {
    try {
      if (!part.localChunkPath) continue;
      const result = await multipartUploader.resumePart(session.videoId, part, (percent) =>
        onProgress?.(session.videoId, percent),
      );
      results.push(result);
    } catch (err) {
      console.warn(`Failed to resume part ${part.partNumber} for ${session.videoId}:`, err);
    }
  }

  const refreshed = uploadSessionStore.get(session.videoId);
  if (refreshed && isSessionComplete(refreshed)) {
    await completeUpload({ videoId: refreshed.videoId, uploadId: refreshed.uploadId, parts: results });
    uploadSessionStore.setPhase(refreshed.videoId, "PROCESSING");
  }
}

export const resumeUpload = {
  async resumeAll(onProgress?: (videoId: string, percent: number) => void): Promise<void> {
    const incomplete = uploadSessionStore.getIncomplete();
    await Promise.all(incomplete.map((session) => resumeSession(session, onProgress)));
  },
};
