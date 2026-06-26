/**
 * Upload Manager Factory — YouTube-Style Deterministic Progress
 * 
 * Architecture:
 * - Single source of truth: partState Map tracks every part's exact status
 * - Progress is recalculated from scratch every time (no accumulators)
 * - YOUTUBE-STYLE: Only COMPLETED parts count toward progress
 *   In-flight bytes are shown separately (activeParts count) but don't affect %
 * - 100% only appears when ALL parts are verified and completeUpload() succeeds
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

type PartState =
  | { status: "PENDING"; size: number }
  | { status: "UPLOADING"; uploadedBytes: number; size: number }
  | { status: "COMPLETED"; etag: string; size: number };

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

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
 * 
 * PROGRESS MODEL (YouTube-Style):
 * - Progress % = (completedParts / totalParts) × 100
 * - Only fully verified chunks count. No in-flight bytes affect the percentage.
 * - The bar "jumps" forward when each chunk finishes — this is intentional.
 * - 100% only appears after completeUpload() succeeds.
 * - In-flight activity is shown via activeParts count, not the percentage.
 */
export function createUploadManager(callbacks?: UploadCallbacks) {
  let session: UploadSession | null = null;
  let paused = false;
  let cancelled = false;
  const activeWorkers = new Map<number, UploadWorker>();
  let cursor: number;
  let taskQueue: TaskQueue | null = null;

  /** Single source of truth for all part states */
  const partState = new Map<number, PartState>();

  function persist(): void {
    if (session) {
      session = { ...session, updatedAt: Date.now() };
      uploadStorage.saveSession(session);
    }
  }

  function updateStatus(status: UploadStatus): void {
    callbacks?.onStatusChange?.(status);
  }

  /**
   * YOUTUBE-STYLE PROGRESS CALCULATION
   * 
   * ONLY completed parts count toward the percentage.
   * In-flight bytes are tracked for diagnostics but do NOT affect progress.
   * 
   * This guarantees:
   * - Progress never decreases
   * - 100% only appears when truly done
   * - No rounding artifacts from in-flight bytes
   */
  function calculateProgress(): {
    progress: number;
    uploadedBytes: number;
    completedBytes: number;
    inFlightBytes: number;
  } {
    if (!session) {
      return { progress: 0, uploadedBytes: 0, completedBytes: 0, inFlightBytes: 0 };
    }

    let completedBytes = 0;
    let inFlightBytes = 0;

    for (const state of partState.values()) {
      if (state.status === "COMPLETED") {
        completedBytes += state.size;
      } else if (state.status === "UPLOADING") {
        inFlightBytes += state.uploadedBytes;
      }
    }

    const totalUploadedBytes = completedBytes + inFlightBytes;

    // YOUTUBE-STYLE: progress based ONLY on completed parts
    const progress = (completedBytes / session.fileSize) * 100;

    return {
      progress: Math.min(progress, 99.99), // NEVER show 100% until completeUpload()
      uploadedBytes: Math.min(totalUploadedBytes, session.fileSize),
      completedBytes,
      inFlightBytes,
    };
  }

  /** Monotonic guard — progress never decreases */
  let highestProgressEmitted = 0;

  function emitProgress(force = false): void {
    if (!session) return;

    const { progress, uploadedBytes, completedBytes, inFlightBytes } = calculateProgress();

    const clampedProgress = Math.max(progress, highestProgressEmitted);

    if (!force && clampedProgress === highestProgressEmitted) {
      return; // No change, skip emit
    }

    highestProgressEmitted = clampedProgress;

    callbacks?.onProgress?.({
      progress: clampedProgress,
      uploadedBytes,
      totalBytes: session.fileSize,
      activeParts: activeWorkers.size,
      completedParts: session.uploadedParts.length,
      totalParts: session.totalParts,
      // Optional: expose these for UI to show "X MB uploading now"
      completedBytes,
      inFlightBytes,
    });
  }

  function initializePartState(totalParts: number, fileSize: number, chunkSize: number): void {
    partState.clear();

    for (let i = 1; i <= totalParts; i++) {
      const isLastPart = i === totalParts;
      const size = isLastPart
        ? fileSize - chunkSize * (totalParts - 1)
        : chunkSize;

      partState.set(i, { status: "PENDING", size });
    }
  }

  function setPartUploading(partNumber: number, uploadedBytes: number): void {
    const state = partState.get(partNumber);
    if (!state || state.status === "COMPLETED") return;

    partState.set(partNumber, {
      status: "UPLOADING",
      uploadedBytes: Math.min(uploadedBytes, state.size),
      size: state.size,
    });
  }

  function setPartCompleted(partNumber: number, etag: string): void {
    const state = partState.get(partNumber);
    if (!state) return;

    partState.set(partNumber, {
      status: "COMPLETED",
      etag,
      size: state.size,
    });
  }

  function setPartPending(partNumber: number): void {
    const state = partState.get(partNumber);
    if (!state) return;

    partState.set(partNumber, {
      status: "PENDING",
      size: state.size,
    });
  }

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

  async function reSignParts(partNumbers: number[]): Promise<PresignedPart[]> {
    if (!session || partNumbers.length === 0) return [];

    const response = await uploadApi.singleChunk({
      uploadId: session.uploadId,
      key: session.key,
      partNumbers,
    });

    return response.parts.map((p) => ({ partNumber: p.partNumber, url: p.presignedUrl }));
  }

  function reportChunkUploaded(partNumber: number, etag: string): void {
    if (!session) return;
    uploadApi
      .markAsChunkUploaded({ params: { vid: session.videoId }, etag, partNumber })
      .catch((err) => console.error(`[UploadManager] Failed to report part ${partNumber} as uploaded`, err));
  }

  async function uploadChunk(task: TaskQueue[number]): Promise<string> {
    if (!session) throw new Error("Session lost during upload");

    const partNumber = task.part.partNumber;
    let chunkPath: string | null = null;
    let resolvedEtag: string | null = null;

    try {
      chunkPath = await createChunkFile(
        session.fileUri,
        session.uploadId,
        partNumber,
        task.startByte,
        task.endByte
      );

      const worker = new UploadWorker(
        [{
          partNumber,
          fileUri: chunkPath,
          url: task.part.url,
          startByte: task.startByte,
          endByte: task.endByte,
        }],
        {
          onChunkProgress: ({ uploadedBytes }) => {
            setPartUploading(partNumber, uploadedBytes);
            // NOTE: We do NOT emit progress on chunk progress anymore.
            // The % only changes when a part completes. In-flight bytes
            // are silently tracked for diagnostics only.
          },
          onChunkComplete: (partNumber, etag) => {
            resolvedEtag = etag;
          },
          onChunkError: (partNumber, error) => {
            setPartPending(partNumber);
            console.error(`[UploadManager] Part ${partNumber} failed`, error);
          },
        }
      );

      activeWorkers.set(partNumber, worker);
      await worker.run();

      if (!resolvedEtag) {
        throw new Error(`Upload completed without ETag for part ${partNumber}`);
      }

      return resolvedEtag;

    } finally {
      activeWorkers.delete(partNumber);
      if (chunkPath) {
        await deleteChunkFile(chunkPath).catch((err) =>
          console.error("[UploadManager] Failed to delete chunk file", err)
        );
      }
    }
  }

  function handleUploadSuccess(partNumber: number, etag: string): void {
    if (!session || cancelled) return;

    if (session.uploadedParts.some((p) => p.partNumber === partNumber)) {
      return;
    }

    setPartCompleted(partNumber, etag);

    session = {
      ...session,
      uploadedParts: [...session.uploadedParts, { partNumber, etag }],
    };

    persist();
    reportChunkUploaded(partNumber, etag);
    emitProgress(true); // Emit on completion — this is when the bar jumps
  }

  function handleUploadFailure(error: unknown): void {
    if (error instanceof Error && error.name === "AbortError") {
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
        return;
      }
    }
  }

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

      // NOW we emit 100% — only after backend confirms success
      highestProgressEmitted = 100;
      callbacks?.onProgress?.({
        progress: 100,
        uploadedBytes: session.fileSize,
        totalBytes: session.fileSize,
        activeParts: 0,
        completedParts: session.totalParts,
        totalParts: session.totalParts,
      });

      UploadNotificationService.showCompleted();
    } catch (error) {
      console.error("[UploadManager] API exception while completing multipart upload:", error);
      session = { ...session, status: "FAILED" };
      persist();
      callbacks?.onError?.(error instanceof Error ? error : new Error(String(error)));
      UploadNotificationService.showFailed();
    }
  }

  async function start(params: StartUploadParams): Promise<void> {
    clearStaleSession();
    if (uploadStorage.hasSession()) {
      console.error("[UploadManager] System locked. Storage states show a parallel active session.");
      throw new Error("Another upload already");
    }

    paused = false;
    cancelled = false;
    partState.clear();
    activeWorkers.clear();
    taskQueue = null;
    cursor = 0;
    highestProgressEmitted = 0;

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
      presignedUrls: initResponse.urls,
      uploadedParts: [],
      metadata: params.metadata,
      status: "INITIATED",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    initializePartState(initResponse.totalChunks, params.fileSize, initResponse.chunkSize);

    persist();
    updateStatus("INITIATED");
    await processQueue();
  }

  async function resume(): Promise<void> {
    const stored = uploadStorage.getSession();

    if (!stored) {
      console.error("[UploadManager] Action blocked: Local session not found.");
      throw new Error("No upload session found");
    }

    session = stored;

    partState.clear();
    activeWorkers.clear();
    taskQueue = null;
    cursor = 0;
    highestProgressEmitted = 0;

    updateStatus("INITIALIZING");

    const serverState = await uploadApi.getStatus(session.videoId);

    if (serverState.status === "COMPLETED") {
      uploadStorage.removeSession();
      updateStatus("COMPLETED");
      return;
    }

    session = {
      ...session,
      uploadedParts: mergeUploadedParts(session.uploadedParts, serverState.uploadedParts),
    };

    initializePartState(session.totalParts, session.fileSize, session.chunkSize);

    for (const uploaded of session.uploadedParts) {
      setPartCompleted(uploaded.partNumber, uploaded.etag);
    }

    emitProgress(true);

    const remainingPartNumbers = session.presignedUrls
      .map((part) => part.partNumber)
      .filter(
        (partNumber) =>
          !session!.uploadedParts.some((uploaded) => uploaded.partNumber === partNumber)
      );

    try {
      if (remainingPartNumbers.length > 0) {
        const freshParts = await reSignParts(remainingPartNumbers);

        if (freshParts.length > 0) {
          const freshByPart = new Map(freshParts.map((part) => [part.partNumber, part]));

          session = {
            ...session,
            presignedUrls: session.presignedUrls.map(
              (part) => freshByPart.get(part.partNumber) ?? part
            ),
          };
        }
      }
    } catch (error) {
      console.error("[UploadManager] Failed to refresh presigned URLs during resume", error);
    }

    persist();
    await processQueue();
  }

  function pause(): void {
    if (!session || session.status !== "UPLOADING") return;

    paused = true;

    activeWorkers.forEach((worker) => worker.cancel());
    activeWorkers.clear();

    for (const [partNumber, state] of partState.entries()) {
      if (state.status === "UPLOADING") {
        setPartPending(partNumber);
      }
    }

    session = { ...session, status: "PAUSED" };
    persist();
    updateStatus("PAUSED");
  }

  function cancel(): void {
    cancelled = true;
    paused = false;

    activeWorkers.forEach((worker) => worker.cancel());
    activeWorkers.clear();
    partState.clear();
    taskQueue = null;
    cursor = 0;

    if (session) {
      uploadStorage.removeSession();
      session = null;
    }

    updateStatus("CANCELLED");
  }

  function clearStaleSession(): void {
    const historicalSession = uploadStorage.getSession();
    if (!historicalSession) return;

    const removableStates = ["FAILED", "COMPLETED", "CANCELLED"];

    if (removableStates.includes(historicalSession.status)) {
      uploadStorage.removeSession();
    }
  }

  function mergeUploadedParts(local: UploadedPart[], server: UploadedPart[]): UploadedPart[] {
    const merged = new Map<number, UploadedPart>();
    for (const p of local) merged.set(p.partNumber, p);
    for (const p of server) merged.set(p.partNumber, p);
    return Array.from(merged.values());
  }

  return {
    start,
    resume,
    pause,
    cancel,
  };
}