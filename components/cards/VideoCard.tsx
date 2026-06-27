/**
 * Video Card
 * Optimized YouTube-style video card — backed by the real API video shape
 */

import React from "react";

import { router } from "expo-router";
import { EllipsisVertical } from "lucide-react-native";
import {
  Image,
  Pressable,
  Text,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { ApiVideo } from "@/features/home/types/video";
import { getMediaUrl } from "@/features/home/utils/media";
import { formatCount, formatRelativeTime } from "@/features/home/utils/format";


interface Props {
  item: ApiVideo;
}

function VideoCard({ item }: Props) {
  const { colors } = useTheme();

  // // const isProcessing = item.status === "PROCESSING";
  // const isFailed = item.status === "FAILED";

  const thumbnailUrl = getMediaUrl(item.thumbnailKey);
  const avatarUrl = item.uploadedBy.avatarUrl ? getMediaUrl(item.uploadedBy.avatarUrl) : null;
  const videoUrl = getMediaUrl(item.objectKey);

  console.log({thumbnailUrl})

  const handleRedirect = () => {
    if (!videoUrl) return;

    router.push({
      pathname: "/(player)/videoPlayer",
      params: {
        id: item.id,
        uri: videoUrl,
        title: item.title,
        thumbnail: thumbnailUrl,
        channelName: item.uploadedBy.name,
        views: String(item.viewsCount),
        uploadedAt: item.createdAt,
      },
    });
  };

  return (
    <Pressable
      onPress={handleRedirect}
      android_ripple={{ color: colors.border }}
      className="mb-4"
    >
      {/* Thumbnail */}
      <View className="relative">
        <Image
          source={{ uri: thumbnailUrl }}
          resizeMode="cover"
          className="w-full h-56"
          style={{ backgroundColor: colors.border }}
        />

        
      </View>

      {/* Metadata */}
      <View className="flex-row px-3 py-3">
        {/* Avatar */}
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} className="w-11 h-11 rounded-full" />
        ) : (
          <View
            className="w-11 h-11 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.border }}
          >
            <Text style={{ color: colors.text, fontWeight: "600" }}>
              {item.uploadedBy.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        {/* Content */}
        <View className="flex-1 ml-3">
          <Text
            numberOfLines={2}
            className="text-[15px] font-semibold leading-5"
            style={{ color: colors.text }}
          >
            {item.title}
          </Text>

          <View className="flex-row items-center mt-1 flex-wrap">
            <Text
              numberOfLines={1}
              className="text-sm"
              style={{ color: colors.secondaryText }}
            >
              {item.uploadedBy.name}
            </Text>
          </View>

          <Text className="text-xs mt-1" style={{ color: colors.secondaryText }}>
            {formatCount(item.viewsCount)} views • {formatRelativeTime(item.createdAt)}
          </Text>
        </View>

        {/* Menu */}
        <Pressable hitSlop={12} className="justify-start pt-1">
          <EllipsisVertical size={20} color={colors.secondaryText} />
        </Pressable>
      </View>
    </Pressable>
  );
}

export default VideoCard;
