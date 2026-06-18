/**
 * Upload-related TypeScript types.
 *
 * These types are shared across the upload flow,
 * including video selection, upload progress,
 * chapter management, and visibility settings.
 */

export interface SelectedVideo {
  /**
   * Local device file URI.
   * Example: file:///storage/emulated/0/video.mp4
   */
  uri: string;

  /**
   * Original video filename.
   * Example: my-video.mp4
   */
  name: string;

  /**
   * File size in bytes.
   * Example: 104857600 (100 MB)
   */
  size?: number;

  /**
   * Video MIME type.
   * Example: video/mp4
   */
  mimeType?: string;
}

export interface UploadProgress {
  /**
   * Upload completion percentage.
   * Range: 0 - 100
   */
  progress: number;

  /**
   * Current upload status message.
   * Example: "Uploading chunks..."
   */
  message: string;
}

export interface Chapter {
  /**
   * Unique chapter identifier.
   */
  id: string;

  /**
   * Chapter timestamp.
   * Format: HH:MM:SS
   * Example: 00:05:30
   */
  time: string;

  /**
   * Chapter title shown to users.
   * Example: "Introduction"
   */
  title: string;
}

/**
 * Video visibility options.
 *
 * public   -> Visible to everyone
 * private  -> Visible only to owner
 * unlisted -> Accessible via direct link
 * scheduled -> Published at a future date
 */
export type VisibilityOption =
  | "public"
  | "private"
  | "unlisted"
  | "scheduled";