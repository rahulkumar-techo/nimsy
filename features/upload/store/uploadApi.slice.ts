import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { buildUploadExtraReducers } from "./upload.extra-reducers";

export interface UploadApiState {
  isUploading: boolean;
  uploadError: string | null;
  uploadProgress: number;
  uploadMessage: string;
  uploadedVideoId: string | null;
}

const initialState: UploadApiState = {
  isUploading: false,
  uploadError: null,
  uploadProgress: 0,
  uploadMessage: "",
  uploadedVideoId: null,
};

const uploadApiSlice = createSlice({
  name: "uploadApi",
  initialState,
  reducers: {
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    setUploadMessage: (state, action: PayloadAction<string>) => {
      state.uploadMessage = action.payload;
    },
    resetUpload: () => initialState,
  },
  extraReducers: (builder) => {
    buildUploadExtraReducers(builder);
  },
});

export const { setUploadProgress, setUploadMessage, resetUpload } =
  uploadApiSlice.actions;
export default uploadApiSlice.reducer;
