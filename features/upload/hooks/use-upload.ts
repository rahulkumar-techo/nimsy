// Orchestration hook: kicks off / cancels an upload via uploadManager and
// exposes its phase/progress as local state. Swap the useState calls for a
// redux/zustand slice if the app needs upload state outside this tree.

import { useCallback, useRef, useState } from "react";
import { uploadManager } from "../services/upload-manager";
import { UploadMetadata, UploadPhase } from "../types/upload.types";

export function useUpload() {
  const [phase, setPhase] = useState<UploadPhase>("IDLE");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const videoIdRef = useRef<string | null>(null);

  const startUpload = useCallback(async (sourceFilePath: string, metadata: UploadMetadata) => {
    setError(null);
    try {
      const result = await uploadManager.startUpload(sourceFilePath, metadata, (pct, ph, msg) => {
        setProgress(pct);
        setPhase(ph);
        setMessage(msg);
      });
      videoIdRef.current = result.videoId;
      return result;
    } catch (err) {
      setPhase("FAILED");
      setError(err instanceof Error ? err.message : "Upload failed.");
      throw err;
    }
  }, []);

  const cancelUpload = useCallback(async () => {
    if (!videoIdRef.current) return;
    await uploadManager.cancelUpload(videoIdRef.current);
    setPhase("CANCELLED");
  }, []);

  return { startUpload, cancelUpload, phase, progress, message, error };
}
