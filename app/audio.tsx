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
import { useTheme } from "@/context/ThemeContext";

const AudioDetails = () => {
  const { colors } = useTheme();
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
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
      >
        <View className="flex-1 items-center justify-center px-6">
          <Text
            className="text-center text-2xl font-bold"
            style={{ color: colors.text }}
          >
            Audio Story Not Found
          </Text>

          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-6 rounded-full px-6 py-3"
            style={{ backgroundColor: colors.primary }}
          >
            <Text
              className="font-bold"
              style={{ color: colors.buttonText }}
            >
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.primary }}
    >
      <AudioStoryPlayer
        story={story}
      />
    </SafeAreaView>
  );
};

export default AudioDetails;
