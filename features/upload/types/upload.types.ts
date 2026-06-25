/**
 * Upload Types
 * Strict TypeScript interfaces for the upload system.
 */

// Upload lifecycle statuses
export type UploadStatus =
  | "IDLE"
  | "INITIATED"
  | "UPLOADING"
  | "PAUSED"
  | "COMPLETING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

// Visibility options matching backend
export type Visibility = "PUBLIC" | "PRIVATE" | "UNLISTED";

// Chapter metadata for video
export interface Chapter {
  id: string;
  title: string;
  startTime: number;
}

// Metadata sent to backend during initialization
export interface UploadMetadata {
  title: string;
  description?: string;
  visibility: Visibility;
  madeForKids: boolean;
  chapters: Chapter[];
  allowComments:boolean;
  allowRating:boolean;
}

// Request payload for POST /upload/init
export interface UploadInitRequest {
  title: string;
  description?: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  visibility: Visibility;
  madeForKids: boolean;
  allowRatings:boolean;
  allowComments:boolean;
  chapters: Chapter[];
}

// Part of a presigned URL from backend
export interface PresignedPart {
  partNumber: number;
  url: string;
}

// Response from POST /upload/init
export interface UploadInitResponse {
  videoId: string;
  uploadId: string;
  chunkSize: number;
  totalParts: number;
  urls: PresignedPart[];
}

// Uploaded part tracking ETag
export interface UploadedPart {
  partNumber: number;
  etag: string;
}

// Response from GET /videos/:videoId/upload/status
export interface UploadStatusResponse {
  uploadedParts: UploadedPart[];
  status: "INITIATED" | "UPLOADING" | "COMPLETED" | "FAILED";
}

// Complete upload request body
export interface CompleteUploadRequest {
  videoId: string;
  uploadedParts: UploadedPart[];
}

// Per-chunk status for granular tracking
export type ChunkStatus = "PENDING" | "UPLOADING" | "DONE" | "FAILED" | "RETRYING";

// Chunk metadata with retry tracking
export interface ChunkMeta {
  partNumber: number;
  status: ChunkStatus;
  etag?: string;
  retryCount: number;
  lastError?: string;
}

// Persisted upload session stored in MMKV
export interface UploadSession {
  videoId: string;
  uploadId: string;
  fileUri: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  chunkSize: number;
  totalParts: number;
  uploadedParts: UploadedPart[];
  presignedUrls: PresignedPart[];
  metadata: UploadMetadata;
  status: UploadStatus;
  createdAt: number;
  updatedAt: number;
}

// Parameters to start a new upload
export interface StartUploadParams {
  fileUri: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  metadata: UploadMetadata;
}

// Callbacks for upload events
export interface UploadCallbacks {
  onProgress?: (progress: number) => void;
  onStatusChange?: (status: UploadStatus) => void;
  onError?: (error: Error) => void;
  onChunkProgress?: (partNumber: number, progress: number) => void;
}

// Progress state for UI
export interface UploadProgressState {
  uploadedBytes: number;
  totalBytes: number;
  uploadedParts: number;
  totalParts: number;
}