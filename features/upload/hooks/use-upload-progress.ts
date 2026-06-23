// Subscribes to progress for a specific in-flight videoId, independent of
// whoever called startUpload — useful for a persistent "uploads" tray/badge
// that should reflect uploads kicked off from a different screen, or from
// the resume flow after an app restart.

import { useEffect, useState } from "react";
import { uploadSessionStore } from "../storage/upload-session.store";

export function useUploadProgress(videoId: string | null, pollMs = 1000) {
  const [percent, setPercent] = useState(0);
  const [partsUploaded, setPartsUploaded] = useState(0);
  const [totalParts, setTotalParts] = useState(0);

  useEffect(() => {
    if (!videoId) return;

    const tick = () => {
      const session = uploadSessionStore.get(videoId);
      if (!session) return;
      const uploaded = session.parts.filter((p) => p.status === "UPLOADED").length;
      setPartsUploaded(uploaded);
      setTotalParts(session.parts.length);
      setPercent(session.parts.length ? Math.round((uploaded / session.parts.length) * 100) : 0);
    };

    tick();
    const interval = setInterval(tick, pollMs);
    return () => clearInterval(interval);
  }, [videoId, pollMs]);

  return { percent, partsUploaded, totalParts };
}
