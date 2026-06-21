// Upload redux slice.

import { createSlice } from "@reduxjs/toolkit";
import { UploadState } from "./upload.types";

const initialState: UploadState = {
  loading: false,
  progress: 0,
  status: "IDLE",
  message: "",
  currentVideoId: null,
  uploadId: null,
  error: null,
};

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    // mark upload as started, clear previous error
    startUpload: (state) => {
      state.loading = true;
      state.error = null;
    },
    // update progress percentage
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    // update status + message
    setStatus: (state, action) => {
      state.status = action.payload.status;
      state.message = action.payload.message;
    },
    // store uploaded video id
    setVideoId: (state, action) => {
      state.currentVideoId = action.payload;
    },
    // mark upload as completed
    uploadSuccess: (state) => {
      state.loading = false;
      state.status = "COMPLETED";
      state.progress = 100;
    },
    // mark upload as failed with error
    uploadFailed: (state, action) => {
      state.loading = false;
      state.status = "FAILED";
      state.error = action.payload;
    },
    // reset to initial state
    resetUpload: () => initialState,
  },
});

export const {
  startUpload,
  setProgress,
  setStatus,
  setVideoId,
  uploadSuccess,
  uploadFailed,
  resetUpload,
} = uploadSlice.actions;

export default uploadSlice.reducer;