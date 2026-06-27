/**
 * Home Feed
 * Podcast section + video feed
 */

import React, {
  memo,
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  type ListRenderItem,
  RefreshControl,
  Text,
  View,
} from "react-native";

import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { audios } from "@/constants/audios";

import AudioCard from "@/components/cards/AudioCard";
import VideoCard from "@/components/cards/VideoCard";

import HomeHeader from "./HomeHeader";

import { useTheme } from "@/context/ThemeContext";
import { useFeed } from "@/features/home/hooks/useFeed";
import { ApiVideo } from "@/features/home/types/video";

const MemoVideoCard = memo(VideoCard);
const MemoAudioCard = memo(AudioCard);

const renderAudio = ({
  item,
}: {
  item: (typeof audios)[number];
}) => <MemoAudioCard item={item} />;

export default function HomeFeed() {
  const insets = useSafeAreaInsets();

  const [headerHeight, setHeaderHeight] =
    useState(0);

  const { colors } = useTheme();

  const {
    videos,
    loading,
    loadingMore,
    refreshing,
    error,
    hasMore,
    onRefresh,
    loadMore,
  } = useFeed(10);

  console.log(JSON.stringify(videos[0],null,4))

  const translateY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const isHeaderHidden = useSharedValue(false);

  const onScroll =
    useAnimatedScrollHandler({
      onScroll: (event) => {
        "worklet";

        const currentY =
          event.contentOffset.y;

        const delta =
          currentY - lastScrollY.value;

        if (Math.abs(delta) < 5) return;

        if (
          delta > 0 &&
          currentY > 100 &&
          !isHeaderHidden.value
        ) {
          isHeaderHidden.value = true;

          translateY.value = withTiming(
            -headerHeight,
            {
              duration: 200,
            },
          );
        }

        if (
          delta < 0 &&
          isHeaderHidden.value
        ) {
          isHeaderHidden.value = false;

          translateY.value = withTiming(0, {
            duration: 200,
          });
        }

        lastScrollY.value = currentY;
      },
    });

  const headerStyle =
    useAnimatedStyle(() => ({
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    }));

  const renderVideo = useCallback<ListRenderItem<ApiVideo>>(
    ({ item }) => <MemoVideoCard item={item} />,
    [],
  );

  const PodcastHeader = useMemo(
    () => (
      <View className="my-4">
        <Text
          className="mb-3 px-4 text-lg font-bold"
          style={{
            color: colors.text,
          }}
        >
          Podcasts
        </Text>

        <FlatListAudios
          colors={colors}
        />
      </View>
    ),
    [colors],
  );

  const ListFooter = useMemo(() => {
    if (!loadingMore) return null;

    return (
      <View className="py-4">
        <ActivityIndicator
          color={colors.text}
        />
      </View>
    );
  }, [loadingMore, colors.text]);

  if (loading && videos.length === 0) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{
          backgroundColor:
            colors.background,
        }}
      >
        <ActivityIndicator
          size="large"
          color={colors.text}
        />
      </View>
    );
  }

  if (error && videos.length === 0) {
    return (
      <View
        className="flex-1 items-center justify-center px-6"
        style={{
          backgroundColor:
            colors.background,
        }}
      >
        <Text
          className="text-center"
          style={{
            color: colors.text,
          }}
        >
          {typeof error === "string"
            ? error
            : "Something went wrong"}
        </Text>
      </View>
    );
  }

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor:
          colors.background,
      }}
    >
      {/* Status bar background */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: insets.top,
          backgroundColor:
            colors.background,
          zIndex: 1000,
        }}
      />

      {/* Header */}
      <Animated.View
        onLayout={(e) =>
          setHeaderHeight(
            e.nativeEvent.layout.height,
          )
        }
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 999,
            elevation: 999,
            backgroundColor:
              colors.background,
          },
          headerStyle,
        ]}
      >
        <View
          style={{
            paddingTop: insets.top,
          }}
        >
          <HomeHeader />
        </View>
      </Animated.View>

      {/* Feed */}
      <Animated.FlatList<ApiVideo>
        data={videos}
        renderItem={renderVideo}
        keyExtractor={(item) => item.id}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={
          false
        }
        ListHeaderComponent={
          PodcastHeader
        }
        ListFooterComponent={
          ListFooter
        }
        contentContainerStyle={{
          paddingTop: headerHeight,
          paddingBottom: 24,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.text}
          />
        }
        onEndReached={
          hasMore
            ? loadMore
            : undefined
        }
        onEndReachedThreshold={0.5}
        windowSize={5}
        maxToRenderPerBatch={5}
        initialNumToRender={5}
        removeClippedSubviews
      />
    </View>
  );
}

function FlatListAudios({
  colors,
}: {
  colors: ReturnType<
    typeof useTheme
  >["colors"];
}) {
  return (
    <Animated.FlatList
      horizontal
      data={audios}
      keyExtractor={(item) => item.id}
      renderItem={renderAudio}
      showsHorizontalScrollIndicator={
        false
      }
      contentContainerStyle={{
        paddingHorizontal: 16,
      }}
    />
  );
}
