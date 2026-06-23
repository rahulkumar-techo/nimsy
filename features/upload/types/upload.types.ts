// Domain types for the upload feature (metadata, video selection, UI options).

export interface Chapter {
  id: string;
  time: string;
  title: string;
}

export type VisibilityOption = "public" | "unlisted" | "private" | "scheduled";

// A video selected from the native picker. `uri` is a native file path/content
// URI — never a Blob/ArrayBuffer. The file is streamed natively from this path,
// it is never read into JS memory.
export interface SelectedVideo {
  uri: string;
  name: string;
  mimeType?: string;
  size?: number;
}

export interface SelectedThumbnail {
  uri: string;
  fileName: string;
}

export interface UploadMetadata {
  title: string;
  description?: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  chapters: Chapter[];
  madeForKids: boolean;
  allowComments: boolean;
  allowRatings: boolean;
}

export interface UploadPart {
  partNumber: number;
  url: string;
}

export interface InitUploadResponse {
  videoId: string;
  uploadSessionId: string;
  uploadId: string;
  objectKey: string;
  chunkSize: number;
  totalChunks: number;
  urls: UploadPart[];
  thumbnailKey: string;
  previewKey: string | null;
  thumbnailUploadUrl: string | null;
}

export interface UploadedPart {
  partNumber: number;
  etag: string;
}

export interface CompleteUploadPayload {
  videoId: string;
  uploadId: string;
  parts: UploadedPart[];
}

export interface ServerUploadStatusResponse {
  status: string;
  progress: number;
  uploadedChunks: number;
  totalChunks: number;
  remainingChunks: number;
  isCompleted: boolean;
}

export type UploadPhase =
  | "IDLE"
  | "INITIALIZING"
  | "CHUNKING"
  | "UPLOADING"
  | "COMPLETING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type UploadProgressCallback = (progress: number, phase: UploadPhase, message: string) => void;
