// Upload video thunk.

import { createAsyncThunk } from "@reduxjs/toolkit";

import { videoService } from "@/services/video/video.service";
import {
  setProgress,
  setStatus,
  setVideoId,
  startUpload,
  uploadFailed,
  uploadSuccess,
} from "./upload.slice";
import { getVideoBuffer } from "@/utils/upload/video-file.util";

export const uploadVideoThunk = createAsyncThunk(
  "upload/video",
  async ({ video, metadata }: { video: any; metadata: any }, { dispatch }) => {
    try {
      dispatch(startUpload());

      // read video file into buffer
      const fileBuffer = await getVideoBuffer(video.uri);

      // upload with progress/status callback
      const result = await videoService.uploadVideo(fileBuffer, metadata, (progress, status, message) => {
        dispatch(setProgress(progress));
        dispatch(setStatus({ status, message }));
      });

      dispatch(setVideoId(result.upload.videoId));
      dispatch(uploadSuccess());

      return result;
    } catch (error) {
      dispatch(uploadFailed(error instanceof Error ? error.message : "Upload failed"));
      throw error;
    }
  },
);