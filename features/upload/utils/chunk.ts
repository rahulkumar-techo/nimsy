/**
 * Chunk Utilities
 * Native file slicing for memory-efficient chunk creation.
 * Never loads entire video into memory.
 */

import ReactNativeBlobUtil from "react-native-blob-util";
import * as FileSystem from "expo-file-system";

/**
 * Gets the cache directory URI for chunk storage.
 */
function getCacheDir(): string {
  const cacheDir = FileSystem.Paths.cache;
  return `${cacheDir.uri}/upload-chunks/`;
}

/**
 * Ensures the chunk directory exists.
 */
async function ensureChunkDir(dir: string): Promise<void> {
  const exists = await ReactNativeBlobUtil.fs.exists(dir);
  if (!exists) {
    console.log(`[ChunkUtil] Directory missing. Creating chunk vault path: ${dir}`);
    await ReactNativeBlobUtil.fs.mkdir(dir);
  }
}

/**
 * Creates a chunk file on disk using native file slicing.
 * Returns the path to the temporary chunk file.
 */
export async function createChunkFile(
  sourceUri: string,
  partNumber: number,
  startByte: number,
  endByte: number,
): Promise<string> {
  console.log(`[ChunkUtil] Raw source file target incoming: "${sourceUri}"`);
  
  // Strip duplicate or loose file:// patterns to get an absolute filesystem path
  const cleanSrc = sourceUri.replace(/^file:\/\//, "");
  const cacheDir = getCacheDir().replace(/^file:\/\//, ""); // Ensure path doesn't get double prefixes
  const tempPath = `${cacheDir}part-${partNumber}.tmp`;

  console.log(`[ChunkUtil] Slicing Config -> Part #${partNumber} | Range: [${startByte} - ${endByte}] bytes.`);
  console.log(`[ChunkUtil] Paths Context -> Source: "${cleanSrc}" | Destination: "${tempPath}"`);

  await ensureChunkDir(cacheDir);
  
  try {
    await ReactNativeBlobUtil.fs.slice(cleanSrc, tempPath, startByte, endByte);
    
    // Explicitly verify file allocation and size on disk
    const stats = await ReactNativeBlobUtil.fs.stat(tempPath);
    console.log(`[ChunkUtil] Native Slice Success -> Part #${partNumber} created safely. Verified Size: ${stats.size} bytes.`);
  } catch (error) {
    console.error(`[ChunkUtil] Slicing Failed targeting Part #${partNumber}:`, error);
    throw error;
  }

  return `file://${tempPath}`;
}

/**
 * Deletes a temporary chunk file from disk.
 */
export async function deleteChunkFile(filePath: string): Promise<void> {
  const cleanPath = filePath.replace(/^file:\/\//, "");
  console.log(`[ChunkUtil] Erase command issued for tracking path: "${cleanPath}"`);
  
  try {
    const exists = await ReactNativeBlobUtil.fs.exists(cleanPath);
    if (exists) {
      await ReactNativeBlobUtil.fs.unlink(cleanPath);
      console.log(`[ChunkUtil] Garbage Collection: Successfully deleted temporary artifact "${cleanPath}".`);
    } else {
      console.warn(`[ChunkUtil] Eraser skipped: Target file did not exist on disk: "${cleanPath}"`);
    }
  } catch (error) {
    console.error(`[ChunkUtil] Failed to unlink file "${cleanPath}":`, error);
  }
}