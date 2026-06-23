import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { uploadVideoThunk } from "./upload.thunk";
import type { UploadApiState } from "./uploadApi.slice";

export const buildUploadExtraReducers = (
  builder: ActionReducerMapBuilder<UploadApiState>
) => {
  builder
    .addCase(uploadVideoThunk.pending, (state) => {
      state.isUploading = true;
      state.uploadError = null;
    })
    .addCase(uploadVideoThunk.fulfilled, (state, action) => {
      state.isUploading = false;
      state.uploadProgress = 100;
      state.uploadedVideoId = action.payload.videoId;
    })
    .addCase(uploadVideoThunk.rejected, (state, action) => {
      state.isUploading = false;
      state.uploadError = action.payload ?? "Upload failed";
    });
};
