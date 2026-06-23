// Tracks on-disk temp chunk files so they can be cleaned up after a part
// uploads successfully, or after the whole session completes/aborts. This
// store only ever holds file *paths* — chunk files are produced and consumed
// natively, their contents never pass through JS.

import { Paths, Directory, File } from 'expo-file-system';

const CHUNK_DIR = new Directory(Paths.cache, 'upload-chunks');

export const uploadCacheStore = {
  dirFor(videoId: string): string {
    return new Directory(CHUNK_DIR, videoId).uri;
  },

  async ensureDir(videoId: string): Promise<string> {
    const dir = new Directory(CHUNK_DIR, videoId);
    if (!dir.exists) {
      dir.create({ idempotent: true });
    }
    return dir.uri;
  },

  pathForPart(videoId: string, partNumber: number): string {
    return new File(CHUNK_DIR, videoId, `part-${partNumber}.chunk`).uri;
  },

  async removePart(videoId: string, partNumber: number): Promise<void> {
    const file = new File(CHUNK_DIR, videoId, `part-${partNumber}.chunk`);
    try {
      if (file.exists) file.delete();
    } catch (err) {
      console.warn(`Failed to remove chunk file for part ${partNumber}:`, err);
    }
  },

  async clearSession(videoId: string): Promise<void> {
    const dir = new Directory(CHUNK_DIR, videoId);
    try {
      if (dir.exists) dir.delete();
    } catch (err) {
      console.warn(`Failed to clear chunk cache for ${videoId}:`, err);
    }
  },
};
