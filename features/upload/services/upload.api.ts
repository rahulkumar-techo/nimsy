/**
 * Upload API Service
 * Handles communication with backend upload endpoints.
 * Does NOT perform direct S3 uploads - only presigned URL operations.
 */

import axiosInstance from "@/lib/api";
import {
  UploadInitRequest,
  UploadInitResponse,
  UploadStatusResponse,
  CompleteUploadRequest,
} from "../types/upload.types";

export const uploadApi = {
  /**
   * POST /upload/init
   * Initializes S3 multipart upload and returns presigned URLs.
   */
  async initialize(payload: UploadInitRequest): Promise<UploadInitResponse> {
    const { data } = await axiosInstance.post("/videos/upload/init", payload);
    return data.data;
  },

  /**
   * POST /upload/complete
   * Finalizes the multipart upload on the backend.
   */
  async complete(payload: CompleteUploadRequest): Promise<void> {
    console.log(JSON.stringify(payload,null,5))
    const{data}= await axiosInstance.post("/videos/upload/complete", payload);
    return data.data;
  },

  /**
   * GET /videos/:videoId/upload/status
   * Gets authoritative server state for resume functionality.
   */
  async getStatus(videoId: string): Promise<UploadStatusResponse> {
    const { data } = await axiosInstance.get(`/videos/${videoId}/upload/status`);
    return data.data;
  },
};