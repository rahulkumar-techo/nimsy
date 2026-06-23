import axiosInstance from "@/lib/api";

// Abort an in-progress multipart upload (user cancellation, unrecoverable
// failure, etc). This is a new endpoint relative to the original code —
// add it to VIDEO_ENDPOINTS if you keep a centralized endpoint map, e.g.
//
//   ABORTUPLOAD: (videoId: string) => `/videos/${videoId}/upload/abort`
export async function abortUpload(videoId: string, uploadId: string): Promise<void> {
  await axiosInstance.post(`/videos/${videoId}/upload/abort`, { uploadId });
}
