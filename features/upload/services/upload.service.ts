/**
 * Execute the complete video upload workflow.
 *
 * Flow:
 * 1. Read the selected video file from local storage.
 * 2. Convert the file into an ArrayBuffer.
 * 3. Send the video and metadata to the upload service.
 * 4. Forward upload progress updates to the UI.
 *
 * Example:
 * await uploadVideoFlow({
 *   video,
 *   metadata,
 *   onProgress: (
 *     progress,
 *     status,
 *     message,
 *   ) => {
 *     console.log(progress);
 *   },
 * });
 *
 * Input:
 * - video: Selected video information.
 * - metadata: Video title, description, visibility, etc.
 * - onProgress: Callback for upload progress updates.
 *
 * Returns:
 * - Upload response from the video service.
 */
import { getVideoBuffer } from "../utils/video-file.util";
import { videoService } from "@/services/video/video.service";

export const uploadVideoFlow = async ({
  video,
  metadata,
  onProgress,
}: {
  video: any;
  metadata: any;
  onProgress: (
    progress: number,
    status: string,
    message: string,
  ) => void;
}) => {
  const fileBuffer = await getVideoBuffer(video.uri);

  return videoService.uploadVideo(
    fileBuffer,
    metadata,
    onProgress,
  );
};