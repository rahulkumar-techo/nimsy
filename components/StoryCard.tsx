import { Image } from "expo-image";
import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type { Story } from "@/constants/story";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { openStoryVideo } from "@/utils/videoNavigation";

const CATEGORY_STYLES: Record<
  string,
  {
    avatarBg: string;
    iconColor: string;
    icon: keyof typeof Ionicons.glyphMap;
  }
> = {
  "animal-stories": {
    avatarBg: "bg-emerald-100",
    iconColor: "#059669",
    icon: "paw-outline",
  },
  "moral-stories": {
    avatarBg: "bg-amber-100",
    iconColor: "#d97706",
    icon: "heart-outline",
  },
  "bedtime-stories": {
    avatarBg: "bg-indigo-100",
    iconColor: "#4f46e5",
    icon: "moon-outline",
  },
  "adventure-stories": {
    avatarBg: "bg-orange-100",
    iconColor: "#ea580c",
    icon: "compass-outline",
  },
};

const StoryCard = ({ item }: { item: Story }) => {
  const { colors } = useTheme();
  const categoryStyle = CATEGORY_STYLES[item.categoryId] || {
    avatarBg: "bg-slate-100",
    iconColor: "#475569",
    icon: "book-outline" as const,
  };

  const handlePress = () => {
    if (!item.id) {
      return;
    }

    openStoryVideo(item);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      className="mb-6"
      style={{ backgroundColor: colors.background }}
      onPress={handlePress}
    >
      <View
        className="relative overflow-hidden rounded-2xl"
        style={{ aspectRatio: 16 / 9, backgroundColor: colors.card }}
      >
        <Image
          source={{ uri: item.thumbnail }}
          contentFit="cover"
          transition={120}
          cachePolicy="memory-disk"
          className="h-full w-full"
        />

        {item.featured && (
          <View
            className="absolute left-3 top-3 rounded-full px-3 py-1"
            style={{ backgroundColor: colors.card }}
          >
            <Text
              className="text-[11px] font-semibold uppercase tracking-wide"
              style={{ color: colors.text }}
            >
              Featured
            </Text>
          </View>
        )}

        <View className="absolute bottom-3 right-3 rounded-md bg-black/90 px-2 py-[3px]">
          <Text className="text-[11px] font-semibold text-white">
            {item.duration}
          </Text>
        </View>
      </View>

      <View className="mt-3 flex-row px-1">
        <View
          className={`h-11 w-11 items-center justify-center rounded-full ${categoryStyle.avatarBg}`}
        >
          <Ionicons
            name={categoryStyle.icon}
            size={20}
            color={categoryStyle.iconColor}
          />
        </View>

        <View className="ml-3 flex-1">
          <Text
            numberOfLines={2}
            className="text-[16px] font-bold leading-6"
            style={{ color: colors.text }}
          >
            {item.title}
          </Text>

          <View className="mt-1 flex-row items-center">
            <Text
              className="text-[13px] font-medium"
              style={{ color: colors.secondaryText }}
            >
              {item.author}
            </Text>
            <View
              className="mx-2 h-1 w-1 rounded-full"
              style={{ backgroundColor: colors.border }}
            />
            <Text
              className="text-[13px] font-medium"
              style={{ color: colors.secondaryText }}
            >
              {item.categoryTitle}
            </Text>
          </View>

          <Text
            numberOfLines={2}
            className="mt-2 text-[13px] leading-5"
            style={{ color: colors.secondaryText }}
          >
            {item.story.intro}
          </Text>

          <View className="mt-3 flex-row flex-wrap items-center">
            <View
              className="mb-2 mr-2 rounded-full px-3 py-1"
              style={{ backgroundColor: colors.card }}
            >
              <Text
                className="text-[11px] font-medium"
                style={{ color: colors.secondaryText }}
              >
                Age {item.ageGroup}
              </Text>
            </View>
            <View
              className="mb-2 mr-2 rounded-full px-3 py-1"
              style={{ backgroundColor: colors.card }}
            >
              <Text
                className="text-[11px] font-medium"
                style={{ color: colors.secondaryText }}
              >
                {item.language}
              </Text>
            </View>
            {item.tags.slice(0, 1).map((tag) => (
              <View
                key={tag}
                className="mb-2 mr-2 rounded-full bg-orange-50 px-3 py-1"
              >
                <Text className="text-[11px] font-medium text-orange-600">
                  #{tag}
                </Text>
              </View>
            ))}
          </View>

          <Text
            className="mt-[2px] text-[12px]"
            style={{ color: colors.secondaryText }}
          >
            {item.views.toLocaleString()} plays • {item.likes.toLocaleString()} likes
          </Text>
        </View>

        <TouchableOpacity className="pl-2 pt-1" onPress={handlePress}>
          <Ionicons
            name="play-circle-outline"
            size={18}
            color={colors.secondaryText}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default StoryCard;
