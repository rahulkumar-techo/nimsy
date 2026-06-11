/**
 * VideoPreview — native player with expo-video
 */

import React, { useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  uri: string;
  name: string;
  size?: number;
  onReplace?: () => void;
};

function fmt(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function VideoPreview({ uri, name, size, onReplace }: Props) {
  const { colors } = useTheme();
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.muted = false;
  });

  const displayDuration = useMemo(() => player.duration ?? 0, [player.duration]);

  return (
    <View
      className="rounded-xl overflow-hidden mb-4"
      style={{
        backgroundColor: colors.surface,
      }}
    >
      <View style={{ width: "100%", aspectRatio: 16 / 9 }}>
        <VideoView
          player={player}
          nativeControls
          fullscreenOptions={{ enable: true }}
          allowsPictureInPicture
          style={{ width: "100%", height: "100%" }}
        />
      </View>
      <View
        className="p-3 flex-row items-center border-t"
        style={{
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        }}
      >
        <View className="flex-1">
          <Text numberOfLines={1} className="font-semibold text-sm" style={{ color: colors.text }}>
            {name} s
          </Text>
          <Text className="text-xs mt-0.5" style={{ color: colors.secondaryText }}>
            {size ? `${(size / 1024 / 1024).toFixed(1)} MB` : ""}
            {displayDuration > 0 ? `  ·  ${fmt(displayDuration)}` : ""}
          </Text>
        </View>
        {onReplace && (
          <TouchableOpacity onPress={onReplace} className="flex-row items-center gap-x-1 pl-3" activeOpacity={0.7}>
            <Ionicons name="swap-horizontal-outline" size={16} color={colors.accent} />
            <Text className="text-sm font-semibold" style={{ color: colors.accent }}>Replace</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}