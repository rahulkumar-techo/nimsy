import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setProgress, setProgressDetail, setStatus, setError, setVideoId, resetUploadProgress } from "../store/upload.slice";
import { createUploadManager } from "../core/createUploadManager";
import { StartUploadParams, UploadStatus, ProgressUpdate } from "../types/upload.types";
import { UploadNotificationService } from "../service/notification.service";

let globalManager: ReturnType<typeof createUploadManager> | null = null;
let isStarting = false;

const clearManager = () => { globalManager = null; isStarting = false; };

export function useUpload() {
  const dispatch = useDispatch();
  const uploadState = useSelector((state: RootState) => state.uploadUI);

  const resetUI = useCallback(() => {
    dispatch(resetUploadProgress());
    dispatch(setVideoId(null));
    dispatch(setError(null));
  }, [dispatch]);

  const handleProgress = useCallback((update: ProgressUpdate) => {
    dispatch(setProgress(update.progress));
    dispatch(setProgressDetail({
      uploadedBytes: update.uploadedBytes, totalBytes: update.totalBytes,
      activeParts: update.activeParts, completedParts: update.completedParts,
      totalParts: update.totalParts, completedBytes: update.completedBytes ?? 0,
      inFlightBytes: update.inFlightBytes ?? 0,
    }));
  }, [dispatch]);

  const createManager = useCallback(() => createUploadManager({
    onProgress: handleProgress,
    onStatusChange: (status: UploadStatus) => {
      dispatch(setStatus(status));
      if (status === "COMPLETED" || status === "CANCELLED") resetUI();
      if (status === "COMPLETED") UploadNotificationService.showCompleted();
      if (status === "FAILED") UploadNotificationService.showFailed();
      if (["COMPLETED", "FAILED", "CANCELLED"].includes(status)) clearManager();
    },
    onError: (err: Error) => {
      dispatch(setError(err.message));
      dispatch(setStatus("FAILED"));
      UploadNotificationService.showFailed();
      clearManager();
    },
  }), [dispatch, handleProgress, resetUI]);

  const runInit = useCallback(async (action: (mgr: NonNullable<typeof globalManager>) => Promise<void>, shouldReset = false) => {
    if (isStarting || globalManager) return console.warn(`[useUpload] Action blocked. Starting: ${isStarting}, Running: ${!!globalManager}`);
    isStarting = true;
    shouldReset ? resetUI() : dispatch(setError(null));
    dispatch(setStatus("INITIALIZING"));
    try {
      globalManager = createManager();
      await action(globalManager);
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : "Action failed"));
      dispatch(setStatus("FAILED"));
      clearManager();
      throw err;
    } finally {
      isStarting = false;
    }
  }, [dispatch, createManager, resetUI]);

  const startUpload = useCallback((params: StartUploadParams) => runInit((mgr) => mgr.start(params), true), [runInit]);
  const resumeUpload = useCallback(() => runInit((mgr) => mgr.resume(), false), [runInit]);
  const pauseUpload = useCallback(() => globalManager ? globalManager.pause() : console.warn("[useUpload] No upload to pause"), []);

  const cancelUpload = useCallback(async () => {
    try { globalManager && await globalManager.cancel(); } 
    catch (err) { console.warn("[useUpload] Failed to cancel", err); } 
    finally {
      clearManager();
      resetUI();
      dispatch(setStatus("IDLE"));
    }
  }, [dispatch, resetUI]);

  useEffect(() => {}, []); // Allows background execution on unmount

  return {
    startUpload, resumeUpload, pauseUpload, cancelUpload,
    hasActiveUpload: !!globalManager,
    ...uploadState // Spreads progress, status, error, and associated metadata cleanly
  };
}