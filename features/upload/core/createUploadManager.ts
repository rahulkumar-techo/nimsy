/**
 * Upload Manager Factory
 * Creates an isolated upload manager with no singleton architecture.
 * Manages concurrent chunk uploads with retry, pause, resume, and cancel support.
 */

import { UploadWorker } from "../service/upload.worker";
import { uploadApi } from "../services/upload.api";
import * as uploadStorage from "../storage/upload.storage";
import {
  StartUploadParams,
  UploadSession,
  UploadStatus,
  PresignedPart,
  UploadedPart,
  UploadCallbacks,
} from "../types/upload.types";
import { createChunkFile, deleteChunkFile } from "../utils/chunk";
import { UploadNotificationService } from "../service/notification.service";

const CONCURRENCY = 3;
const BACKOFF_MS = [1000, 2000, 4000, 8000, 16000] as const;

type TaskQueue = Array<{
  part: PresignedPart;
  startByte: number;
  endByte: number;
}>;

type ActiveUpload = {
  controller: AbortController;
  partNumber: number;
};

/**
 * Checks if an error is retryable based on type or HTTP status.
 * Does not retry on 4xx client errors.
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (
      message.includes("timeout") ||
      message.includes("network") ||
      message.includes("econn") ||
      message.includes("etimedout") ||
      message.includes("enotfound") ||
      message.includes("ehostunreach")
    ) {
      return true;
    }
  }

  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    (error as { response?: { status?: number } }).response?.status &&
    (error as { response?: { status?: number } }).response!.status! >= 500
  ) {
    return true;
  }

  return false;
}

/**
 * Exponential backoff sleep utility.
 */
async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retries an operation with exponential backoff.
 */
async function retry<T>(operation: () => Promise<T>, attempt: number = 0): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (attempt >= BACKOFF_MS.length || !isRetryableError(error)) {
      throw error;
    }
    const delay = BACKOFF_MS[attempt] ?? BACKOFF_MS[BACKOFF_MS.length - 1];
    await sleep(delay);
    return retry(operation, attempt + 1);
  }
}

/**
 * Creates an isolated upload manager instance.
 * Each call returns a fresh manager with its own state.
 */
