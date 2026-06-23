// Bridge contract for the native file-chunking module.
//
// This MUST be backed by a real native module (Swift/Kotlin, or a
// Turbomodule) — it is the one piece of this feature that cannot be done in
// JS without violating "never load video into JS memory" / "never use
// ArrayBuffer/Base64 for video". The native side opens the source file with
// a native file stream, writes each [start, start+chunkSize) byte range
// straight to its own chunk file on disk, and returns only paths + sizes.
// No video bytes ever cross the JS bridge.
//
// iOS reference: FileHandle.seek(toOffset:) + read(upToCount:), written out
//   via OutputStream.
// Android reference: RandomAccessFile / FileChannel, written out via
//   FileOutputStream.
//
// If you can't ship a custom native module yet, react-native-background-upload
// itself can sometimes be pointed at the whole file with `type: "raw"` for a
// *single* PUT (no multipart) — but that drops S3 multipart, which the
// product requirements say to keep. Treat this module as required.

import { NativeModules } from "react-native";

export interface NativeChunkResult {
  partNumber: number;
  path: string;
  size: number;
}

interface NativeFileChunkerModule {
  splitFile(sourcePath: string, chunkSize: number, totalChunks: number, destDir: string): Promise<NativeChunkResult[]>;
  removeFile(path: string): Promise<void>;
}

const { FileChunker } = NativeModules as { FileChunker?: NativeFileChunkerModule };

if (!FileChunker) {
  console.warn(
    "[upload] Native module 'FileChunker' is not linked. Implement it natively before " +
      "shipping — see the comment at the top of native-file-chunker.ts.",
  );
}

export const nativeFileChunker = {
  async splitFile(
    sourcePath: string,
    chunkSize: number,
    totalChunks: number,
    destDir: string,
  ): Promise<NativeChunkResult[]> {
    if (!FileChunker) {
      throw new Error("FileChunker native module is not available on this platform.");
    }
    return FileChunker.splitFile(sourcePath, chunkSize, totalChunks, destDir);
  },
};
