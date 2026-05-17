import React from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";

import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import VideoPlayer from "@/components/video/VideoPlayer";
import { getStoryById } from "@/constants/story";
import { useTheme } from "@/context/ThemeContext";

const StoryDetailsScreen = () => {
  const { colors, theme } = useTheme();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();

  const storyId = Array.isArray(id) ? id[0] : id;

  const story = getStoryById(storyId);

  if (!story) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <Text
          className="text-lg font-bold"
          style={{ color: colors.text }}
        >
          Story Not Found
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
        backgroundColor={colors.background}
      />

      {/* VIDEO PLAYER */}
      <VideoPlayer videoUrl={story.videoUrl} />

      {/* DETAILS */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 pt-5 pb-24">
          <Text
            className="text-2xl font-black"
            style={{ color: colors.text }}
          >
            {story.title}
          </Text>

          <Text
            className="mt-3 text-sm leading-7"
            style={{ color: colors.secondaryText }}
          >
            {story.story.intro}
          </Text>
        </View>
      </ScrollView>

      {/* settings removed — returning to previous state with no settings UI */}
    </SafeAreaView>
  );
};

export default StoryDetailsScreen;
