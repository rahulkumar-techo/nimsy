// Call once near app startup (e.g. in a root layout/provider) to resume any
// uploads that were interrupted by an app restart or process death.

import { useCallback, useEffect, useState } from "react";
import { resumeUpload } from "../services/resume-upload";
import { uploadSessionStore } from "../storage/upload-session.store";

export function useUploadStatus() {
  const [checking, setChecking] = useState(true);
  const [hasIncomplete, setHasIncomplete] = useState(false);

  const resume = useCallback(async () => {
    setChecking(true);
    await resumeUpload.resumeAll();
    setHasIncomplete(uploadSessionStore.getIncomplete().length > 0);
    setChecking(false);
  }, []);

  useEffect(() => {
    setHasIncomplete(uploadSessionStore.getIncomplete().length > 0);
    resume();
  }, [resume]);

  return { checking, hasIncomplete, resume };
}
