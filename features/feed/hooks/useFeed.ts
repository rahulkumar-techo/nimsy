// useFeed.ts
// Thin hook over the feed slice — same surface as before, now backed by redux.

import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { PaginationQuery, UpdateVideoPayload } from "@/services/feed.service";
import { deleteVideoThunk, fetchMyVideos, fetchVideoById, fetchVideos, updateVideoThunk } from "@/store/feed/feed.thunk";
import type { AppDispatch, RootState } from "@/store/store";

export function useFeed(initialLimit = 10) {
  const dispatch = useDispatch<AppDispatch>();

  const videos = useSelector((state: RootState) => state.feed.videos);
  const video = useSelector((state: RootState) => state.feed.video);
  const loading = useSelector((state: RootState) => state.feed.loading);
  const loadingMore = useSelector((state: RootState) => state.feed.loadingMore);
  const refreshing = useSelector((state: RootState) => state.feed.refreshing);
  const error = useSelector((state: RootState) => state.feed.error);
  const page = useSelector((state: RootState) => state.feed.page);
  const hasMore = useSelector((state: RootState) => state.feed.hasMore);

  // initial page load
  const getAllVideos = useCallback(
    (query: PaginationQuery = { page: 1, limit: initialLimit }) =>
      dispatch(fetchVideos({ query, mode: "initial" })).unwrap(),
    [dispatch, initialLimit],
  );

  // pull-to-refresh: reset back to page 1
  const onRefresh = useCallback(
    () => dispatch(fetchVideos({ query: { page: 1, limit: initialLimit }, mode: "refresh" })),
    [dispatch, initialLimit],
  );

  // infinite scroll: fetch next page and append, guarded against duplicate/over-fetching
  const loadMore = useCallback(() => {
    if (loading || refreshing || loadingMore || !hasMore) return;
    dispatch(fetchVideos({ query: { page: page + 1, limit: initialLimit }, mode: "loadMore" }));
  }, [dispatch, initialLimit, page, hasMore, loading, loadingMore, refreshing]);

  const getMyVideos = useCallback(
    (query: PaginationQuery = { page: 1, limit: initialLimit }) => dispatch(fetchMyVideos(query)).unwrap(),
    [dispatch, initialLimit],
  );

  const getVideoById = useCallback((videoId: string) => dispatch(fetchVideoById(videoId)).unwrap(), [dispatch]);

  const updateVideo = useCallback(
    (videoId: string, payload: UpdateVideoPayload) => dispatch(updateVideoThunk({ videoId, payload })).unwrap(),
    [dispatch],
  );

  const deleteVideo = useCallback((videoId: string) => dispatch(deleteVideoThunk(videoId)).unwrap(), [dispatch]);

  useEffect(() => {
    getAllVideos();
  }, []);

  return {
    videos,
    video,
    loading,
    loadingMore,
    refreshing,
    error,
    hasMore,

    getAllVideos,
    onRefresh,
    loadMore,
    getMyVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
  };
}