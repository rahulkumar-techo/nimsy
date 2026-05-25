import {
  StatusBar,
  Text,
  View,
} from "react-native";

import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import VideoCard from "@/components/VideoCard";
import { getStoryById } from "@/constants/story";
import { useTheme } from "@/context/ThemeContext";
import { storyToVideoItem } from "@/utils/videoNavigation";

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
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
        backgroundColor={colors.background}
      />

      <View className="px-5 pt-5">
        <VideoCard
          video={storyToVideoItem(story)}
        />

        <Text
          className="mt-2 text-2xl font-black"
          style={{ color: colors.text }}
        >
          {story.title}
        </Text>
        <Text
          className="mt-2 text-base leading-6"
          style={{ color: colors.secondaryText }}
        >
          {story.story.intro}
        </Text>
      </View>
    </View>
  );
};

export default StoryDetailsScreen;
