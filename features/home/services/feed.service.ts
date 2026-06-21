/**
 * Video API service
 */

import axiosInstance from "@/lib/api";
import type { ApiVideo } from "../types/video";

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface UpdateVideoPayload {
  title?: string;
  description?: string;
  thumbnailUrl?: string;
}

interface PaginatedVideos {
  data: ApiVideo[];
}

interface ApiEnvelope<T> {
  data: T;
}

class VideoService {
  /**
   * Get all videos
   */
  async getAllVideos(query: PaginationQuery = {}) {
    const response =
      await axiosInstance.get<ApiEnvelope<PaginatedVideos>>(
        "/videos",
        {
      params: {
        page: query.page ?? 1,
        limit: query.limit ?? 10,
      },
        },
      );

    return response.data.data;
  }

  /**
   * Get current user's videos
   */
  async getMyVideos(query: PaginationQuery = {}) {
    const response =
      await axiosInstance.get<ApiEnvelope<PaginatedVideos>>(
        "/videos/me",
        {
          params: {
            page: query.page ?? 1,
            limit: query.limit ?? 10,
          },
        },
      );

    return response.data.data;
  }

  /**
   * Get single video
   */
  async getVideoById(vid: string) {
    const response =
      await axiosInstance.get<ApiEnvelope<ApiVideo>>(
        `/videos/${vid}`,
      );

    return response.data.data;
  }

  /**
   * Update video metadata
   */
  async updateVideo(
    vid: string,
    payload: UpdateVideoPayload,
  ) {
    const response = await axiosInstance.patch(
      `/videos/${vid}`,
      payload,
    );

    return response.data;
  }

  /**
   * Delete video
   */
  async deleteVideo(vid: string) {
    const response = await axiosInstance.delete(
      `/videos/${vid}`,
    );

    return response.data;
  }
}

export const videoService = new VideoService();