export function createUploadManager(callbacks?: UploadCallbacks) {
  let session: UploadSession | null = null;
  let paused = false;
  let cancelled = false;
  const activeUploads = new Map<number, ActiveUpload>();
  let cursor: number;
  let taskQueue: TaskQueue | null = null;

  const activeChunkBytes = new Map<number, number>();

  /**
   * Persists session state with updated timestamp.
   */
  function persist(): void {
    if (session) {
      session = { ...session, updatedAt: Date.now() };
      uploadStorage.saveSession(session);
    }
  }

  /**
   * Updates upload status and notifies callbacks.
   */
  function updateStatus(status: UploadStatus): void {
    callbacks?.onStatusChange?.(status);
  }

  /**
   * Calculates global progress percentage from uploaded parts.
   */
  function calculateProgress(): number {
    if (!session) return 0;
    const fraction = session.uploadedParts.length / session.totalParts;
    return Math.min(100, Math.max(0, fraction * 100));
  }

  /**
   * Emits a full progress update to the consumer.
   */
  function emitProgress(uploadedBytes: number): void {
    if (!session) return;
    callbacks?.onProgress?.({
      progress: calculateProgress(),
      uploadedBytes: Math.min(uploadedBytes, session.fileSize),
      totalBytes: session.fileSize,
      activeParts: activeUploads.size,
      completedParts: session.uploadedParts.length,
      totalParts: session.totalParts,
    });
  }

  /**
   * Gets parts not yet uploaded based on server state.
   */
  function getRemainingParts(
    allParts: PresignedPart[],
    uploaded: UploadedPart[],
  ): TaskQueue {
    if (!allParts) {
      console.error("[UploadManager] Critical: presignedUrls (allParts) is undefined or missing!");
      return [];
    }

    const uploadedSet = new Set(uploaded.map((p) => p.partNumber));
    const result: TaskQueue = [];

    for (const part of allParts) {
      if (!uploadedSet.has(part.partNumber) && session) {
        const startByte = (part.partNumber - 1) * session.chunkSize;
        const endByte = Math.min(startByte + session.chunkSize, session.fileSize);
        result.push({ part, startByte, endByte });
      }
    }

    return result;
  }

  /**
   * Fetches fresh presigned URLs for the given part numbers.
   * Used on resume, since originally-issued URLs may have expired.
   */
  async function reSignParts(partNumbers: number[]): Promise<PresignedPart[]> {
    if (!session || partNumbers.length === 0) return [];

    const response = await uploadApi.singleChunk({
      uploadId: session.uploadId,
      key: session.key,
      partNumbers,
    });

    return response.parts.map((p) => ({ partNumber: p.partNumber, url: p.presignedUrl }));
  }

  /**
   * Reports a successfully uploaded chunk to the backend so server-side
   * state stays in sync, independent of local storage. Fire-and-forget:
   * local state is already authoritative for resuming this session, so a
   * failure here shouldn't block the upload loop -- just log it.
   */
  function reportChunkUploaded(partNumber: number, etag: string): void {
    if (!session) return;
    uploadApi
      .markAsChunkUploaded({ params: { vid: session.videoId }, etag, partNumber })
      .catch((err) => console.error(`[UploadManager] Failed to report part ${partNumber} as uploaded`, err));
  }

  /**
   * Uploads a single chunk to S3 using presigned URL.
   * Uses native file slicing and background upload to avoid memory bloat.
   */
  async function uploadChunk(task: TaskQueue[number]): Promise<string> {
    if (!session) throw new Error("Session lost during upload");

    const p = task.part.partNumber;
    let chunkPath: string | null = null;
    activeUploads.set(p, { controller: new AbortController(), partNumber: p });

    try {
      chunkPath = await createChunkFile(session.fileUri, session.uploadId, p, task.startByte, task.endByte);

      let resolvedEtag: string | null = null;

      const worker = new UploadWorker(
        [{ partNumber: p, fileUri: chunkPath, url: task.part.url, startByte: task.startByte, endByte: task.endByte }],
        {
          onChunkProgress: ({ partNumber, uploadedBytes }) => {
            activeChunkBytes.set(partNumber, uploadedBytes);
            if (!session) return;

            const activeBytes = Array.from(activeChunkBytes.values()).reduce((sum, bytes) => sum + bytes, 0);
            const totalUploadedBytes = (session.uploadedParts.length * session.chunkSize) + activeBytes;

            emitProgress(totalUploadedBytes);
          },
          onChunkComplete: (partNumber, etag) => {
            activeChunkBytes.delete(partNumber);
            resolvedEtag = etag;
          },
          onChunkError: (partNumber, error) => {
            activeChunkBytes.delete(partNumber);
            console.error(`[UploadManager] Part ${partNumber} failed`, error);
          },
        }
      );

      await worker.run();

      if (!resolvedEtag) {
        throw new Error(`Upload completed without an etag for part ${p}`);
      }

      return resolvedEtag;
    } finally {
      activeUploads.delete(p);
      if (chunkPath) {
        await deleteChunkFile(chunkPath).catch((err) =>
          console.error("[UploadManager] File deletion failed", err)
        );
      }
    }
  }

  function handleUploadSuccess(partNumber: number, etag: string): void {
    if (!session || cancelled) return;

    if (session.uploadedParts.some((p) => p.partNumber === partNumber)) return;

    activeChunkBytes.delete(partNumber);
    session = { ...session, uploadedParts: [...session.uploadedParts, { partNumber, etag }] };
    persist();

    reportChunkUploaded(partNumber, etag);

    const activeBytes = Array.from(activeChunkBytes.values()).reduce((sum, bytes) => sum + bytes, 0);
    const uploadedBytes = (session.uploadedParts.length * session.chunkSize) + activeBytes;
    emitProgress(uploadedBytes);
  }

  function handleUploadFailure(error: unknown): void {
    if (error instanceof Error && error.name === "AbortError") {
      // Intentional abort from pause/cancel; not a real failure.
      return;
    }

    console.error("[UploadManager] Internal worker error encountered:", error);

    if (session) {
      session = { ...session, status: "FAILED" };
      persist();
    }
    updateStatus("FAILED");
    callbacks?.onError?.(error instanceof Error ? error : new Error(String(error)));
    UploadNotificationService.showFailed();
  }

  function getNextTask(): TaskQueue[number] | null {
    if (!taskQueue || cursor >= taskQueue.length) {
      return null;
    }
    const currentTask = taskQueue[cursor++];
    return currentTask ?? null;
  }

  async function worker(): Promise<void> {
    while (!paused && !cancelled) {
      const task = getNextTask();
      if (!task) break;

      try {
        const etag = await retry(() => uploadChunk(task));
        handleUploadSuccess(task.part.partNumber, etag);
      } catch (error) {
        handleUploadFailure(error);
        return; // Terminal error ends this execution thread
      }
    }
  }

  /**
   * Processes the upload queue with CONCURRENCY workers.
   */
  async function processQueue(): Promise<void> {
    if (!session) {
      console.error("[UploadManager] Cannot process queue: Session payload is completely null.");
      return;
    }

    if (session.uploadedParts.length >= session.totalParts) {
      await completeUpload();
      return;
    }

    taskQueue = getRemainingParts(session.presignedUrls, session.uploadedParts);
    cursor = 0;

    session = { ...session, status: "UPLOADING" };
    persist();
    updateStatus("UPLOADING");
    UploadNotificationService.showProgress(0);

    // Each worker runs independently and competes for tasks from the shared queue.
    await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

    if (cancelled) {
      updateStatus("CANCELLED");
    } else if (paused) {
      updateStatus("PAUSED");
    } else if (session && session.uploadedParts.length >= session.totalParts) {
      await completeUpload();
    } else if (!session) {
      UploadNotificationService.showFailed();
    }
  }

  /**
   * Finalizes the multipart upload on the backend.
   */
  async function completeUpload(): Promise<void> {
    if (!session) return;

    session = { ...session, status: "COMPLETING" };
    persist();
    updateStatus("COMPLETING");

    try {
      const sortedParts = [...session.uploadedParts].sort((a, b) => a.partNumber - b.partNumber);

      await uploadApi.complete({
        uploadId: session.uploadId,
        videoId: session.videoId,
        parts: sortedParts,
      });

      session = { ...session, status: "COMPLETED" };
      persist();
      uploadStorage.removeSession();
      updateStatus("COMPLETED");
      UploadNotificationService.showCompleted();
    } catch (error) {
      console.error("[UploadManager] API exception while completing multipart upload:", error);
      session = { ...session, status: "FAILED" };
      persist();
      callbacks?.onError?.(error instanceof Error ? error : new Error(String(error)));
      UploadNotificationService.showFailed();
    }
  }

  /**
   * Starts a new upload session.
   */
  async function start(params: StartUploadParams): Promise<void> {
    clearStaleSession();
    if (uploadStorage.hasSession()) {
      console.error("[UploadManager] System locked. Storage states show a parallel active session.");
      throw new Error("Another upload already");
    }

    paused = false;
    cancelled = false;

    updateStatus("INITIALIZING");

    const { allowRating, ...restMetadata } = params.metadata;

    const initResponse = await uploadApi.initialize({
      ...restMetadata,
      fileName: params.fileName,
      mimeType: params.mimeType,
      fileSize: params.fileSize,
      allowRatings: allowRating,
    });

    session = {
      videoId: initResponse.videoId,
      uploadId: initResponse.uploadId,
      key: initResponse.objectKey,
      fileUri: params.fileUri,
      fileName: params.fileName,
      mimeType: params.mimeType,
      fileSize: params.fileSize,
      chunkSize: initResponse.chunkSize,
      totalParts: initResponse.totalChunks,
      // default keep 0
      highestProgressReached: 0,
      presignedUrls: initResponse.urls,
      uploadedParts: [],
      metadata: params.metadata,
      status: "INITIATED",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    persist();
    updateStatus("INITIATED");
    await processQueue();
  }

  /**
   * Resumes an interrupted upload.
   * Fetches server state to avoid duplicate uploads, then re-signs
   * URLs for any remaining parts since the originals may have expired.
   */
  async function resume(): Promise<void> {
    const stored = uploadStorage.getSession();
    if (!stored) {
      console.error("[UploadManager] Action blocked: Local instance cache metadata layer lookup yielded null.");
      throw new Error("No upload session found");
    }

    session = stored;
    paused = false;
    cancelled = false;
    updateStatus("INITIALIZING");

    const serverState = await uploadApi.getStatus(session.videoId);



    if (serverState.status === "COMPLETED") {
      uploadStorage.removeSession();
      updateStatus("COMPLETED");
      return;
    }

    session = { ...session, uploadedParts: serverState.uploadedParts };

    // Recalculate progress after syncing with backend
    const uploadedBytes = Math.min(
      session.uploadedParts.length * session.chunkSize,
      session.fileSize,
    );

// deleteChunkFile
    const realProgress =
      (uploadedBytes / session.fileSize) * 100;

    session = {
      ...session,
      highestProgressReached: Math.max(
        session.highestProgressReached ?? 0,
        realProgress,
      ),
    };

    callbacks?.onProgress?.({
      progress: session.highestProgressReached,
      uploadedBytes,
      totalBytes: session.fileSize,

      activeParts: activeChunkBytes.size,

      completedParts:
        session.uploadedParts.length,

      totalParts:
        session.totalParts,
    });


    const remainingPartNumbers = session.presignedUrls
      .map((p) => p.partNumber)
      .filter((partNumber) => !session!.uploadedParts.some((u) => u.partNumber === partNumber));

    try {
      const freshParts = await reSignParts(remainingPartNumbers);
      if (freshParts.length > 0) {
        const freshByPart = new Map(freshParts.map((p) => [p.partNumber, p]));
        session = {
          ...session,
          presignedUrls: session.presignedUrls.map((p) => freshByPart.get(p.partNumber) ?? p),
        };
      }
    } catch (error) {
      // Non-fatal: fall back to the existing URLs. They may still be valid,
      // and individual chunk failures will surface through the normal retry path.
      console.error("[UploadManager] Failed to re-sign remaining parts on resume", error);
    }

    persist();
    await processQueue();
  }

  /**
   * Pauses the upload. Aborts all active workers.
   */
  function pause(): void {
    if (!session || session.status !== "UPLOADING") {
      return;
    }
    paused = true;
    activeUploads.forEach((upload) => upload.controller.abort());
    activeUploads.clear();
    updateStatus("PAUSED");
  }

  /**
   * Cancels the upload. Cleans up session and active uploads.
   */
  function cancel(): void {
    cancelled = true;
    paused = false;
    activeUploads.forEach((upload) => upload.controller.abort());
    activeUploads.clear();

    if (session) {
      uploadStorage.removeSession();
      session = null;
    }

    updateStatus("CANCELLED");
  }

  function clearStaleSession(): void {
    const historicalSession = uploadStorage.getSession();
    if (!historicalSession) return;

    const terminalStates = [
      "INITIATED",
      "FAILED",
      "COMPLETED",
      "CANCELLED",
      "UPLOADING",
    ];

    if (terminalStates.includes(historicalSession.status)) {
      uploadStorage.removeSession();
    }
  }

  return {
    start,
    resume,
    pause,
    cancel,
  };
}