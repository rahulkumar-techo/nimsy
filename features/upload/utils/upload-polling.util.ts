import { videoService } from "@/services/video/video.service";

/**
 * Start polling the server for video upload processing status.
 *
 * Why?
 * - After the upload finishes, the server may still be processing
 *   the video (transcoding, thumbnail generation, metadata extraction).
 * - This function periodically checks the latest processing status
 *   until the video is completed.
 *
 * Example:
 * const interval = startUploadPolling(
 *   videoId,
 *   (status) => {
 *     console.log(status.progress);
 *   }
 * );
 *
 * ! // Stop manually if needed
 * clearInterval(interval);
 *
 * Input:
 * - videoId: ID of the uploaded video.
 * - onStatus: Callback executed whenever a new status is received.
 *
 * Returns:
 * - Interval ID that can be used to stop polling manually.
 *
 * Auto Stops:
 * - When processing is completed.
 * - When a polling request fails.
 */
export const startUploadPolling = (
  videoId: string,
  onStatus: (status: any) => void,
) => {
  const interval = setInterval(
    async () => {
      try {
        const status =
          await videoService.getUploadStatus(
            videoId,
          );

        onStatus(status);

        if (status.isCompleted) {
          clearInterval(interval);
        }
      } catch {
        clearInterval(interval);
      }
    },
    3000,
  );

  return interval;
};