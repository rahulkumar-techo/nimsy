/**
 * useUpload Hook — Fixed Version
 * 
 * BUG FIXES:
 * 1. Manager reference is now a module-level singleton, not a hook-level ref.
 *    This means cancel/pause/resume work from ANY component that calls useUpload().
 * 2. resetUploadProgress now fully clears progress to prevent stale 100% on restart.
 * 3. Added defensive checks to prevent double-start and stale state.
 */

import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  setProgress,
  setProgressDetail,
  setStatus,
  setError,
  setVideoId,
  resetUploadProgress,
} from "../store/upload.slice";
import { createUploadManager } from "../core/createUploadManager";
import { StartUploadParams, UploadStatus, ProgressUpdate } from "../types/upload.types";
import { UploadNotificationService } from "../service/notification.service";

// ─── MODULE-LEVEL SINGLETON ──────────────────────────────────────────
// This is shared across ALL useUpload() hook instances.
// Any component can cancel/pause the active upload.
let globalManager: ReturnType<typeof createUploadManager> | null = null;
let isStarting = false; // Prevent race conditions on rapid start clicks

export function useUpload() {
  const dispatch = useDispatch();
  const uploadState = useSelector((state: RootState) => state.uploadUI);

  const handleProgress = useCallback((update: ProgressUpdate) => {
    dispatch(setProgress(update.progress));
    dispatch(setProgressDetail({
      uploadedBytes: update.uploadedBytes,
      totalBytes: update.totalBytes,
      activeParts: update.activeParts,
      completedParts: update.completedParts,
      totalParts: update.totalParts,
      completedBytes: update.completedBytes ?? 0,
      inFlightBytes: update.inFlightBytes ?? 0,
    }));
  }, [dispatch]);

  const startUpload = useCallback(async (params: StartUploadParams) => {
    if (globalManager) {
      console.warn("[useUpload] Upload already in progress");
      throw new Error("Upload already in progress");
    }
    if (isStarting) {
      console.warn("[useUpload] Upload start already in progress");
      throw new Error("Upload start already in progress");
    }

    isStarting = true;

    // CRITICAL: Reset Redux state BEFORE creating manager to prevent stale progress
    dispatch(resetUploadProgress());
    dispatch(setVideoId(null));
    dispatch(setError(null));

    try {
      globalManager = createUploadManager({
        onProgress: handleProgress,
        onStatusChange: (status: UploadStatus) => {
          dispatch(setStatus(status));
          if (status === "COMPLETED") {
            dispatch(setVideoId(null));
            dispatch(resetUploadProgress());
            globalManager = null;
            UploadNotificationService.showCompleted();
          } else if (status === "FAILED" || status === "CANCELLED") {
            globalManager = null;
            if (status === "FAILED") {
              UploadNotificationService.showFailed();
            }
          }
        },
        onError: (error: Error) => {
          dispatch(setError(error.message));
          dispatch(setStatus("FAILED"));
          globalManager = null;
          UploadNotificationService.showFailed();
        },
      });

      await globalManager.start(params);
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : String(error)));
      dispatch(setStatus("FAILED"));
      globalManager = null;
      throw error;
    } finally {
      isStarting = false;
    }
  }, [dispatch, handleProgress]);

  const pauseUpload = useCallback(() => {
    if (globalManager) {
      globalManager.pause();
    } else {
      console.warn("[useUpload] No active upload to pause");
    }
  }, []);

  const resumeUpload = useCallback(async () => {
    if (globalManager) {
      console.warn("[useUpload] Upload already in progress");
      throw new Error("Upload already in progress");
    }
    if (isStarting) {
      console.warn("[useUpload] Upload resume already in progress");
      throw new Error("Upload resume already in progress");
    }

    isStarting = true;
    dispatch(setError(null));

    try {
      globalManager = createUploadManager({
        onProgress: handleProgress,
        onStatusChange: (status: UploadStatus) => {
          dispatch(setStatus(status));
          if (status === "COMPLETED") {
            dispatch(setVideoId(null));
            dispatch(resetUploadProgress());
            globalManager = null;
            UploadNotificationService.showCompleted();
          } else if (status === "FAILED" || status === "CANCELLED") {
            globalManager = null;
            if (status === "FAILED") {
              UploadNotificationService.showFailed();
            }
          }
        },
        onError: (error: Error) => {
          dispatch(setError(error.message));
          dispatch(setStatus("FAILED"));
          globalManager = null;
          UploadNotificationService.showFailed();
        },
      });

      await globalManager.resume();
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : String(error)));
      dispatch(setStatus("FAILED"));
      globalManager = null;
      throw error;
    } finally {
      isStarting = false;
    }
  }, [dispatch, handleProgress]);

  const cancelUpload = useCallback(() => {
    if (globalManager) {
      globalManager.cancel();
      globalManager = null;
    }
    dispatch(resetUploadProgress());
  }, [dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // NOTE: We do NOT cancel on unmount here because the user might navigate
      // away from the progress screen but want the upload to continue in background.
      // If you want background uploads, keep this empty.
      // If you want upload to stop when screen unmounts, uncomment below:
      // if (globalManager) {
      //   globalManager.cancel();
      //   globalManager = null;
      // }
    };
  }, []);

  return {
    startUpload,
    pauseUpload,
    resumeUpload,
    cancelUpload,
    progress: uploadState.progress,
    uploadedBytes: uploadState.uploadedBytes,
    totalBytes: uploadState.totalBytes,
    activeParts: uploadState.activeParts,
    completedParts: uploadState.completedParts,
    totalParts: uploadState.totalParts,
    status: uploadState.status,
    error: uploadState.error,
    isUploading: uploadState.isUploading,
    currentVideoId: uploadState.currentVideoId,
    uploadedParts: uploadState.uploadedParts,
  };
}