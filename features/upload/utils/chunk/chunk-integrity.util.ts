import ReactNativeBlobUtil from "react-native-blob-util";

export class ChunkIntegrity {
  static async validate(
    chunkPath: string,
    expectedSize: number
  ): Promise<boolean> {
    const cleanPath = chunkPath.replace(/^file:\/\//, "");

    const exists =await ReactNativeBlobUtil.fs.exists(cleanPath);

    if (!exists) {
      return false;
    }

    const stat =await ReactNativeBlobUtil.fs.stat(cleanPath);

    return Number(stat.size) === expectedSize;
  }
}