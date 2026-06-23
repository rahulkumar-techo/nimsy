// Types for persisted upload sessions (resume-after-restart support).

import { UploadPhase } from "./upload.types";

export type PartStatus = "PENDING" | "CHUNKED" | "UPLOADING" | "UPLOADED" | "FAILED";

// One S3 multipart part, tracked through its native-chunk-file lifecycle.
export interface PersistedPart {
  partNumber: number;
  url: string;
  status: PartStatus;
  etag?: string;
  // Path to the on-disk chunk file produced natively. Never holds bytes in JS.
  localChunkPath?: string;
  // ID returned by the native background-upload module, used to re-attach
  // listeners after an app restart / process death.
  nativeUploadId?: string;
  attempts: number;
}

export interface UploadSession {
  videoId: string;
  uploadSessionId: string;
  uploadId: string;
  objectKey: string;
  sourceFilePath: string;
  chunkSize: number;
  totalChunks: number;
  parts: PersistedPart[];
  thumbnailKey: string;
  phase: UploadPhase;
  createdAt: number;
  updatedAt: number;
}

export const isSessionComplete = (session: UploadSession): boolean =>
  session.parts.every((p) => p.status === "UPLOADED");
