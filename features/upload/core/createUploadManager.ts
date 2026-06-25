/**
 * Upload Manager Factory
 * Creates an isolated upload manager with no singleton architecture.
 * Manages concurrent chunk uploads with retry, pause, resume, and cancel support.
 */

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
import { uploadChunkInBackground } from "../service/background-upload.service";

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
    console.warn(`[UploadManager] Retry attempt ${attempt} failed. Error:`, error);
    if (attempt >= BACKOFF_MS.length || !isRetryableError(error)) {
      throw error;
    }
    const delay = BACKOFF_MS[attempt] ?? BACKOFF_MS[BACKOFF_MS.length - 1];
    console.log(`[UploadManager] Backing off for ${delay}ms...`);
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

  /**
   * Persists session state with updated timestamp.
   */
  function persist(): void {
    if (session) {
      session = { ...session, updatedAt: Date.now() };
      console.log(`[UploadManager] Persisting session. Status: ${session.status}, Uploaded parts: ${session.uploadedParts.length}/${session.totalParts}`);
      uploadStorage.saveSession(session);
    }
  }

  /**
   * Updates upload status and notifies callbacks.
   */
  function updateStatus(status: UploadStatus): void {
    console.log(`[UploadManager] Status changed to -> ${status}`);
    callbacks?.onStatusChange?.(status);
  }

  /**
   * Calculates global progress from uploaded parts.
   */
  function calculateProgress(): number {
    if (!session) return 0;
    const progress = session.uploadedParts.length / session.totalParts;
    console.log(`[UploadManager] Global Progress Calculated: ${(progress * 100).toFixed(2)}%`);
    return progress;
  }

  /**
   * Gets parts not yet uploaded based on server state.
   */
  function getRemainingParts(
    allParts: PresignedPart[],
    uploaded: UploadedPart[],
  ): TaskQueue {
    console.log(`[UploadManager] Evaluating remaining parts. Total from config: ${allParts?.length}, Already uploaded: ${uploaded?.length}`);

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

    console.log(`[UploadManager] Task queue populated with ${result.length} remaining chunks.`);
    return result;
  }

  /**
   * Uploads a single chunk to S3 using presigned URL.
   * Uses native file slicing and background upload to avoid memory bloat.
   */
  async function uploadChunk(task: TaskQueue[number]): Promise<string> {
    if (!session) throw new Error("Session lost during upload");

    console.log(`[UploadManager] Beginning upload for Part #${task.part.partNumber} (${task.startByte}-${task.endByte} bytes)`);
    let chunkPath: string | null = null;
    const controller = new AbortController();
    activeUploads.set(task.part.partNumber, { controller, partNumber: task.part.partNumber });

    try {
      chunkPath = await createChunkFile(
        session.fileUri,
        task.part.partNumber,
        task.startByte,
        task.endByte,
      );
      console.log(`[UploadManager] Temporary chunk file created at: ${chunkPath}`);

      return await uploadChunkInBackground({
        filePath: chunkPath,
        url: task.part.url,
        signal: controller.signal,
        onProgress: (progress) => {
          console.log(`[UploadManager] Part #${task.part.partNumber} Progress: ${(progress * 100).toFixed(1)}%`);
          callbacks?.onChunkProgress?.(task.part.partNumber, progress);
        },
      });
    } finally {
      activeUploads.delete(task.part.partNumber);
      if (chunkPath) {
        console.log(`[UploadManager] Cleaning up temp file for Part #${task.part.partNumber}`);
        await deleteChunkFile(chunkPath).catch(err => console.error("[UploadManager] File deletion failed", err));
      }
    }
  }

  function handleUploadSuccess(partNumber: number, etag: string): void {
    console.log(`[UploadManager] S3 accepted Part #${partNumber} with ETag: ${etag}`);
    if (!session || cancelled) {
      console.warn(`[UploadManager] handleUploadSuccess abandoned. Session active: ${!!session}, Cancelled: ${cancelled}`);
      return;
    }

    if (session.uploadedParts.some((p) => p.partNumber === partNumber)) {
      console.log(`[UploadManager] Part #${partNumber} already logged in session. Ignoring duplicate.`);
      return;
    }

    session = {
      ...session,
      uploadedParts: [...session.uploadedParts, { partNumber, etag }],
    };
    persist();
    callbacks?.onProgress?.(calculateProgress());
  }

  function handleUploadFailure(error: unknown): void {
    console.error("[UploadManager] Internal worker error encountered:", error);
    if (error instanceof Error && error.name === "AbortError") {
      console.log("[UploadManager] Abort handled intentionally (upload was paused/cancelled).");
      return;
    }

    if (session) {
      session = { ...session, status: "FAILED" };
      persist();
    }
    updateStatus("FAILED");
    callbacks?.onError?.(error instanceof Error ? error : new Error(String(error)));
  }

  function getNextTask(): TaskQueue[number] | null {
    if (!taskQueue || cursor >= taskQueue.length) {
      console.log(`[UploadManager] Queue ended or empty. Cursor: ${cursor}, Queue size: ${taskQueue?.length ?? 0}`);
      return null;
    }
    const currentTask = taskQueue[cursor++];
    console.log(`[UploadManager] Worker claiming next task. Queue Index: ${cursor - 1}/${taskQueue.length} (Part #${currentTask.part.partNumber})`);
    return currentTask ?? null;
  }

  async function worker(): Promise<void> {
    console.log("[UploadManager] Concurrent worker thread spawned.");
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
    console.log(`[UploadManager] Worker thread closing down. Reason -> Paused: ${paused}, Cancelled: ${cancelled}`);
  }

  /**
   * Processes the upload queue with CONCURRENCY workers.
   */
  async function processQueue(): Promise<void> {
    if (!session) {
      console.error("[UploadManager] Cannot process queue: Session payload is completely null.");
      return;
    }

    console.log(`[UploadManager] Processing queue. Status: ${session.status}, Uploaded parts tally: ${session.uploadedParts.length}/${session.totalParts}`);

    if (session.uploadedParts.length >= session.totalParts) {
      console.log("[UploadManager] Quick check reveals all parts are already uploaded. Skipping to completeUpload.");
      await completeUpload();
      return;
    }

    taskQueue = getRemainingParts(session.presignedUrls, session.uploadedParts);
    cursor = 0;

    session = { ...session, status: "UPLOADING" };
    persist();
    updateStatus("UPLOADING");

    console.log(`[UploadManager] Spawning ${CONCURRENCY} concurrent pipeline workers...`);
    // Each worker runs independently and competes for tasks from the shared queue.
    await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

    if (cancelled) {
      updateStatus("CANCELLED");
    } else if (paused) {
      updateStatus("PAUSED");
    }
  }

  /**
   * Finalizes the multipart upload on the backend.
   */
  async function completeUpload(): Promise<void> {
    if (!session) return;

    console.log("[UploadManager] Finalizing process: Submitting complete upload command to API.");
    session = { ...session, status: "COMPLETING" };
    persist();

    try {
      const sortedParts = [...session.uploadedParts].sort((a, b) => a.partNumber - b.partNumber);
      console.log("[UploadManager] Dispatching payload to uploadApi.complete with sorted parts structure:", JSON.stringify(sortedParts));

      await uploadApi.complete({
        videoId: session.videoId,
        uploadedParts: sortedParts,
      });

      console.log("[UploadManager] Backend accepted merge. Clearing persistent store allocations.");
      session = { ...session, status: "COMPLETED" };
      persist();
      uploadStorage.removeSession();
      updateStatus("COMPLETED");
    } catch (error) {
      console.error("[UploadManager] API Exception trying to compile/complete tracking multipart process:", error);
      session = { ...session, status: "FAILED" };
      persist();
      callbacks?.onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * Starts a new upload session.
   */
  async function start(params: StartUploadParams): Promise<void> {
    console.log("[UploadManager] Initializing start command. Input params payload:", JSON.stringify(params, null, 2));
    clearStaleSession();
    if (uploadStorage.hasSession()) {
      console.error("[UploadManager] System locked. Storage states show a parallel active session.");
      throw new Error("Another upload already");
    }

    paused = false;
    cancelled = false;

    const { allowRating, ...restMetadata } = params.metadata;

    console.log("[UploadManager] Contacting uploadApi.initialize backend service...");
    const initResponse = await uploadApi.initialize({
      ...restMetadata,
      fileName: params.fileName,
      mimeType: params.mimeType,
      fileSize: params.fileSize,
      allowRatings: allowRating,
    });

    console.log("[UploadManager] Backend response from initialize:", JSON.stringify(initResponse, null, 2));

    // Notice we map incoming API fields directly here
    session = {
      videoId: initResponse.videoId,
      uploadId: initResponse.uploadId,
      fileUri: params.fileUri,
      fileName: params.fileName,
      mimeType: params.mimeType,
      fileSize: params.fileSize,
      chunkSize: initResponse.chunkSize,
      totalParts: initResponse.totalParts,
      presignedUrls: initResponse.urls, // Ensure your schema normalizes target fields perfectly
      uploadedParts: [],
      metadata: params.metadata,
      status: "INITIATED",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    console.log("[UploadManager] Setting session snapshot into memory landscape storage.");
    persist();
    await processQueue();
  }

  /**
   * Resumes an interrupted upload.
   * Fetches server state to avoid duplicate uploads.
   */
  async function resume(): Promise<void> {
    console.log("[UploadManager] Processing resume command initiation.");
    const stored = uploadStorage.getSession();
    if (!stored) {
      console.error("[UploadManager] Action blocked: Local instance cache metadata layer lookup yielded null.");
      throw new Error("No upload session found");
    }

    session = stored;
    paused = false;
    cancelled = false;

    console.log(`[UploadManager] Validating remote stream for video tracker node ID: ${session.videoId}`);
    const serverState = await uploadApi.getStatus(session.videoId);
    console.log("[UploadManager] Sync Response from Remote Tracking Status Node:", JSON.stringify(serverState, null, 2));

    if (serverState.status === "COMPLETED") {
      console.log("[UploadManager] Core server records specify asset is already finished processing.");
      uploadStorage.removeSession();
      updateStatus("COMPLETED");
      return;
    }

    session = { ...session, uploadedParts: serverState.uploadedParts };
    persist();

    await processQueue();
  }

  /**
   * Pauses the upload. Aborts all active workers.
   */
  function pause(): void {
    console.log("[UploadManager] Pause requested.");
    if (!session || session.status !== "UPLOADING") {
      console.warn(`[UploadManager] Pause ignored. Session status is currently: ${session?.status ?? "NULL"}`);
      return;
    }
    paused = true;
    console.log(`[UploadManager] Aborting ${activeUploads.size} executing upload chunk streams...`);
    activeUploads.forEach((upload) => upload.controller.abort());
    activeUploads.clear();
    updateStatus("PAUSED");
  }

  /**
   * Cancels the upload. Cleans up session and active uploads.
   */
  function cancel(): void {
    console.log("[UploadManager] Cancel requested. Purging volatile structures.");
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
    console.log("[UploadManager] Auditing local tracking layer cache for stale sessions:", JSON.stringify(historicalSession, null, 2));

    if (!historicalSession) return;

    const terminalStates = [
      "INITIATED",
      "FAILED",
      "COMPLETED",
      "CANCELLED",
      "UPLOADING"
    ];

    if (terminalStates.includes(historicalSession.status)) {
      console.log(`[UploadManager] Dropping non-resumable stale cache node pointing to status: ${historicalSession.status}`);
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