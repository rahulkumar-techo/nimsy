/**
 * Upload progress component.
 * Shows real-time upload progress to server/S3.
 */

import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

interface UploadProgressProps {
  progress: number; // 0 - 100
  uploadedBytes?: number;
  totalBytes?: number;
}

export default function UploadProgress({
  progress,
  uploadedBytes,
  totalBytes,
}: UploadProgressProps) {
  const formatBytes = (bytes?: number) => {
    if (!bytes) return "";

    const units = ["B", "KB", "MB", "GB"];
    let value = bytes;
    let index = 0;

    while (value >= 1024 && index < units.length - 1) {
      value /= 1024;
      index++;
    }

    return `${value.toFixed(1)} ${units[index]}`;
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-neutral-950 border-t border-neutral-800 px-4 py-3">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2">
          <ActivityIndicator size="small" color="#ff0000" />
          <Text className="text-white font-medium">
            Uploading video...
          </Text>
        </View>

        <Text className="text-white font-semibold">
          {Math.round(progress)}%
        </Text>
      </View>

      <View className="h-2 bg-neutral-800 rounded-full overflow-hidden">
        <View
          className="h-full bg-red-600 rounded-full"
          style={{
            width: `${Math.min(progress, 100)}%`,
          }}
        />
      </View>

      {uploadedBytes && totalBytes && (
        <View className="flex-row justify-between mt-2">
          <Text className="text-xs text-neutral-400">
            {formatBytes(uploadedBytes)}
          </Text>

          <Text className="text-xs text-neutral-400">
            {formatBytes(totalBytes)}
          </Text>
        </View>
      )}
    </View>
  );
}