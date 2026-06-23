import { getUploadStatus } from "../api/status";
import type { VisibilityOption } from "../types/upload.types";

export interface UploadStatusResponse {
  status: string;
  progress: number;
  isCompleted: boolean;
}

export type StatusCallback = (status: UploadStatusResponse) => void;

const POLL_INTERVAL_MS = 2000;
const MAX_POLLS = 60;

export async function startUploadPolling(videoId: string, onStatus: StatusCallback): Promise<void> {
  let attempts = 0;

  while (attempts < MAX_POLLS) {
    try {
      const data = await getUploadStatus(videoId);
      onStatus({
        status: data.status,
        progress: data.progress,
        isCompleted: data.isCompleted,
      });

      if (data.isCompleted) {
        return;
      }
    } catch {
      onStatus({ status: "polling", progress: 0, isCompleted: false });
    }

    attempts++;
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  onStatus({ status: "timeout", progress: 0, isCompleted: false });
}
