/**
 * Audio Details Screen
 */

import React from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import AudioStoryPlayer from "@/components/AudioStoryPlayer";

import {
  DUMMY_AUDIO_STORIES,
} from "@/constants/audio_data";

const AudioDetails = () => {
  const { id } =
    useLocalSearchParams<{
      id?: string | string[];
    }>();

  const audioId =
    Array.isArray(id) ? id[0] : id;

  const story =
    DUMMY_AUDIO_STORIES.find(
      (item) => item.id === audioId
    );

  if (!story) {
    return (
      <SafeAreaView className="flex-1 bg-[#4f35d7]">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-2xl font-bold text-white">
            Audio Story Not Found
          </Text>

          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-6 rounded-full bg-white px-6 py-3"
          >
            <Text className="font-bold text-[#4f35d7]">
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#4f35d7]">
      <AudioStoryPlayer
        story={story}
      />
    </SafeAreaView>
  );
};

export default AudioDetails;
