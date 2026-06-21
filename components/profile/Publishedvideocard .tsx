/**
 * PublishedVideoCard
 * Horizontal card for a published/live video with thumbnail, duration badge,
 * channel/views/date meta, and a three-dot action menu.
 *
 * Location: src/components/profile/PublishedVideoCard.tsx
 */

import React, { useState } from "react";

import { View, Text, Image, Pressable } from "react-native";

import { EllipsisVertical } from "lucide-react-native";

import VideoActionsSheet from "./VideoActionsSheet";

interface PublishedVideoCardProps {
  title: string;
  thumbnail: string;
  duration: string;

  channelName?: string;
  views: string;
  uploadDate: string;

  primaryTextColor?: string;
  secondaryTextColor?: string;
  rippleColor?: string;

  onPress?: () => void;

  onEdit?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
}

export default function PublishedVideoCard({
  title,
  thumbnail,
  duration,

  channelName = "Rahul Tech",
  views,
  uploadDate,

  primaryTextColor = "#18181b",
  secondaryTextColor = "#71717a",
  rippleColor = "#e4e4e7",

  onPress,

  onEdit,
  onDownload,
  onShare,
  onDelete,
}: PublishedVideoCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <Pressable
        className="flex-row px-4 py-3"
        android_ripple={{ color: rippleColor }}
        onPress={onPress}
      >
        {/* Thumbnail */}
        <View className="relative h-24 w-40 overflow-hidden rounded-xl bg-zinc-200 dark:bg-zinc-800">
          <Image
            source={{ uri: thumbnail }}
            className="h-full w-full"
            resizeMode="cover"
          />

          <View className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5">
            <Text className="text-[10px] text-white">{duration}</Text>
          </View>
        </View>

        {/* Content */}
        <View className="ml-3 flex-1">
          <View className="flex-row items-start">
            <View className="flex-1">
              <Text
                numberOfLines={2}
                className="text-sm font-semibold"
                style={{ color: primaryTextColor }}
              >
                {title}
              </Text>

              <Text
                className="mt-1 text-xs"
                style={{ color: secondaryTextColor }}
              >
                {channelName}
              </Text>

              <Text
                className="mt-1 text-xs"
                style={{ color: secondaryTextColor }}
              >
                {views} • {uploadDate}
              </Text>
            </View>

            <Pressable
              hitSlop={12}
              style={{ zIndex: 10, elevation: 10 }}
              className="ml-2 items-center justify-center rounded-full p-2"
              onPress={() => setShowMenu(true)}
            >
              <EllipsisVertical size={18} color={secondaryTextColor} />
            </Pressable>
          </View>
        </View>
      </Pressable>

      {/* Action Sheet (Edit / Save to Device / Share / Delete) */}
      <VideoActionsSheet
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        onEdit={onEdit}
        onDownload={onDownload}
        onShare={onShare}
        onDelete={onDelete}
      />
    </>
  );
}