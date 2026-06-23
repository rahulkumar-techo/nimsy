import axiosInstance from "@/lib/api";
import { VIDEO_ENDPOINTS } from "@/constants/video.constants";
import { CompleteUploadPayload } from "../types/upload.types";

// Finalize the S3 multipart upload once every part has an ETag.
export async function completeUpload(payload: CompleteUploadPayload) {
  const { data } = await axiosInstance.post(VIDEO_ENDPOINTS.COMPLETEUPLOAD, payload);
  return data.data;
}
