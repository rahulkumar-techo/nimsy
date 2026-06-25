/**
 * Chunk Utilities
 * Native file slicing for memory-efficient chunk creation.
 * Never loads entire video into memory.
 */

import ReactNativeBlobUtil from "react-native-blob-util";
import * as FileSystem from "expo-file-system";

/**
 * Returns the upload chunk cache directory.
 */
function getCacheDir(): string {
  return `${FileSystem.Paths.cache.uri}/upload-chunks/`;
}

/**
 * Creates the chunk directory if it doesn't exist.
 * Safe to call multiple times (and from multiple concurrent callers).
 */
export async function prepareChunkDirectory(): Promise<void> {
  const dir = getCacheDir().replace(/^file:\/\//, "");

  try {
    await ReactNativeBlobUtil.fs.mkdir(dir);
    console.log(
      `[ChunkUtil] Created chunk directory: ${dir}`
    );
  } catch (error: any) {
    // Ignore "already exists" errors. Different platforms/versions of
    // react-native-blob-util phrase this differently (e.g. "already
    // exists" on Android, "EEXIST" in some error codes), so check both.
    const message =
      typeof error?.message === "string"
        ? error.message.toLowerCase()
        : "";

    if (
      message.includes("already exists") ||
      message.includes("eexist")
    ) {
      console.log(
        `[ChunkUtil] Chunk directory already exists: ${dir}`
      );
      return;
    }

    console.error(
      `[ChunkUtil] Failed creating chunk directory:`,
      error
    );

    throw error;
  }
}

/**
 * Creates a chunk file on disk using native slicing.
 * Returns the temporary chunk file URI.
 */
export async function createChunkFile(
  sourceUri: string,
  uploadId: string,
  partNumber: number,
  startByte: number,
  endByte: number
): Promise<string> {
  console.log(
    `[ChunkUtil] Raw source file target incoming: "${sourceUri}"`
  );

  // Defensive: guarantee the destination directory exists right before we
  // write into it. We cannot assume an external prepareChunkDirectory()
  // call has already resolved by the time this runs — concurrent workers
  // can call createChunkFile() before that setup step finishes, which is
  // exactly what produced the ENOENT failures (all 3 workers failed on
  // their first attempt because the directory simply wasn't there yet).
  // This call is idempotent and cheap, so doing it per-chunk is safe.
  await prepareChunkDirectory();

  const cleanSrc = sourceUri.replace(/^file:\/\//, "");
  const cacheDir = getCacheDir().replace(/^file:\/\//, "");

  // Unique filename prevents collisions between uploads
  const tempPath =
    `${cacheDir}${uploadId}-part-${partNumber}.tmp`;

  console.log(
    `[ChunkUtil] Slicing Config -> Part #${partNumber} | Range: [${startByte} - ${endByte}] bytes.`
  );

  console.log(
    `[ChunkUtil] Paths Context -> Source: "${cleanSrc}" | Destination: "${tempPath}"`
  );

  try {
    await ReactNativeBlobUtil.fs.slice(
      cleanSrc,
      tempPath,
      startByte,
      endByte
    );

    const stats =
      await ReactNativeBlobUtil.fs.stat(tempPath);

    console.log(
      `[ChunkUtil] Native Slice Success -> Part #${partNumber} created safely. Verified Size: ${stats.size} bytes.`
    );
  } catch (error) {
    console.error(
      `[ChunkUtil] Slicing Failed targeting Part #${partNumber}:`,
      error
    );

    throw error;
  }

  return `file://${tempPath}`;
}

/**
 * Deletes a temporary chunk file.
 */
export async function deleteChunkFile(
  filePath: string
): Promise<void> {
  const cleanPath = filePath.replace(/^file:\/\//, "");

  console.log(
    `[ChunkUtil] Erase command issued for tracking path: "${cleanPath}"`
  );

  try {
    const exists =
      await ReactNativeBlobUtil.fs.exists(cleanPath);

    if (!exists) {
      console.warn(
        `[ChunkUtil] Eraser skipped. File not found: ${cleanPath}`
      );

      return;
    }

    await ReactNativeBlobUtil.fs.unlink(cleanPath);

    console.log(
      `[ChunkUtil] Garbage Collection: Successfully deleted temporary artifact "${cleanPath}".`
    );
  } catch (error) {
    console.error(
      `[ChunkUtil] Failed to unlink file "${cleanPath}":`,
      error
    );
  }
}