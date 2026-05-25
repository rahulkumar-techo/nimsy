import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import VideoCard from "@/components/VideoCard";
import { stories } from "@/constants/story";
import { useTheme } from "@/context/ThemeContext";
import { storyToVideoItem } from "@/utils/videoNavigation";

const ALL_VIDEOS = stories.map(storyToVideoItem);

const PAGE_SIZE = 2;

export default function VideosRoute() {
  const { colors } = useTheme();

  const [visibleVideos, setVisibleVideos] = useState(
    ALL_VIDEOS.slice(0, PAGE_SIZE)
  );

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const [hasMore, setHasMore] = useState(
    ALL_VIDEOS.length > PAGE_SIZE
  );


  const loadMore = async () => {
  if (loading || !hasMore) return;

  setLoading(true);

  // Simulate API delay
  await new Promise((resolve) =>
    setTimeout(resolve, 1500)
  );

  const nextPage = page + 1;

  const nextVideos = ALL_VIDEOS.slice(
    0,
    nextPage * PAGE_SIZE
  );

  setVisibleVideos(nextVideos);
  setPage(nextPage);

  if (nextVideos.length >= ALL_VIDEOS.length) {
    setHasMore(false);
  }

  setLoading(false);
};

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top", "left", "right"]}
      style={{ backgroundColor: colors.background }}
    >
      <FlatList
        data={visibleVideos}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom:60,
        }}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator
              size="small"
              color={colors.primary}
              style={{ marginTop: 20 }}
            />
          ) : null
        }
        ListHeaderComponent={
          <View
            className="mb-6 rounded-[28px] p-6"
            style={{ backgroundColor: colors.card }}
          >
            <View
              className="h-14 w-14 items-center justify-center rounded-2xl"
              style={{ backgroundColor: colors.primaryLight }}
            >
              <Ionicons
                name="play-circle"
                size={26}
                color={colors.primary}
              />
            </View>

            <Text
              className="mt-6 text-3xl font-extrabold"
              style={{ color: colors.text }}
            >
              Videos
            </Text>

            <Text
              className="mt-3 text-base leading-6"
              style={{ color: colors.secondaryText }}
            >
              Open quick learning videos and watch visual lessons picked for you.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <VideoCard
            video={item}
            className="mt-5"
          />
        )}
      />
    </SafeAreaView>
  );
}