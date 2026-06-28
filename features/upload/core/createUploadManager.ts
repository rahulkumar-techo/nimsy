/**
 * Upload Manager — Final Working Edition
 *
 * Uses ReactNativeBlobUtil for chunk creation and file reading.
 * Uploads via XMLHttpRequest (standard, reliable, no RNFB.fetch() hang).
 *
 * FLOW:
 * 1. RNFB.fs.slice() — native file copy (fast)
 * 2. RNFB.fs.readFile() — native read into base64 (fast)
 * 3. base64 → Uint8Array — pure JS conversion (fast)
 * 4. XMLHttpRequest.send(Uint8Array) — standard upload (reliable)
 */

import ReactNativeBlobUtil from 'react-native-blob-util';
import { uploadApi } from '../api/upload.api';
import { UploadNotificationService } from '../services/notification.service';
import { UploadWorker } from '../services/upload.worker';
import * as uploadStorage from '../storage/upload.storage';
import {
  PresignedPart,
  ProgressUpdate,
  StartUploadParams,
  UploadCallbacks,
  UploadedPart,
  UploadSession, UploadStatus,
} from '../types/upload.types';
import { ChunkIntegrity } from '../utils/chunk/chunk-integrity.util';
import { uploadThumbnail } from '../utils/uploadThumbnail';
import { ConcurrencyController } from './manager/concurrency';
import { PersistController } from './manager/persist';

import NetInfo from "@react-native-community/netinfo";
// ═══════════════════════════════════════════════════════════════════════════════
// DEBUG
// ═══════════════════════════════════════════════════════════════════════════════
const DEBUG = typeof __DEV__ !== 'undefined' ? __DEV__ : false;
const log = (s: string, ...a: unknown[]) => { if (DEBUG) console.log(`[UM][${s}]`, ...a); };
const warn = (s: string, ...a: unknown[]) => { if (DEBUG) console.warn(`[UM][${s}]`, ...a); };
const err = (s: string, ...a: unknown[]) => { console.error(`[UM][${s}]`, ...a); };

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════════════════════
const BACKOFF_MS = [1000, 2000, 4000, 8000, 16000] as const;
// const CONCURRENCY = { BASE: 3, LOW_END: 2 };
const ETAG_BATCH_SIZE = 5;
const ETAG_FLUSH_MS = 2000;
const PROGRESS_THROTTLE_MS = 200;
let cancelled = false;


const CHUNK_CACHE_DIR = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/upload-chunks/`;

// function getConcurrency(): number {
//   try {
//     const mem = (global as any).performance?.memory?.usedJSHeapSize;
//     if (mem && mem < 100 * 1024 * 1024) return CONCURRENCY.LOW_END;
//   } catch { /* ignore */ }
//   return CONCURRENCY.BASE;
// }

function isRetryable(error: unknown): boolean {
  const message =
    error instanceof Error
      ? error.message.toLowerCase()
      : String(error).toLowerCase();

  return [
    "timeout",
    "network",
    "econn",
    "etimedout",
    "abort",
    "reset",
    "unable to resolve host",
    "failed to connect",
    "software caused connection abort",
    "no address associated with hostname",
    "socket closed",
    "connection refused",
  ].some(pattern => message.includes(pattern));
}

// const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));


async function cancellableSleep(ms: number) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);

    const interval = setInterval(() => {
      if (cancelled) {
        clearTimeout(timer);
        clearInterval(interval);
        reject(new Error("UploadCancelled"));
      }
    }, 100);
  });
}

const retry = async <T>(fn: () => Promise<T>): Promise<T> => {
  let attempt = 0;

  while (attempt < BACKOFF_MS.length) {
    if (cancelled) {
      throw new Error("UploadCancelled");
    }

    try {
      return await fn();
    } catch (error) {
      if (cancelled) {
        throw new Error("UploadCancelled");
      }

      if (!isRetryable(error)) {
        throw error;
      }

      const delay = BACKOFF_MS[attempt] + Math.random() * 1000;

      log("Retry", `attempt=${attempt + 1}, delay=${delay}ms`);

      await cancellableSleep(delay);

      attempt++;
    }
  }

  throw new Error("Retry limit exceeded");
};




// ═══════════════════════════════════════════════════════════════════════════════
// CHUNK UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

async function ensureChunkDir(): Promise<void> {
  try {
    await ReactNativeBlobUtil.fs.mkdir(CHUNK_CACHE_DIR);
  } catch (e: any) {
    if (!e.message?.toLowerCase().includes('already exists')) throw e;
  }
}

async function createChunkFile(
  sourceUri: string,
  uploadId: string,
  partNumber: number,
  startByte: number,
  endByte: number
): Promise<string> {
  await ensureChunkDir();
  const cleanSrc = sourceUri.replace(/^file:\/\//, '');
  const tempPath = `${CHUNK_CACHE_DIR}${uploadId}-part-${partNumber}.tmp`;

  log('CreateChunk', `part=${partNumber}, range=[${startByte}-${endByte}]`);
  const t0 = Date.now();
  await ReactNativeBlobUtil.fs.slice(cleanSrc, tempPath, startByte, endByte);
  log('CreateChunk', `part=${partNumber} sliced in ${Date.now() - t0}ms`);
  return `file://${tempPath}`;
}

