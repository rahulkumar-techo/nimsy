import axiosInstance from "@/lib/api";
import { ServerUploadStatusResponse } from "../types/upload.types";

// Authoritative upload status from the backend. Used to reconcile local
// session state after an app restart, since the server is the source of
// truth for which parts actually landed in S3 (a part can complete on S3
// even if the app was killed before the local store learned about it).
export async function getUploadStatus(videoId: string): Promise<ServerUploadStatusResponse> {
  const { data } = await axiosInstance.get(`/videos/${videoId}/upload/status`);
  return data.data;
}
