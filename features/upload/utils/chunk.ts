/**
 * Chunk Utilities — Streaming Edition
 *
 * DEPRECATED FUNCTIONS REMOVED:
 * • createChunkFile() — No longer needed. We stream directly from source.
 * • deleteChunkFile() — No longer needed. No temp files to clean up.
 * • prepareChunkDirectory() — No longer needed. No chunk directory.
 *
 * WHAT REMAINS:
 * • getUploadCacheDir() — For other upload-related temp files (e.g., compressed previews)
 * • validateFileExists() — Pre-upload validation
 * • getFileSize() — For progress calculations
 *
 * WHY NO CHUNK FILES?
 * ───────────────────
 * The previous approach created N temporary chunk files on disk:
 *   source.mp4 (1GB) → part-1.tmp (5MB) + part-2.tmp (5MB) + ... + part-N.tmp
 * This doubled storage usage during upload and caused cleanup bugs.
 *
 * The streaming approach reads byte ranges directly from the source file
 * using native file descriptors. Zero temp files, zero cleanup, zero bloat.
 */

import ReactNativeBlobUtil from "react-native-blob-util";
import * as FileSystem from "expo-file-system";

/**
 * Returns the app's cache directory for upload-related files.
 * NOTE: This is NOT for chunk files (we don't create those anymore).
 * Use this for: compressed thumbnails, preview images, retry logs, etc.
 */
export function getUploadCacheDir(): string {
  return `${FileSystem.Paths.cache.uri}/upload-cache/`;
}

/**
 * Validates that a source file exists and is readable before starting upload.
 * Throws if the file is missing or inaccessible.
 */
export async function validateFileExists(fileUri: string): Promise<void> {
  const cleanPath = fileUri.replace(/^file:\/\//, "");
  const exists = await ReactNativeBlobUtil.fs.exists(cleanPath);
  if (!exists) {
    throw new Error(`Source file not found: ${fileUri}`);
  }
}

/**
 * Gets the size of a file in bytes.
 * Used to verify file integrity and calculate progress.
 */
export async function getFileSize(fileUri: string): Promise<number> {
  const cleanPath = fileUri.replace(/^file:\/\//, "");
  const stats = await ReactNativeBlobUtil.fs.stat(cleanPath);
  return stats.size;
}

/**
 * (Optional) Creates a directory for upload cache if needed.
 * Safe to call multiple times.
 */
export async function prepareUploadCache(): Promise<void> {
  const dir = getUploadCacheDir().replace(/^file:\/\//, "");
  try {
    await ReactNativeBlobUtil.fs.mkdir(dir);
  } catch (error: any) {
    const msg = error?.message?.toLowerCase?.() ?? "";
    if (msg.includes("already exists") || msg.includes("eexist")) {
      return; // Expected, ignore
    }
    throw error;
  }
}