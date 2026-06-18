/**
 * Video Card
 * Optimized YouTube-style video card
 */

import React, { useCallback } from "react";

import { router } from "expo-router";
import { CheckCircle2, EllipsisVertical } from "lucide-react-native";
import {
  Image,
  Pressable,
  Text,
  View,
} from "react-native";

import { Video } from "@/constants/videos";
import { useTheme } from "@/context/ThemeContext";

interface Props {
  item: Video;
}

function VideoCard({ item }: Props) {
  const { colors } = useTheme();

  const handleRedirect = () => {
    router.push({
      pathname: "/(player)/videoPlayer",
      params: {
        id: item.id,
        uri: item.uri,
        title: item.title,
        thumbnail: item.thumbnail,
        channelName: item.channelName,
        views: item.views,
        duration: item.duration,
        uploadedAt: item.uploadedAt,
        verified: String(item.verified),
      },
    });
  };

  return (
    <Pressable
      onPress={handleRedirect}
      android_ripple={{
        color: colors.border,
      }}
      className="mb-4"
    >
      {/* Thumbnail */}
      <View className="relative">
        <Image
          source={{ uri: item.thumbnail }}
          resizeMode="cover"
          className="w-full h-56"
        />

        {/* Duration */}
        <View
          className="absolute bottom-2 right-2 px-2 py-1 rounded-md"
          style={{
            backgroundColor: "rgba(0,0,0,0.85)",
          }}
        >
          <Text
            className="text-[11px] font-semibold"
            style={{
              color: "#fff",
            }}
          >
            {item.duration}
          </Text>
        </View>
      </View>

      {/* Metadata */}
      <View className="flex-row px-3 py-3">
        {/* Avatar */}
        <Image
          source={{ uri: item.channelAvatar }}
          className="w-11 h-11 rounded-full"
        />

        {/* Content */}
        <View className="flex-1 ml-3">
          <Text
            numberOfLines={2}
            className="text-[15px] font-semibold leading-5"
            style={{
              color: colors.text,
            }}
          >
            {item.title}
          </Text>

          <View className="flex-row items-center mt-1 flex-wrap">
            <Text
              numberOfLines={1}
              className="text-sm"
              style={{
                color: colors.secondaryText,
              }}
            >
              {item.channelName}
            </Text>

            {item.verified && (
              <View className="ml-1">
                <CheckCircle2
                  size={13}
                  color={colors.secondaryText}
                />
              </View>
            )}
          </View>

          <Text
            className="text-xs mt-1"
            style={{
              color: colors.secondaryText,
            }}
          >
            {item.views} views • {item.uploadedAt}
          </Text>
        </View>

        {/* Menu */}
        <Pressable
          hitSlop={12}
          className="justify-start pt-1"
        >
          <EllipsisVertical
            size={20}
            color={colors.secondaryText}
          />
        </Pressable>
      </View>
    </Pressable>
  );
}

export default VideoCard;