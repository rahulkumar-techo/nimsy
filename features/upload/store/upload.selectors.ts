
/**
 * Upload selectors.
 */

import { RootState } from "@/store/store";

export const selectUpload =(state: RootState) => state.upload;

export const selectUploadProgress = (state: RootState) => state.upload.progress;

export const selectUploadLoading = (state: RootState) => state.upload.loading;

export const selectUploadMessage = (state: RootState) => state.upload.message;

export const selectUploadStatus = (state: RootState) => state.upload.status;