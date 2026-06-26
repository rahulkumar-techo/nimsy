/**
 * Upload Slice
 * Redux state for form data and upload progress tracking.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UploadedPart, UploadStatus, Visibility } from "../types/upload.types";

export interface Chapter {
  id: string;
  title: string;
  startTime: number;
}

export interface UploadFormState {
  videoUri: string | null;
  thumbnailUri: string | null;
  title: string;
  description: string;
  visibility: Visibility;
  madeForKids: boolean;
  chapters: Chapter[];
}

const initialFormState: UploadFormState = {
  videoUri: null,
  thumbnailUri: null,
  title: "",
  description: "",
  visibility: "PUBLIC",
  madeForKids: false,
  chapters: [],
};

export interface UploadProgressState {
  progress: number;
  uploadedBytes: number;
  totalBytes: number;
  activeParts: number;
  completedParts: number;
  totalParts: number;
  status: UploadStatus;
  error: string | null;
  isUploading: boolean;
  currentVideoId: string | null;
  uploadedParts: UploadedPart[];
  completedBytes?: number,
  inFlightBytes?: number,
}

const initialProgressState: UploadProgressState = {
  progress: 0,
  uploadedBytes: 0,
  totalBytes: 0,
  activeParts: 0,
  completedParts: 0,
  totalParts: 0,
  status: "IDLE",
  error: null,
  isUploading: false,
  currentVideoId: null,
  uploadedParts: [],
  completedBytes:0,
  inFlightBytes:0
};

// Form slice for upload metadata
const uploadFormSlice = createSlice({
  name: "upload",
  initialState: initialFormState,
  reducers: {
    setVideoUri: (state, action: PayloadAction<string | null>) => {
      state.videoUri = action.payload;
    },
    setThumbnailUri: (state, action: PayloadAction<string | null>) => {
      state.thumbnailUri = action.payload;
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setVisibility: (state, action: PayloadAction<Visibility>) => {
      state.visibility = action.payload;
    },
    setMadeForKids: (state, action: PayloadAction<boolean>) => {
      state.madeForKids = action.payload;
    },
    addChapter: (state, action: PayloadAction<Chapter>) => {
      state.chapters.push(action.payload);
    },
    updateChapter: (state, action: PayloadAction<Chapter>) => {
      const idx = state.chapters.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) state.chapters[idx] = action.payload;
    },
    removeChapter: (state, action: PayloadAction<string>) => {
      state.chapters = state.chapters.filter((c) => c.id !== action.payload);
    },
    resetUpload: () => initialFormState,
  },
});

// Progress slice for upload UI state
const uploadProgressSlice = createSlice({
  name: "uploadUI",
  initialState: initialProgressState,
  reducers: {
    setProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    setProgressDetail: (state, action: PayloadAction<{
      uploadedBytes: number; totalBytes: number; activeParts: number; completedParts: number; totalParts: number, completedBytes?: number,
      inFlightBytes?: number
    }>) => {
      state.uploadedBytes = action.payload.uploadedBytes;
      state.totalBytes = action.payload.totalBytes;
      state.activeParts = action.payload.activeParts;
      state.completedParts = action.payload.completedParts;
      state.totalParts = action.payload.totalParts;
      state.progress = (action.payload.uploadedBytes / action.payload.totalBytes) * 100;
      // additional
      state.completedBytes = action.payload?.completedBytes;
      state.inFlightBytes = action.payload?.inFlightBytes;
    },
    setStatus: (state, action: PayloadAction<UploadStatus>) => {
      state.status = action.payload;
      state.isUploading =
        action.payload === "INITIALIZING" ||
        action.payload === "INITIATED" ||
        action.payload === "UPLOADING" ||
        action.payload === "COMPLETING";
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setVideoId: (state, action: PayloadAction<string | null>) => {
      state.currentVideoId = action.payload;
    },
    setUploadedParts: (state, action: PayloadAction<UploadedPart[]>) => {
      state.uploadedParts = action.payload;
    },
    resetUploadProgress: () => initialProgressState,
  },
});

export const {
  setVideoUri,
  setThumbnailUri,
  setTitle,
  setDescription,
  setVisibility,
  setMadeForKids,
  addChapter,
  updateChapter,
  removeChapter,
  resetUpload,
} = uploadFormSlice.actions;

export const {
  setProgress,
  setProgressDetail,
  setStatus,
  setError,
  setVideoId,
  setUploadedParts,
  resetUploadProgress,
} = uploadProgressSlice.actions;

export default uploadFormSlice.reducer;
export const uploadProgressReducer = uploadProgressSlice.reducer;