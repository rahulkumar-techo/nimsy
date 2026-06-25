/**
 * Hook for picking images using expo-image-picker.
 * Redux-friendly: does not manage image state.
 */

import { useCallback, useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

export interface PickedImage {
  uri: string;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
  width: number;
  height: number;
}

interface UseImagePickerOptions {
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
  allowsMultipleSelection?: boolean;
}

export function useImagePicker(
  options: UseImagePickerOptions = {}
) {
  const [loading, setLoading] = useState(false);

  const {
    allowsEditing = false,
    aspect = [16, 9],
    quality = 0.8,
  } = options;

  /**
   * Request gallery permission.
   */
  const requestPermission = useCallback(async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library."
      );

      return false;
    }

    return true;
  }, []);

  /**
   * Open gallery and return selected image.
   */
  const pickImage = useCallback(async (): Promise<PickedImage | null> => {
    try {
      setLoading(true);

      const hasPermission = await requestPermission();

      if (!hasPermission) {
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing,
        aspect,
        quality,
      });

      if (result.canceled) {
        return null;
      }

      const asset = result.assets[0];

      return {
        uri: asset.uri,
        fileName: asset.fileName ?? undefined,
        mimeType: asset.mimeType,
        fileSize: asset.fileSize,
        width: asset.width,
        height: asset.height,
      };
    } catch (error) {
      console.error("Image picker error:", error);

      Alert.alert(
        "Error",
        "Failed to pick image. Please try again."
      );

      return null;
    } finally {
      setLoading(false);
    }
  }, [
    requestPermission,
    allowsEditing,
    aspect,
    quality,
  ]);

  return {
    loading,
    pickImage,
  };
}