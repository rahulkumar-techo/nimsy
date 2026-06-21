/**
 * Execute the complete video upload workflow.
 */
import { videoService } from "./video.service";
import { getVideoBuffer } from "../utils/video-file.util";

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
