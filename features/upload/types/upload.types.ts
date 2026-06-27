/**
 * Upload Types
 * Aligned with backend API contract.
 */

export type UploadStatus =
  | "IDLE"
  | "INITIALIZING"
  | "INITIATED"
  | "UPLOADING"
  | "PAUSED"
  | "COMPLETING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED"

export type Visibility = "PUBLIC" | "PRIVATE" | "UNLISTED";
export type ThumbnailType = "image/png" | "image/jpeg";

export interface Chapter {
  title: string;
  time: number;
}

// ─── Backend API Types ────────────────────────────────────────────────────

export interface UploadInitRequest {
  title: string;
  description?: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  madeForKids: boolean;
  allowRatings: boolean;
  allowComments: boolean;
  chapters: Chapter[];
  thumbnailType: ThumbnailType;
}

// Backend sends 'url', not 'presignedUrl'
export interface PresignedPart {
  partNumber: number;
  url: string;
}

export interface ThumbnailPresignedResponse {
  url: string;
  key: string;
}

export interface UploadInitResponse {
  success: boolean;
  videoId: string;
  uploadSessionId: string;
  uploadId: string;
  objectKey: string;
  chunkSize: number;
  totalChunks: number;
  urls: PresignedPart[];
  thumbnailKey?: string;
  thumbnailPresignedUrl?: ThumbnailPresignedResponse;
  previewKey?: string;
}

export interface UploadedPart {
  partNumber: number;
  etag: string;
}

export interface UploadStatusResponse {
  videoId: string;
  status: "INITIATED" | "UPLOADING" | "COMPLETED" | "FAILED";
  progress: number;
  uploadedChunks: number;
  totalChunks: number;
  remainingChunks: number;
  isCompleted: boolean;
  createdAt?: string;
  updatedAt?: string;
  uploadedParts?: UploadedPart[];
}

export interface CompleteUploadRequest {
  videoId: string;
  uploadId: string;
  parts: UploadedPart[];
}

export interface SingleChunkUploadBody {
  uploadId: string;
  key: string;
  partNumbers: number[];
}

export interface SignPartsResponse {
  uploadId: string;
  parts: PresignedPart[]; // Uses 'url' field
}

export interface BatchChunkReport {
  params: { vid: string };
  parts: UploadedPart[];
}

export interface ChunkUploadResponse {
  progress: number;
  uploadedChunks: number;
  totalChunks: number;
}

export interface CancelUploadPayload {
  videoId: string;
  objectKey: string;
  uploadId: string;
}

export interface CancelUploadResponse {
  videoId: string;
  status: string;
}

// ─── Frontend Session Types ───────────────────────────────────────────────

export interface UploadSession {
  videoId: string;
  uploadId: string;
  key: string;
  fileUri: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  chunkSize: number;
  totalParts: number;
  uploadedParts: UploadedPart[];
  presignedUrls: PresignedPart[]; // Uses 'url' field
  status: UploadStatus;
  createdAt: number;
  updatedAt: number;
  thumbnailLocalUri?: string;
  thumbnailType?: ThumbnailType;
  thumbnailPresignedUrl?: string;
  thumbnailKey?: string;
  previewKey?: string;
  metadata?: {
    title: string;
    description?: string;
  };
}

export interface StartUploadParams {
  fileUri: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  thumbnailLocalUri?: string;
  thumbnailType?: ThumbnailType;
  metadata: {
    title: string;
    description?: string;
    visibility: Visibility;
    madeForKids: boolean;
    allowComments: boolean;
    allowRating: boolean;
    chapters: Chapter[];
  };
}

export interface ProgressUpdate {
  progress: number;
  uploadedBytes: number;
  totalBytes: number;
  activeParts: number;
  completedParts: number;
  totalParts: number;
  completedBytes?: number;
  inFlightBytes?: number;
  speed?: number;
}

export interface UploadCallbacks {
  onProgress?: (progress: ProgressUpdate) => void;
  onStatusChange?: (status: UploadStatus) => void;
  onError?: (error: Error) => void;
}

export type ChunkStatus = "PENDING" | "UPLOADING" | "DONE" | "FAILED" | "RETRYING";

export interface ChunkMeta {
  partNumber: number;
  status: ChunkStatus;
  etag?: string;
  retryCount: number;
  lastError?: string;
}