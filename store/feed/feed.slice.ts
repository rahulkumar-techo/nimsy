// feed.slice.ts
// Feed state: video list (with pagination), single video, and request status flags.

import { createSlice } from "@reduxjs/toolkit";
import {
  fetchVideos,
  fetchMyVideos,
  fetchVideoById,
  updateVideoThunk,
  deleteVideoThunk,
} from "./feed.thunk";

interface FeedState {
  videos: any[];
  video: any | null;
  loading: boolean; // initial load
  loadingMore: boolean; // pagination (infinite scroll)
  refreshing: boolean; // pull-to-refresh
  error: unknown;
  page: number;
  hasMore: boolean;
}

const initialState: FeedState = {
  videos: [],
  video: null,
  loading: false,
  loadingMore: false,
  refreshing: false,
  error: null,
  page: 1,
  hasMore: true,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    resetFeed: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // paginated list: pending sets the right loading flag based on mode
      .addCase(fetchVideos.pending, (state, action) => {
        const { mode } = action.meta.arg;
        if (mode === "refresh") state.refreshing = true;
        else if (mode === "loadMore") state.loadingMore = true;
        else state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        const { mode } = action.meta.arg;
        const { data, page, hasMore } = action.payload;

        state.videos = mode === "loadMore" ? [...state.videos, ...data] : data;
        state.page = page;
        state.hasMore = hasMore;
        state.loading = state.refreshing = state.loadingMore = false;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = state.refreshing = state.loadingMore = false;
        state.error = action.error;
      })

      // my videos
      .addCase(fetchMyVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyVideos.fulfilled, (state, action) => {
        state.videos = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchMyVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })

      // single video
      .addCase(fetchVideoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.video = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchVideoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })

      // update
      .addCase(updateVideoThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVideoThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateVideoThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })

      // delete: remove from local list optimistically once confirmed
      .addCase(deleteVideoThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVideoThunk.fulfilled, (state, action) => {
        state.videos = state.videos.filter((v) => v.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteVideoThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export const { resetFeed } = feedSlice.actions;
export default feedSlice.reducer;