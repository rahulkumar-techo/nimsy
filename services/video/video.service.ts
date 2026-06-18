/**
 * Video multipart upload service.
 *
 * Workflow:
 * 1. Create multipart upload session
 * 2. Upload chunks to S3
 * 3. Store uploaded chunk metadata
 * 4. Complete multipart upload
 * 5. Track processing status
 */

import axiosInstance from "@/lib/api";
import { VIDEO_ENDPOINTS } from "@/constants/video.constants";

export interface PresignedMetadata {
  title: string;
  description?: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
}

export interface UploadPart {
  partNumber: number;
  url: string;
}

export interface UploadedPart {
  partNumber: number;
  etag: string;
}

export interface InitUploadResponse {
  videoId: string;
  uploadSessionId: string;
  uploadId: string;
  objectKey: string;
  chunkSize: number;
  totalChunks: number;
  urls: UploadPart[];
}

export interface CompleteUploadPayload {
  videoId: string;
  uploadId: string;
  parts: UploadedPart[];
}

export interface UploadStatusResponse {
  status: string;
  progress: number;
  uploadedChunks: number;
  totalChunks: number;
  remainingChunks: number;
  isCompleted: boolean;
}

export type UploadCallback = (
  progress: number,
  status: string,
  message: string,
) => void;

class VideoService {
  // ================= Upload Session =================

  /**
   * Create a multipart upload session
   * and generate presigned URLs.
   */
  async requestPresignedUrls(payload: PresignedMetadata): Promise<InitUploadResponse> {
    const { data } = await axiosInstance.post(VIDEO_ENDPOINTS.INITUPLOAD, payload);
    return data.data;
  }

  /**
   * Upload a single chunk to S3
   * using a presigned URL.
   */
  async uploadChunk(url: string, chunk: ArrayBuffer,): Promise<string> {
    const response = await fetch(url, {
      method: "PUT",
      body: chunk,
      headers: {
        "Content-Type":
          "application/octet-stream",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Chunk upload failed (${response.status})`,
      );
    }

    const etag = response.headers.get("etag") ?? response.headers.get("ETag");

    if (!etag) {
      throw new Error("ETag missing from upload response",);
    }
    return etag.replace(/"/g, "");
  }

  /**
   * Store uploaded chunk metadata
   * for resumable uploads.
   */
  async chunkUploadCompleted(videoId: string, etag: string, partNumber: number) {
    await axiosInstance.post(`/videos/${videoId}/upload/chunks`,
      {
        etag,
        partNumber,
      },
    );
  }

  // ================= Chunk Upload =================

  /**
   * Upload all chunks sequentially
   * and track progress.
   */
  async uploadChunks(file: ArrayBuffer, upload: InitUploadResponse,
    onProgress?: (
      progress: number,
    ) => void,
  ): Promise<UploadedPart[]> {
    const parts: UploadedPart[] = [];

    for (let i = 0; i < upload.urls.length; i++) {
      const part = upload.urls[i];

      // Calculate chunk boundaries
      const start = i * upload.chunkSize;
      const end = Math.min(start + upload.chunkSize, file.byteLength);

      // Extract current chunk
      const chunk = file.slice(start, end);

      // Upload chunk to S3
      const etag = await this.uploadChunk(part.url, chunk);

      // Save upload progress for resume support
      await this.chunkUploadCompleted(
        upload.videoId,
        etag,
        part.partNumber,
      );

      // Store uploaded part for completion request
      parts.push({
        partNumber:
          part.partNumber,
        etag,
      });

      onProgress?.(Math.round(((i + 1) / upload.urls.length) * 100));
    }

    return parts;
  }

  // ================= Upload Completion =================

  /**
   * Finalize multipart upload
   * and merge uploaded chunks.
   */
  async completeUpload(payload: CompleteUploadPayload) {

    const { data } = await axiosInstance.post(VIDEO_ENDPOINTS.COMPLETEUPLOAD, payload);
    return data.data;
  }

  // ================= Upload Status =================

  /**
   * Get multipart upload status.
   *
   * Used for:
   * - Upload recovery
   * - Progress synchronization
   * - Processing state tracking
   */
  async getUploadStatus(
    videoId: string,
  ): Promise<UploadStatusResponse> {

    const { data } = await axiosInstance.get(
      `/videos/${videoId}/upload/status`,
    );

    return data.data;
  }

  // ================= Upload Workflow =================

  /**
   * Execute the complete upload workflow.
   *
   * States:
   * INITIALIZING
   * → UPLOADING
   * → COMPLETING
   * → PROCESSING
   */
  async uploadVideo(
    file: ArrayBuffer,
    metadata: PresignedMetadata,
    onUpdate?: UploadCallback,
  ) {
    onUpdate?.(
      0,
      "INITIALIZING",
      "Preparing upload...",
    );

    // Create upload session
    const upload = await this.requestPresignedUrls(
      metadata,
    );

    // Upload file chunks
    const parts = await this.uploadChunks(
      file,
      upload,
      (progress) =>
        onUpdate?.(
          progress,
          "UPLOADING",
          `Uploading ${progress}%`,
        ),
    );

    onUpdate?.(
      100,
      "COMPLETING",
      "Finalizing upload...",
    );

    // Complete multipart upload
    await this.completeUpload({
      videoId: upload.videoId,
      uploadId: upload.uploadId,
      parts,
    });

    onUpdate?.(100, "PROCESSING", "Video processing...",);

    return {
      upload,
      parts,
    };
  }
}

export const videoService = new VideoService();