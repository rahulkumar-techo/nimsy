import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import Header from "@/components/Header";
import VideoList from "@/components/video/VideoLists";
import { VIDEOS } from "@/components/video/video.constant";
import { useTheme } from "@/context/ThemeContext";

export default function VideoLists() {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      className="flex-1"
      style={{
        backgroundColor: colors.background,
      }}
    >
      <Header
        title="Videos"
        onSearchPress={() => router.push("/explore")}
        onSharePress={() => console.log("share")}
        onSettingsPress={() =>
          router.push("/userdetails")
        }
      />

      <VideoList videos={VIDEOS} />
    </SafeAreaView>
  );
}