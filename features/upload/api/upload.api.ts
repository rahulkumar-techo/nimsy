/**
 * Upload API Service
 * Handles communication with backend upload endpoints.
 * Does NOT perform direct S3 uploads — only presigned URL operations.
 */

import axiosInstance from "@/lib/api";
import {
  UploadInitRequest,
  UploadInitResponse,
  UploadStatusResponse,
  CompleteUploadRequest,
  SingleChunkUploadBody,
  SignPartsResponse,
  BatchChunkReport,
  ChunkUploadResponse,
  CancelUploadPayload,
  CancelUploadResponse,
} from "../types/upload.types";

/**
 * Upload API — All endpoints aligned with backend video.routes.ts
 */
export const uploadApi = {
  /**
   * POST /videos/upload/init
   * Initialize multipart upload. Returns presigned URLs for all chunks.
   */
  async initialize(payload: UploadInitRequest): Promise<UploadInitResponse> {
    const { data } = await axiosInstance.post("/videos/upload/init", payload);
    return data.data;
  },

  /**
   * POST /videos/upload/complete
   * Finalize multipart upload. Triggers video processing pipeline.
   */
  async complete(payload: CompleteUploadRequest): Promise<{ videoId: string; status: string }> {
    const { data } = await axiosInstance.post("/videos/upload/complete", payload);
    return data.data;
  },

  /**
   * GET /videos/:videoId/upload/status
   * Get upload progress for resume functionality.
   */
  async getStatus(videoId: string): Promise<UploadStatusResponse> {
    const { data } = await axiosInstance.get(`/videos/${videoId}/upload/status`);
    return data.data;
  },

  /**
   * POST /videos/upload/singleChunk
   * Get fresh presigned URLs for missing parts (resume/retry).
   */
  async singleChunk(payload: SingleChunkUploadBody): Promise<SignPartsResponse> {
    const { data } = await axiosInstance.post("/videos/upload/singleChunk", payload);
    return data.data;
  },

  /**
   * POST /videos/:vid/upload/chunks
   * Mark a single chunk as uploaded.
   */
  async markAsChunkUploaded(payload: {
    params: { vid: string };
    etag: string;
    partNumber: number;
  }): Promise<ChunkUploadResponse> {
    const { data } = await axiosInstance.post(
      `/videos/${payload.params.vid}/upload/chunks`,
      payload
    );
    return data.data;
  },

  /**
   * POST /videos/:vid/upload/chunks/batch
   * Mark multiple chunks as uploaded in one request.
   * Preferred for performance — reduces API calls.
   */
  async markMultipleChunksUploaded(payload: BatchChunkReport): Promise<ChunkUploadResponse> {
    const { data } = await axiosInstance.post(
      `/videos/${payload.params.vid}/upload/chunks/batch`,
      payload
    );
    return data.data;
  },

  /**
   * POST /videos/upload/cancel
   * Cancel upload and enqueue cleanup job.
   */
  async cancelUpload(payload: CancelUploadPayload): Promise<CancelUploadResponse> {
    const { data } = await axiosInstance.post("/videos/upload/cancel", payload);
    return data.data;
  },
};