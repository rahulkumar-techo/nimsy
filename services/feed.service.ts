/**
 * Video API service
 */

import axiosInstance from "@/lib/api";

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface UpdateVideoPayload {
  title?: string;
  description?: string;
  thumbnailUrl?: string;
}

class VideoService {
  /**
   * Get all videos
   */
  async getAllVideos(query: PaginationQuery = {}) {
    const response = await axiosInstance.get("/videos", {
      params: {
        page: query.page ?? 1,
        limit: query.limit ?? 10,
      },
    });
// console.log(JSON.stringify(response.data.data,null,2))
    return response.data.data;
  }

  /**
   * Get current user's videos
   */
  async getMyVideos(query: PaginationQuery = {}) {
    const response = await axiosInstance.get("/videos/me", {
      params: {
        page: query.page ?? 1,
        limit: query.limit ?? 10,
      },
    });

    return response.data;
  }

  /**
   * Get single video
   */
  async getVideoById(vid: string) {
    const response = await axiosInstance.get(`/videos/${vid}`);

    return response.data;
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