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
  success: boolean;
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

export type UploadStatus =
  | "INITIALIZING"
  | "UPLOADING"
  | "COMPLETING"
  | "PROCESSING"
  | "SUCCESS";

export type UploadCallback = (
  progress: number,
  status: UploadStatus,
  message: string
) => void;

class VideoService {
  async requestPresignedUrls(
    payload: PresignedMetadata
  ): Promise<InitUploadResponse> {
    const { data } = await axiosInstance.post<{
      data: InitUploadResponse;
    }>(
      VIDEO_ENDPOINTS.INITUPLOAD,
      payload
    );

    return data.data;
  }

  async uploadChunk(
    url: string,
    chunk: Blob
  ): Promise<string> {
    console.log("Uploading chunk", {
      size: chunk.size,
    });

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
      response.headers.get("etag") ||
      response.headers.get("ETag");

    if (!etag) {
      throw new Error(
        "ETag missing from S3 response"
      );
    }

    return etag.replace(/"/g, "");
  }

  async uploadChunks(
    file: Blob,
    upload: InitUploadResponse,
    onProgress?: (progress: number) => void
  ): Promise<UploadedPart[]> {
    const parts: UploadedPart[] = [];

    for (let i = 0; i < upload.urls.length; i++) {
      const part = upload.urls[i];

      const start = i * upload.chunkSize;
      const end = Math.min(
        start + upload.chunkSize,
        file.size
      );

      const chunk = file.slice(start, end);

      console.log("Chunk info", {
        partNumber: part.partNumber,
        start,
        end,
        chunkSize: chunk.size,
      });

      if (chunk.size === 0) {
        throw new Error(
          `Chunk ${part.partNumber} is empty`
        );
      }

      const etag = await this.uploadChunk(
        part.url,
        chunk
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

  async completeUpload(
    payload: CompleteUploadPayload
  ) {
    const { data } = await axiosInstance.post(
      VIDEO_ENDPOINTS.COMPLETEUPLOAD,
      payload
    );

    return data.data;
  }

  async uploadVideo(
    file: Blob,
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

    onUpdate?.(
      0,
      "UPLOADING",
      "Uploading video..."
    );

    const parts = await this.uploadChunks(
      file,
      upload,
      (progress) => {
        onUpdate?.(
          progress,
          "UPLOADING",
          `Uploading ${progress}%`
        );
      }
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
      "Video is being processed..."
    );

    return {
      upload,
      parts,
    };
  }
}

export const videoService =
  new VideoService();