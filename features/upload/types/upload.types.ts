/**
 * Upload Types
 * Strict TypeScript interfaces for the upload system.
 */

// Upload lifecycle statuses
export type UploadStatus =
  | "IDLE"
  | "INITIALIZING"
  | "INITIATED"
  | "UPLOADING"
  | "PAUSED"
  | "COMPLETING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

// Visibility options matching backend
export type Visibility = "PUBLIC" | "PRIVATE" | "UNLISTED";
export type thumbnailType = "image/png" | "image/jpeg" | string;

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
  allowComments: boolean;
  allowRating: boolean;
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
  allowRatings: boolean;
  allowComments: boolean;
  chapters: Chapter[];
  thumbnailType: thumbnailType;
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
  objectKey: string;
  chunkSize: number;
  totalChunks: number;
  urls: PresignedPart[];
  thumbnailKey?: string,
  thumbnailPresignedUrl?: ThumbnailPresignedResponse,
  previewKey?: string,
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
  uploadId: string;
  parts: UploadedPart[];
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
  key: string;
  fileSize: number;
  chunkSize: number;
  totalParts: number;
  uploadedParts: UploadedPart[];
  presignedUrls: PresignedPart[];
  metadata: UploadMetadata;
  status: UploadStatus;
  createdAt: number;
  updatedAt: number;
  thumbnailKey?: string;
  thumbnailPresignedUrl?: string;
  thumbnailLocalUri: string | undefined;
  thumbnailType?: thumbnailType;
}


// 
export type ThumbnailPresignedResponse = {
  url: string;
  key: string;
}

// Parameters to start a new upload
export interface StartUploadParams {
  fileUri: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  thumbnailLocalUri: string | undefined;
  thumbnailType?: thumbnailType;
  metadata: UploadMetadata;

}
// thumbnailType: isPng ? "image/jpeg" : "image/jpeg",
// 
// Callbacks for upload events
export interface UploadCallbacks {
  /**
   * Global upload progress with byte precision.
   * Called frequently for smooth progress animation.
   */
  onProgress?: (progress: ProgressUpdate) => void;

  /**
   * Upload status changes.
   */
  onStatusChange?: (status: UploadStatus) => void;

  /**
   * Fatal upload error.
   */
  onError?: (error: Error) => void;
}

// Progress update with byte precision for smooth UI animation
export interface ProgressUpdate {
  progress: number; // 0-100 percentage
  uploadedBytes: number; // cumulative uploaded bytes for this session
  totalBytes: number; // total file size
  activeParts: number; // number of parts currently uploading
  completedParts: number; // number of parts fully uploaded
  totalParts: number; // total parts for this upload
  completedBytes?: number;
  inFlightBytes?: number;
}

// Progress state for UI
export interface UploadProgressState {
  uploadedBytes: number;
  totalBytes: number;
  uploadedParts: number;
  totalParts: number;
}


// -------------------------------


export interface SingleChunkUploadBody {
  uploadId: string;
  key: string;
  partNumbers: number[]
}

export interface SignPartsResponse {
  uploadId: string;
  parts: {
    partNumber: number;
    presignedUrl: string;
  }[];
}

