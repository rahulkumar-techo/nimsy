/**
 * ProfileHorizontalCard
 * Upload + Published video card with built-in action sheet.
 *
 * Location: src/components/profile/ProfileHorizontalCard.tsx
 */

// import React, { useState } from "react";

import {
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";

import { X } from "lucide-react-native";

// import VideoActionsSheet from "./VideoActionsSheet";
import { useTheme } from "@/context/ThemeContext";

export type UploadStage =
  | "PREPARING"
  | "UPLOADING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

interface ProfileHorizontalCardProps {
  thumbnail?: string;

  title: string;

  stage: UploadStage;

  progress?: number;

  uploadedBytes?: number;
  totalBytes?: number;

  views?: string;
  uploadDate?: string;

  error?: string;

  onCancel?: () => void;

}

export default function ProfileHorizontalCard({
  thumbnail,
  title,

  stage,

  progress = 0,

  uploadedBytes = 0,
  totalBytes = 0,

  views = "0 views",
  uploadDate = "Just now",

  // error,

  onCancel,
}: ProfileHorizontalCardProps) {
  // const [showMenu, setShowMenu] = useState(false);

  const { colors } = useTheme()

  const isUploading =
    stage === "PREPARING" ||
    stage === "UPLOADING" ||
    stage === "PROCESSING";

  // const status =
  //   stage === "PREPARING"
  //     ? "Preparing upload"
  //     : stage === "UPLOADING"
  //       ? `${Math.round(progress)}% uploaded`
  //       : stage === "PROCESSING"
  //         ? "Processing video"
  //         : stage === "FAILED"
  //           ? error || "Upload failed"
  //           : "";

  return (
    <>
      <View className="flex-row px-4 py-3 relative">
        {/* canle while uploading and processing  */}
        {isUploading && (
          <Pressable
            onPress={onCancel}
            className="absolute bottom-0 right-4 flex-row items-center rounded-full bg-black/40 px-2 py-1"
          >
            <View className="h-2 w-2 rounded-full " style={{ backgroundColor: colors.primary }} />

            <Text className="mx-1 text-[10px] font-medium " style={{ color: colors.primary }}>
              Cancel
            </Text>

            <X size={14} color="#fff" strokeWidth={3} />
          </Pressable>
        )}

        {/* Thumbnail */}
        <View className="relative h-24 w-40 overflow-hidden rounded-xl bg-zinc-200 dark:bg-zinc-800">
          <Image
            source={{
              uri: thumbnail ?? "https://placehold.co/400x225",
            }}
            className="h-full w-full"
            resizeMode="cover"
          />

          {isUploading && (
            <View className="absolute inset-0 items-center justify-center bg-black/50">
              {stage === "UPLOADING" ? (
                <Text className="text-xl font-bold text-white">
                  {Math.round(progress)}%
                </Text>
              ) : (
                <ActivityIndicator size="large" color={colors.background} />
              )}
            </View>
          )}
        </View>

        {/* Content */}
        <View className="ml-3 flex-1">
          <View className="flex-row items-start">
            <Text
              numberOfLines={2}
              className="flex-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100"
            >
              {title}
            </Text>

          </View>

          {/* Upload State */}
          {stage !== "COMPLETED" && (
            <>
              <Text
                className={`mt-1 text-xs ${stage === "FAILED" ? "text-red-500" : "text-zinc-500"
                  }`}
              >
                {status}
              </Text>

              {stage === "UPLOADING" && (
                <>
                  <Text className="mt-1 text-xs text-zinc-500">
                    {formatBytes(uploadedBytes)} of {formatBytes(totalBytes)}
                  </Text>

                  <View className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200">
                    <View
                      className="h-full rounded-full"
                      style={{ width: `${progress}%`, backgroundColor: colors.primary }}
                    />
                  </View>
                </>
              )}


            </>
          )}

          {/* Published State */}
          {stage === "COMPLETED" && (
            <Text className="mt-1 text-xs text-zinc-500">
              {views} • {uploadDate}
            </Text>
          )}
        </View>
      </View>

    </>
  );
}

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024 * 1024) {
    return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}