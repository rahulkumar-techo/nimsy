/**
 * useUpload Hook
 * Exposes upload controls and Redux state for the upload feature.
 */

import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  setProgress,
  setStatus,
  setError,
  setVideoId,
  resetUploadProgress,
} from "../store/upload.slice";
import { createUploadManager } from "../core/createUploadManager";
import { StartUploadParams, UploadStatus } from "../types/upload.types";

export function useUpload() {
  const dispatch = useDispatch();
  const uploadState = useSelector((state: RootState) => state.uploadUI);

  const managerRef = useRef<ReturnType<typeof createUploadManager> | null>(null);

  const startUpload = useCallback(async (params: StartUploadParams) => {
    if (managerRef.current) {
      throw new Error("Upload already in progress");
    }

    managerRef.current = createUploadManager({
      onProgress: (progress) => dispatch(setProgress(progress)),
      onStatusChange: (status: UploadStatus) => {
        dispatch(setStatus(status));
        if (status === "COMPLETED") {
          dispatch(setVideoId(null));
          dispatch(resetUploadProgress());
          managerRef.current = null;
        }
      },
      onError: (error: Error) => {
        dispatch(setError(error.message));
        dispatch(setStatus("FAILED"));
      },
      onChunkProgress: () => {},
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
  }, [dispatch]);

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
      onProgress: (progress) => dispatch(setProgress(progress)),
      onStatusChange: (status) => {
        dispatch(setStatus(status));
        if (status === "COMPLETED") {
          dispatch(setVideoId(null));
          dispatch(resetUploadProgress());
          managerRef.current = null;
        }
      },
      onError: (error) => {
        dispatch(setError(error.message));
        dispatch(setStatus("FAILED"));
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
  }, [dispatch]);

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
    status: uploadState.status,
    error: uploadState.error,
    isUploading: uploadState.isUploading,
    currentVideoId: uploadState.currentVideoId,
    uploadedParts: uploadState.uploadedParts,
  };
}