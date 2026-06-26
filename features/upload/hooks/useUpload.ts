/**
 * useUpload Hook
 * Exposes upload controls and Redux state for the upload feature.
 */

import { useCallback, useEffect, useRef } from "react";
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

export function useUpload() {
  const dispatch = useDispatch();
  const uploadState = useSelector((state: RootState) => state.uploadUI);

  const managerRef = useRef<ReturnType<typeof createUploadManager> | null>(null);

  const handleProgress = useCallback((update: ProgressUpdate) => {
    dispatch(setProgress(update.progress));
    dispatch(setProgressDetail({
      uploadedBytes: update.uploadedBytes,
      totalBytes: update.totalBytes,
      activeParts: update.activeParts,
      completedParts: update.completedParts,
      totalParts: update.totalParts,
       completedBytes:update.completedBytes,
      inFlightBytes:update.inFlightBytes,
    }));
  }, [dispatch]);

  const startUpload = useCallback(async (params: StartUploadParams) => {
    if (managerRef.current) {
      throw new Error("Upload already in progress");
    }

    managerRef.current = createUploadManager({
      onProgress: handleProgress,
      onStatusChange: (status: UploadStatus) => {
        dispatch(setStatus(status));
        if (status === "COMPLETED") {
          dispatch(setVideoId(null));
          dispatch(resetUploadProgress());
          managerRef.current = null;
          UploadNotificationService.showCompleted();
        } else if (status === "FAILED") {
          UploadNotificationService.showFailed();
        }
      },
      onError: (error: Error) => {
        dispatch(setError(error.message));
        dispatch(setStatus("FAILED"));
        UploadNotificationService.showFailed();
      },
    });

    dispatch(setVideoId(null));
    dispatch(setError(null));

    try {
      await managerRef.current.start(params);
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : String(error)));
      dispatch(setStatus("FAILED"));
      managerRef.current = null;
      throw error;
    }
  }, [dispatch, handleProgress]);

  const pauseUpload = useCallback(() => {
    if (managerRef.current) {
      managerRef.current.pause();
    }
  }, []);

  const resumeUpload = useCallback(async () => {
    if (managerRef.current) {
      throw new Error("Upload already in progress");
    }

    managerRef.current = createUploadManager({
      onProgress: handleProgress,
      onStatusChange: (status: UploadStatus) => {
        dispatch(setStatus(status));
        if (status === "COMPLETED") {
          dispatch(setVideoId(null));
          dispatch(resetUploadProgress());
          managerRef.current = null;
          UploadNotificationService.showCompleted();
        } else if (status === "FAILED") {
          UploadNotificationService.showFailed();
        }
      },
      onError: (error: Error) => {
        dispatch(setError(error.message));
        dispatch(setStatus("FAILED"));
        UploadNotificationService.showFailed();
      },
    });

    try {
      await managerRef.current.resume();
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : String(error)));
      dispatch(setStatus("FAILED"));
      managerRef.current = null;
      throw error;
    }
  }, [dispatch, handleProgress]);

  const cancelUpload = useCallback(() => {
    if (managerRef.current) {
      managerRef.current.cancel();
      managerRef.current = null;
    }
    dispatch(resetUploadProgress());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (managerRef.current) {
        managerRef.current.cancel();
      }
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