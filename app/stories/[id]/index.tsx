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

const StoryDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();

  const storyId = Array.isArray(id) ? id[0] : id;

  const story = getStoryById(storyId);

  if (!story) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-black">
        <Text className="text-white text-lg font-bold">
          Story Not Found
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar
        barStyle="light-content"
        backgroundColor="#000"
      />

      {/* VIDEO PLAYER */}
      <VideoPlayer videoUrl={story.videoUrl} />

      {/* DETAILS */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 pt-5 pb-24">
          <Text className="text-2xl font-black text-slate-900">
            {story.title}
          </Text>

          <Text className="mt-3 text-sm leading-7 text-slate-600">
            {story.story.intro}
          </Text>
        </View>
      </ScrollView>

      {/* settings removed — returning to previous state with no settings UI */}
    </SafeAreaView>
  );
};

export default StoryDetailsScreen;
