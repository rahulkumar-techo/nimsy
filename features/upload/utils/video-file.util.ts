/**
 * Read a local video file and convert it into an ArrayBuffer.
 *
 * Why?
 * - Upload APIs (multipart uploads, hashing, chunking) often require
 *   raw binary data instead of a file URI.
 *
 * Example:
 * const buffer = await getVideoBuffer(videoUri);
 * console.log(buffer.byteLength); // File size in bytes
 *
 * Input:
 * - uri: Local file URI returned by Expo ImagePicker/FileSystem.
 *
 * Returns:
 * - ArrayBuffer containing the video's binary data.
 *
 * Throws:
 * - Error if the file is empty or cannot be read.
 */
export const getVideoBuffer = async (
  uri: string,
): Promise<ArrayBuffer> => {
  const response = await fetch(uri);

  const buffer =
    await response.arrayBuffer();

  if (!buffer.byteLength) {
    throw new Error(
      "Invalid video file"
    );
  }

  return buffer;
};