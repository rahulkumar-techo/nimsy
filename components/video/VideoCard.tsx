import React from "react";
import {
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { EllipsisVertical } from "lucide-react-native";

import { useTheme } from "@/context/ThemeContext";

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  views: string;
  uploadedAt: string;
  duration: string;
}

interface Props {
  video: Video;
  onPress?: () => void;
  onMenuPress?: () => void;
}

export default function VideoCard({
  video,
  onPress,
  onMenuPress,
}: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      className="mb-4 flex-row"
    >
      {/* Thumbnail */}
      <View className="relative">
        <Image
          source={{ uri: video.thumbnail }}
          className="h-24 w-40 rounded-xl"
          resizeMode="cover"
        />

        <View
          className="absolute bottom-1 right-1 rounded px-1.5 py-0.5"
          style={{
            backgroundColor: "rgba(0,0,0,0.8)",
          }}
        >
          <Text className="text-[10px] font-medium text-white">
            {video.duration}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="ml-3 flex-1">
        <View className="flex-row">
          <View className="flex-1">
            <Text
              numberOfLines={2}
              className="text-base font-semibold"
              style={{
                color: colors.primaryText,
              }}
            >
              {video.title}
            </Text>

            <Text
              numberOfLines={1}
              className="mt-1 text-sm"
              style={{
                color: colors.secondaryText,
              }}
            >
              {video.channelName}
            </Text>

            <Text
              className="text-xs"
              style={{
                color: colors.secondaryText,
              }}
            >
              {video.views} • {video.uploadedAt}
            </Text>
          </View>

          <Pressable
            onPress={onMenuPress}
            className="ml-2 p-1"
            hitSlop={8}
          >
            <EllipsisVertical
              size={18}
              color={colors.primaryText}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}