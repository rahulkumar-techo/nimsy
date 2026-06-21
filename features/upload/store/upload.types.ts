/**
 * Upload redux types.
 */

export type UploadStatus =
  | "IDLE"
  | "INITIALIZING"
  | "UPLOADING"
  | "COMPLETING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export interface UploadState {
  loading: boolean;
  progress: number;

  status: UploadStatus;
  message: string;

  currentVideoId: string | null;
  uploadId: string | null;

  error: string | null;
}