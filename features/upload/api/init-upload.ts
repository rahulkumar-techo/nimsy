import axiosInstance from "@/lib/api";
import { VIDEO_ENDPOINTS } from "@/constants/video.constants";
import { InitUploadResponse, UploadMetadata } from "../types/upload.types";

// Create a multipart upload session on the backend and get presigned part
// URLs. Backend contract is unchanged from the previous implementation —
// only the client-side transport (native streaming vs. axios+ArrayBuffer)
// changes.
export async function initUpload(payload: UploadMetadata): Promise<InitUploadResponse> {
  const { data } = await axiosInstance.post(VIDEO_ENDPOINTS.INITUPLOAD, payload);
  return data.data;
}
