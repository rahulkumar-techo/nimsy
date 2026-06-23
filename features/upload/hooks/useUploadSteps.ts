import { useCallback, useState } from "react";

export type UploadStep = "video" | "details" | "thumbnail";

const STEP_ORDER: UploadStep[] = ["video", "details", "thumbnail"];

export function useUploadSteps() {
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEP_ORDER[stepIndex];

  const goNext = useCallback(() => {
    setStepIndex((i) => Math.min(i + 1, STEP_ORDER.length - 1));
  }, []);

  const goBack = useCallback(() => {
    setStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const goTo = useCallback((target: UploadStep) => {
    setStepIndex(STEP_ORDER.indexOf(target));
  }, []);

  return {
    step,
    stepIndex,
    totalSteps: STEP_ORDER.length,
    isFirst: stepIndex === 0,
    isLast: stepIndex === STEP_ORDER.length - 1,
    goNext,
    goBack,
    goTo,
  };
}