async function deleteChunkFile(filePath: string): Promise<void> {
  const cleanPath = filePath.replace(/^file:\/\//, '');
  try {
    if (await ReactNativeBlobUtil.fs.exists(cleanPath)) {
      await ReactNativeBlobUtil.fs.unlink(cleanPath);
      log('DeleteChunk', `deleted ${cleanPath.split('/').pop()}`);
    }
  } catch (e) {

    warn('DeleteChunk', `failed: ${(e as Error).message}`);
  }
}

async function cleanupChunks(uploadId: string): Promise<void> {
  try {
    const files = await ReactNativeBlobUtil.fs.ls(CHUNK_CACHE_DIR);
    const pattern = new RegExp(`^${uploadId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-part-\\d+\.tmp$`);
    for (const file of files) {
      if (pattern.test(file)) {
        await ReactNativeBlobUtil.fs.unlink(`${CHUNK_CACHE_DIR}${file}`).catch(() => { });
      }
    }
  } catch { /* ignore */ }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UPLOAD MANAGER
// ═══════════════════════════════════════════════════════════════════════════════
export function createUploadManager(callbacks?: UploadCallbacks) {
  let session: UploadSession | null = null;
  let paused = false;


  const activeWorkers = new Map<number, UploadWorker>();
  const partState = new Map<number,
    | { status: 'PENDING'; size: number }
    | { status: 'UPLOADING'; uploadedBytes: number; size: number }
    | { status: 'COMPLETED'; etag: string; size: number }
  >();

  const chunkCache = new Map<number, Promise<string>>();
  const persistController = new PersistController({ intervalMs: 5000, batchSize: 5, });

  let uploadStarted = false;

  let highestProgress = 0;
  let etagBatch: UploadedPart[] = [];
  let etagTimer: ReturnType<typeof setTimeout> | null = null;
  let completing = false;
  let lastProgressEmit = 0;
  let unsubscribeNetInfo: (() => void) | null = null;

  // ── Helpers ──────────────────────────────────────────────────────────────
  /* const persist = () => {
     if (!session) return;
     session = { ...session, updatedAt: Date.now() };
     uploadStorage.saveSession(session);
     log('Persist', `${session.status} | ${session.uploadedParts.length}/${session.totalParts}`);
   };*/

  const setupNetworkListener = () => {
    unsubscribeNetInfo?.();

    unsubscribeNetInfo = NetInfo.addEventListener(state => {
      if (
        state.isConnected &&
        session?.status === "WAITING_FOR_NETWORK"
      ) {
        log("Network", "Connection restored. Resuming...");
        resume().catch(onFail);
      }
    });
  };

  const updateStatus = (s: UploadStatus) => {
    log('Status', s);
    callbacks?.onStatusChange?.(s);
  };

  const calcProgress = (): ProgressUpdate => {
    if (!session) return { progress: 0, uploadedBytes: 0, totalBytes: 0, activeParts: 0, completedParts: 0, totalParts: 0, completedBytes: 0, inFlightBytes: 0 };
    let completed = 0, inFlight = 0;
    for (const s of partState.values()) {
      if (s.status === 'COMPLETED') completed += s.size;
      else if (s.status === 'UPLOADING') inFlight += s.uploadedBytes;
    }
    const progress = (completed / session.fileSize) * 100;
    return {
      progress: Math.min(progress, 99.99),
      uploadedBytes: Math.min(completed + inFlight, session.fileSize),
      totalBytes: session.fileSize,
      activeParts: activeWorkers.size,
      completedParts: session.uploadedParts.length,
      totalParts: session.totalParts,
      completedBytes: completed,
      inFlightBytes: inFlight,
    };
  };

  const emitProgress = (force = false) => {
    if (!session) return;

    const now = Date.now();

    if (!force && now - lastProgressEmit < PROGRESS_THROTTLE_MS) {
      return;
    }

    lastProgressEmit = now;

    const update = calcProgress();

    highestProgress = Math.max(highestProgress, update.progress);

    callbacks?.onProgress?.({
      ...update,
      progress: highestProgress,
    });
  };

  /**
 * Returns a valid chunk file. Reuses cached chunk if possible and recreates corrupted chunks.
 */
  const resolveChunk = async (partNumber: number, startByte: number, endByte: number): Promise<string> => {
    if (!session) throw new Error("No session");
    const expectedSize = endByte - startByte;

    let pathPromise = chunkCache.get(partNumber);
    if (!pathPromise) {
      pathPromise = createChunkFile(session.fileUri, session.uploadId, partNumber, startByte, endByte);
      chunkCache.set(partNumber, pathPromise);
    }
    let chunkPath = await pathPromise;

    const valid = await ChunkIntegrity.validate(chunkPath, expectedSize);
    if (!valid) {
      log("Integrity", `part=${partNumber} invalid, recreating`);
      await deleteChunkFile(chunkPath);

      chunkPath = await createChunkFile(session.fileUri, session.uploadId, partNumber, startByte, endByte);
      chunkCache.set(partNumber, Promise.resolve(chunkPath));

      // validate recreated chunk
      const recreatedValid = await ChunkIntegrity.validate(chunkPath, expectedSize);
      if (!recreatedValid) throw new Error(`Failed to create valid chunk for part ${partNumber}`);
    }
    return chunkPath;
  };

  /**
   * Refreshes expired presigned URL.
   */
  const refreshChunkUrl = async (partNumber: number): Promise<string> => {
    if (!session) throw new Error("No session");
    if (paused || cancelled) throw new Error("AbortError");

    log("UploadChunk", `part=${partNumber} refreshing URL`);
    const refreshed = await uploadApi.singleChunk({ uploadId: session.uploadId, key: session.key, partNumbers: [partNumber] });
    if (paused || cancelled) throw new Error("AbortError");

    const url = refreshed.parts[0].url;
    session.presignedUrls = session.presignedUrls.map(p => p.partNumber === partNumber ? { ...p, url } : p);
    persistController.persist(session, true);

    return url;
  };

  // <------------------------------------Helper end-------------------------------------------------->

  // ── Part State ───────────────────────────────────────────────────────────
  const initPartState = (totalParts: number, fileSize: number, chunkSize: number) => {
    partState.clear();
    for (let i = 1; i <= totalParts; i++) {
      const size = i === totalParts ? fileSize - chunkSize * (totalParts - 1) : chunkSize;
      partState.set(i, { status: 'PENDING', size });
    }
  };

  const setUploading = (n: number, bytes: number) => {
    const s = partState.get(n);
    if (!s || s.status === 'COMPLETED') return;
    partState.set(n, { status: 'UPLOADING', uploadedBytes: Math.min(bytes, s.size), size: s.size });
  };

  const setCompleted = (n: number, etag: string) => {
    const s = partState.get(n);
    if (!s) return;
    partState.set(n, { status: 'COMPLETED', etag, size: s.size });
  };

  const setPending = (n: number) => {
    const s = partState.get(n);
    if (!s) return;
    partState.set(n, { status: 'PENDING', size: s.size });
  };

  // ── Queue ────────────────────────────────────────────────────────────────
  const buildQueue = (all: PresignedPart[], uploaded: UploadedPart[]) => {
    if (!session) return [];
    const done = new Set(uploaded.map(p => p.partNumber));
    return all
      .filter(p => !done.has(p.partNumber))
      .map(p => ({
        part: p,
        startByte: (p.partNumber - 1) * session!.chunkSize,
        endByte: Math.min(p.partNumber * session!.chunkSize, session!.fileSize),
      }));
  };

  // ── ETag Reporting ───────────────────────────────────────────────────────
  const flushEtags = async () => {
    if (!session || etagBatch.length === 0) return;



    const batch = [...etagBatch];
    etagBatch = [];
    log('FlushEtags', `${batch.length} ETags`);
    try {
      await uploadApi.markMultipleChunksUploaded({ params: { vid: session.videoId }, parts: batch });
      log('FlushEtags', 'batch OK');
    } catch {
      warn('FlushEtags', 'batch failed, fallback');
      for (const p of batch) {
        if (cancelled) {
          warn("FlushEtags", "Upload cancelled. Stopping ETag flush.");
          return;
        }
        try {

          await retry(() => uploadApi.markAsChunkUploaded({ params: { vid: session!.videoId }, etag: p.etag, partNumber: p.partNumber }));
        } catch {
          if (cancelled) {
            return;
          }
          warn('FlushEtags', `part ${p.partNumber} lost`);
        }
      }
    }
  };

  const queueEtag = (n: number, etag: string) => {
    etagBatch.push({ partNumber: n, etag });
    if (etagBatch.length >= ETAG_BATCH_SIZE) {
      if (etagTimer) clearTimeout(etagTimer);
      flushEtags().catch(() => { });
      return;
    }
    if (etagTimer) clearTimeout(etagTimer);
    etagTimer = setTimeout(() => flushEtags().catch(() => { }), ETAG_FLUSH_MS);
  };

  // ── Upload Chunk ─────────────────────────────────────────────────────────
  const uploadChunk = async (task: { part: PresignedPart; startByte: number; endByte: number }): Promise<string> => {
    if (!session) throw new Error("No session");

    const partNumber = task.part.partNumber;
    let currentUrl = task.part.url, chunkPath: string | null = null;

    log("UploadChunk", `part=${partNumber}, range=[${task.startByte}-${task.endByte}]`);

    for (let attempt = 0; attempt < 2; attempt++) {
      let uploadSucceeded = false;
      try {
        chunkPath = await resolveChunk(partNumber, task.startByte, task.endByte);
        let etag: string | null = null;

        const worker = new UploadWorker([{ partNumber, fileUri: chunkPath, url: currentUrl, mimeType: session.mimeType }], {
          onChunkProgress: ({ uploadedBytes }) => { setUploading(partNumber, uploadedBytes); emitProgress(); },
          onChunkComplete: (_, e) => { etag = e; log("UploadChunk", `part=${partNumber} uploaded`); },
          onChunkError: (_, e) => { setPending(partNumber); warn("UploadChunk", `part=${partNumber} failed: ${e.message}`); }
        });

        activeWorkers.set(partNumber, worker);
        await worker.run();

        if (!etag) throw new Error(`Missing ETag for part ${partNumber}`);
        uploadSucceeded = true;
        return etag;

      } catch (error: any) {
        const isExpired = ["HTTP 403", "SignatureDoesNotMatch", "Request has expired", "ExpiredToken"].some(msg => error.message?.includes(msg));
        if (isExpired && attempt === 0) {
          currentUrl = await refreshChunkUrl(partNumber);
          continue;
        }
        throw error;
      } finally {
        activeWorkers.delete(partNumber);
        emitProgress(true);
        if (chunkPath && (uploadSucceeded || attempt === 1)) {
          chunkCache.delete(partNumber);
          await deleteChunkFile(chunkPath);
        }
      }
    }
    throw new Error(`Part ${partNumber} failed`);
  };

  // ── Handlers ───────────────────────────────────────────────────────────
  const onSuccess = (n: number, etag: string) => {
    if (!session || cancelled) return;
    if (session.uploadedParts.some(p => p.partNumber === n)) return;
    setCompleted(n, etag);
    session = { ...session, uploadedParts: [...session.uploadedParts, { partNumber: n, etag }] };
    // no Force -> this is exactly where throttled persistence is useful.
    persistController.persist(session);

    queueEtag(n, etag);
    emitProgress(true);
  };
  // single biggest improvement for resumable uploads.
  const isNetworkFailure = (error: unknown) => {
    const msg =
      error instanceof Error
        ? error.message.toLowerCase()
        : String(error).toLowerCase();

    return [
      "unable to resolve host",
      "failed to connect",
      "network",
      "connection abort",
      "socket",
    ].some(p => msg.includes(p));
  };

  const onFail = (error: unknown) => {
    if (error instanceof Error && error.name === "AbortError"
      || (error as any).message === "UploadCancelled") return;

    err("OnFail", error);

    const e = error instanceof Error ? error : new Error(String(error));
    if (!session) {
      callbacks?.onError?.(e);
      return;
    }

    const isNet = isNetworkFailure(error);
    session = { ...session, status: isNet ? "WAITING_FOR_NETWORK" : "FAILED" };
    persistController.persist(session, true);
    updateStatus(session.status);
    callbacks?.onError?.(e);

    if (!isNet) UploadNotificationService.showFailed();
  };

  // ── Worker Loop ──────────────────────────────────────────────────────────
  const processQueue = async () => {
    if (!session) return;
    const concurrency = await ConcurrencyController.getOptimal();

    // ensures the offline state survives app restarts.
    if (concurrency.workers === 0) {
      session = {
        ...session,
        status: "WAITING_FOR_NETWORK",
      };

      persistController.persist(session);
      updateStatus("WAITING_FOR_NETWORK");
      return;
    }

    if (session.uploadedParts.length >= session.totalParts) { await complete(); return; }

    const queue = buildQueue(session.presignedUrls, session.uploadedParts);
    const sharedQueue = [...queue];
    // prevents the upload from switching back to UPLOADING after the user has already paused or cancelled
    if (paused || cancelled) {
      return;
    }
    session = {
      ...session,
      status: "PREPARING_UPLOAD",
    };

    persistController.persist(session);
    updateStatus("PREPARING_UPLOAD");
    UploadNotificationService.showProgress(0);

    // const concurrency = getConcurrency();
    log('ProcessQueue', `${concurrency.workers} workers, ${sharedQueue.length} tasks reason ${concurrency.reason}`);


    const workerLoop = async () => {
      while (!paused && !cancelled) {
        const task = sharedQueue.shift();
        if (!task) break;

        log(
          "WorkerLoop",
          `dequeued part=${task.part.partNumber}, ${sharedQueue.length} remaining`
        );

        try {
          const etag = await retry(async () => {
            // First task about to begin processing
            if (!uploadStarted && session) {
              uploadStarted = true;

              session = {
                ...session,
                status: "UPLOADING",
              };

              persistController.persist(session);
              updateStatus("UPLOADING");
              UploadNotificationService.showProgress(0);
            }

            return uploadChunk(task);
          });

          onSuccess(task.part.partNumber, etag);
        } catch (e) {
          onFail(e);
          return;
        }
      }
    };

    await Promise.all(Array.from({ length: concurrency.workers }, () => workerLoop()));

    // Guard against session becoming null
    if (!session) return;
    if (etagTimer) clearTimeout(etagTimer);
    await flushEtags();
    // ensures state survives app restarts.
    if (cancelled) {
      session = { ...session, status: 'CANCELLED' };
      persistController.persist(session);
      updateStatus('CANCELLED');
    } else if (paused) {
      session = { ...session, status: 'PAUSED' };
      persistController.persist(session);
      updateStatus('PAUSED');
    } else if (session.uploadedParts.length >= session.totalParts) {
      await complete();
    }
  };

  // ── Complete ───────────────────────────────────────────────────────────
  const complete = async () => {
    if (!session || completing) return;
    completing = true;
    if (etagTimer) clearTimeout(etagTimer);
    await flushEtags();
    await cleanupChunks(session.uploadId);

    session = { ...session, status: 'COMPLETING' };
    // force -> because a brand new session must always be saved immediately.
    persistController.persist(session, true);

    updateStatus('COMPLETING');
    log('Complete', 'finalizing...');

    try {
      const parts = [...session.uploadedParts].sort((a, b) => a.partNumber - b.partNumber);
      await uploadApi.complete({ videoId: session.videoId, uploadId: session.uploadId, parts });

      if (session.thumbnailPresignedUrl && session.thumbnailLocalUri) {
        try {
          await uploadThumbnail(session.thumbnailLocalUri, session.thumbnailPresignedUrl, session.thumbnailType ?? 'image/jpeg');
        } catch (e) { warn('Complete', 'thumbnail failed:', e); }
      }

      session = { ...session, status: 'COMPLETED' };
      // force -> because a brand new session must always be saved immediately.
      persistController.persist(session, true);
      uploadStorage.removeSession();
      updateStatus('COMPLETED');
      highestProgress = 100;
      callbacks?.onProgress?.({
        progress: 100, uploadedBytes: session.fileSize, totalBytes: session.fileSize,
        activeParts: 0, completedParts: session.totalParts, totalParts: session.totalParts,
      });
      UploadNotificationService.showCompleted();
      log('Complete', 'SUCCESS');
    } catch (e) {
      err('Complete', 'failed:', e);
      session = { ...session, status: 'FAILED' };
      persistController.persist(session);
      ;
      callbacks?.onError?.(e instanceof Error ? e : new Error(String(e)));
      UploadNotificationService.showFailed();
    } finally {
      completing = false;
    }
  };

  // ── Public API ─────────────────────────────────────────────────────────
  const start = async (params: StartUploadParams) => {
    const stored = uploadStorage.getSession();

    if (stored) {
      // If manager already exists, resume should be used instead
      // Since we are starting a fresh upload, wipe stale session.
      console.warn(
        "[UploadManager] Removing stale upload session:",
        stored.status
      );

      uploadStorage.removeSession();
    }


    paused = false; cancelled = false; highestProgress = 0;
    etagBatch = []; etagTimer = null; lastProgressEmit = 0;
    persistController.reset();
    partState.clear(); activeWorkers.clear(); chunkCache.clear();

    updateStatus('INITIALIZING');
    log('Start', `${params.fileName} (${params.fileSize} bytes)`);

    const { allowRating, ...metadata } = params.metadata;
    const res = await uploadApi.initialize({
      title: metadata.title, description: metadata.description,
      fileName: params.fileName, mimeType: params.mimeType, fileSize: params.fileSize,
      madeForKids: metadata.madeForKids, allowRatings: allowRating,
      allowComments: metadata.allowComments, chapters: metadata.chapters,
      thumbnailType: params.thumbnailType ?? 'image/jpeg',
    });

    session = {
      videoId: res.videoId, uploadId: res.uploadId, key: res.objectKey,
      fileUri: params.fileUri, fileName: params.fileName, mimeType: params.mimeType,
      fileSize: params.fileSize, chunkSize: res.chunkSize, totalParts: res.totalChunks,
      presignedUrls: res.urls, uploadedParts: [], status: 'INITIATED',
      createdAt: Date.now(), updatedAt: Date.now(),
      thumbnailLocalUri: params.thumbnailLocalUri, thumbnailType: params.thumbnailType,
      thumbnailPresignedUrl: res.thumbnailPresignedUrl?.url,
      thumbnailKey: res.thumbnailKey, previewKey: res.previewKey,
      metadata: { title: metadata.title, description: metadata.description },
    };

    initPartState(res.totalChunks, params.fileSize, res.chunkSize);
    // force -> because a brand new session must always be saved immediately.
    persistController.persist(session, true);

    setupNetworkListener();
    updateStatus('INITIATED');
    await processQueue();
  };

  const resume = async () => {
    const stored = uploadStorage.getSession();
    if (!stored) throw new Error('No session');


    session = stored; paused = false; cancelled = false;

    // check mark
    if (session.status === "WAITING_FOR_NETWORK") {
      log("Resume", "Resuming after network recovery");
    }

    setupNetworkListener();
    highestProgress = 0; etagBatch = []; etagTimer = null; lastProgressEmit = 0;
    partState.clear(); activeWorkers.clear(); chunkCache.clear();
    persistController.reset();

    updateStatus('INITIALIZING');
    log('Resume', `videoId=${stored.videoId}`);

    const server = await uploadApi.getStatus(session.videoId);
    if (server.status === 'COMPLETED') {
      uploadStorage.removeSession();
      updateStatus('COMPLETED');
      return;
    }

    session = { ...session, uploadedParts: mergeParts(session.uploadedParts, server.uploadedParts ?? []) };
    initPartState(session.totalParts, session.fileSize, session.chunkSize);
    for (const p of session.uploadedParts) setCompleted(p.partNumber, p.etag);
    emitProgress(true);

    const remaining = session.presignedUrls
      .map(p => p.partNumber)
      .filter(n => !session!.uploadedParts.some(u => u.partNumber === n));

    if (remaining.length > 0) {
      try {
        const fresh = await uploadApi.singleChunk({ uploadId: session.uploadId, key: session.key, partNumbers: remaining });
        const byNum = new Map(fresh.parts.map(p => [p.partNumber, p]));
        session = { ...session, presignedUrls: session.presignedUrls.map(p => byNum.get(p.partNumber) ?? p) };
      } catch { /* use existing */ }
    }

    // force -> because a brand new session must always be saved immediately.
    persistController.persist(session, true);
    await processQueue();
  };

  const pause = () => {
    if (!session || session.status !== 'UPLOADING') return;
    paused = true;
    activeWorkers.forEach(w => w.cancel());
    activeWorkers.clear();
    for (const [n, s] of partState.entries()) if (s.status === 'UPLOADING') setPending(n);
    session = { ...session, status: 'PAUSED' };

    // force -> because a brand new session must always be saved immediately.
    persistController.persist(session, true);
    updateStatus('PAUSED');
    log('Pause', `${session.uploadedParts.length}/${session.totalParts} done`);
  };





  const cancel = async () => {
    cancelled = true; paused = false;
    unsubscribeNetInfo?.();
    unsubscribeNetInfo = null;
    activeWorkers.forEach(w => w.cancel());
    activeWorkers.clear();
    partState.clear();


    for (const promise of chunkCache.values()) {
      try {
        const path = await promise;
        if (typeof path === 'string') {
          await deleteChunkFile(path);
        }
      } catch {
        // ignore
      }
    }
    chunkCache.clear();

    if (etagTimer) clearTimeout(etagTimer);
    await flushEtags();

    try {
      if (session?.videoId && session?.key && session?.uploadId) {
        await uploadApi.cancelUpload({ videoId: session.videoId, objectKey: session.key, uploadId: session.uploadId });
      }
    } catch { /* S3 lifecycle */ }

    if (session) { uploadStorage.removeSession(); session = null; }
    updateStatus('CANCELLED');
    log('Cancel', 'done');
  };

  const mergeParts = (local: UploadedPart[], server: UploadedPart[]): UploadedPart[] => {
    const merged = new Map<number, UploadedPart>();
    for (const p of local) merged.set(p.partNumber, p);
    for (const p of server) merged.set(p.partNumber, p);
    return Array.from(merged.values());
  };

  return { start, resume, pause, cancel };
}

/*
Chunk uploaded successfully
    ↓
persist(session)         // throttled

Upload started
Upload resumed
Upload paused
Upload failed
Upload completed
Upload entering COMPLETING state
    ↓
persist(session, true)   // immediate save

New upload starts/resumes
    ↓
reset()
*/ 