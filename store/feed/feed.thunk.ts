// feed.thunks.ts
// Async thunks for the feed: list (paginated), my videos, single video, update, delete.

import { createAsyncThunk } from "@reduxjs/toolkit";
import { PaginationQuery, UpdateVideoPayload, videoService } from "../../services/feed.service";

type FetchMode = "initial" | "refresh" | "loadMore";

// Paginated video list — mode tells the slice how to merge results (replace vs append).
export const fetchVideos = createAsyncThunk(
  "feed/fetchVideos",
  async ({ query, mode }: { query: PaginationQuery; mode: FetchMode }) => {
    const response = await videoService.getAllVideos(query);
    return {
      data: response.data,
      page: query.page ?? 1,
      hasMore: response.data.length === query.limit,
    };
  },
);

// Current user's videos.
export const fetchMyVideos = createAsyncThunk("feed/fetchMyVideos", async (query: PaginationQuery) => {
  const response = await videoService.getMyVideos(query);
  return { data: response.data };
});

// Single video by id.
export const fetchVideoById = createAsyncThunk("feed/fetchVideoById", async (videoId: string) => {
  const response = await videoService.getVideoById(videoId);
  return { data: response.data };
});

// Update a video.
export const updateVideoThunk = createAsyncThunk(
  "feed/updateVideo",
  async ({ videoId, payload }: { videoId: string; payload: UpdateVideoPayload }) =>
    videoService.updateVideo(videoId, payload),
);

// Delete a video.
export const deleteVideoThunk = createAsyncThunk("feed/deleteVideo", async (videoId: string) => {
  await videoService.deleteVideo(videoId);
  return videoId;
});