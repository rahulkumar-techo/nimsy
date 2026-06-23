import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Visibility = "PUBLIC" | "PRIVATE" | "UNLISTED";

export interface Chapter {
  id: string;
  title: string;
  timestamp: string;
}

export interface UploadState {
  videoUri: string | null;
  thumbnailUri: string | null;
  title: string;
  description: string;
  visibility: Visibility;
  madeForKids: boolean;
  chapters: Chapter[];
}

const initialState: UploadState = {
  videoUri: null,
  thumbnailUri: null,
  title: "",
  description: "",
  visibility: "PUBLIC",
  madeForKids: false,
  chapters: [],
};

const uploadSlice = createSlice({
  name: "upload",
  initialState,
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
    resetUpload: () => initialState,
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
} = uploadSlice.actions;

export default uploadSlice.reducer;
