/**
 * useVideoUpload hook
 */

import * as DocumentPicker from "expo-document-picker";
import { useState, useCallback } from "react";

export type VideoAsset = DocumentPicker.DocumentPickerAsset;

export function useVideoUpload() {
  const [video, setVideo] = useState<VideoAsset | null>(null);

  const pickVideo = useCallback(async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "video/*",
      copyToCacheDirectory: true,
    });
    if (!result.canceled) {
      setVideo(result.assets[0]);
    }
  }, []);

  const clearVideo = useCallback(() => setVideo(null), []);

  return { video, pickVideo, clearVideo };
}