/**
 * Video multipart upload service
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
  message: string
) => void;

class VideoService {
  // Create upload session
  async requestPresignedUrls(
    payload: PresignedMetadata
  ): Promise<InitUploadResponse> {
    const { data } = await axiosInstance.post(
      VIDEO_ENDPOINTS.INITUPLOAD,
      payload
    );

    return data.data;
  }

  // Upload single chunk to S3
  async uploadChunk(
    url: string,
    chunk: ArrayBuffer
  ): Promise<string> {
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
        `Chunk upload failed (${response.status})`
      );
    }

    const etag =
      response.headers.get("etag") ??
      response.headers.get("ETag");

    if (!etag) {
      throw new Error("ETag missing");
    }

    return etag.replace(/"/g, "");
  }

  // Save uploaded chunk metadata
  async chunkUploadCompleted(
    videoId: string,
    etag: string,
    partNumber: number
  ) {
    await axiosInstance.post(
      `/videos/${videoId}/upload/chunks`,
      {
        etag,
        partNumber,
      }
    );
  }

  // Upload all chunks
  async uploadChunks(
    file: ArrayBuffer,
    upload: InitUploadResponse,
    onProgress?: (progress: number) => void
  ): Promise<UploadedPart[]> {
    const parts: UploadedPart[] = [];

    for (let i = 0; i < upload.urls.length; i++) {
      const part = upload.urls[i];

      const start = i * upload.chunkSize;
      const end = Math.min(
        start + upload.chunkSize,
        file.byteLength
      );

      const chunk = file.slice(start, end);

      const etag = await this.uploadChunk(
        part.url,
        chunk
      );

      await this.chunkUploadCompleted(
        upload.videoId,
        etag,
        part.partNumber
      );

      parts.push({
        partNumber: part.partNumber,
        etag,
      });

      onProgress?.(
        Math.round(
          ((i + 1) / upload.urls.length) * 100
        )
      );
    }

    return parts;
  }

  // Complete multipart upload
  async completeUpload(
    payload: CompleteUploadPayload
  ) {
    const { data } = await axiosInstance.post(
      VIDEO_ENDPOINTS.COMPLETEUPLOAD,
      payload
    );

    return data.data;
  }

  // Get processing status
  async getUploadStatus(
    videoId: string
  ): Promise<UploadStatusResponse> {
    const { data } = await axiosInstance.get(
      `/videos/${videoId}/upload/status`
    );

    return data.data;
  }

  // Full upload workflow
  async uploadVideo(
    file: any,
    metadata: PresignedMetadata,
    onUpdate?: UploadCallback
  ) {
    onUpdate?.(
      0,
      "INITIALIZING",
      "Preparing upload..."
    );

    const upload =
      await this.requestPresignedUrls(metadata);

    const parts = await this.uploadChunks(
      file,
      upload,
      (progress) =>
        onUpdate?.(
          progress,
          "UPLOADING",
          `Uploading ${progress}%`
        )
    );

    onUpdate?.(
      100,
      "COMPLETING",
      "Finalizing upload..."
    );

    await this.completeUpload({
      videoId: upload.videoId,
      uploadId: upload.uploadId,
      parts,
    });

    onUpdate?.(
      100,
      "PROCESSING",
      "Video processing..."
    );

    return {
      upload,
      parts,
    };
  }
}

export const videoService =
  new VideoService();