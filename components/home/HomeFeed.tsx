import React, { memo, useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ads } from "@/constants/ads";
import { audios } from "@/constants/audios";
import { videos } from "@/constants/videos";

import AdCard from "../cards/AdCard";
import AudioCard from "../cards/AudioCard";
import VideoCard from "../cards/VideoCard";
import HomeHeader from "./HomeHeader";
import { useTheme } from "@/context/ThemeContext";

type FeedItem =
  | ((typeof videos)[number] & { feedId: string; type: "video" })
  | ((typeof ads)[number]    & { feedId: string; type: "ad" });

const MemoVideoCard = memo(VideoCard);
const MemoAdCard    = memo(AdCard);
const MemoAudioCard = memo(AudioCard);

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<FeedItem>);

const renderAudio = ({ item }: { item: (typeof audios)[number] }) => (
  <MemoAudioCard item={item} />
);

export default function HomeFeed() {
  const insets = useSafeAreaInsets();
  const [headerHeight, setHeaderHeight] = useState(0);

  const {colors} = useTheme();

  const translateY      = useSharedValue(0);
  const lastScrollY     = useSharedValue(0);
  const isHeaderHidden  = useSharedValue(false);

  const feedData = useMemo<FeedItem[]>(() => {
    const data: FeedItem[] = [];
    let adIndex = 0;

    videos.forEach((video, index) => {
      data.push({ ...video, feedId: `video-${video.id}`, type: "video" });

      if (index % 3 === 2 && adIndex < ads.length) {
        data.push({ ...ads[adIndex], feedId: `ad-${ads[adIndex].id}`, type: "ad" });
        adIndex++;
      }
    });

    return data;
  }, []);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      "worklet";
      const currentY = event.contentOffset.y;
      const delta = currentY - lastScrollY.value;

      if (Math.abs(delta) < 5) return;

      if (delta > 0 && currentY > 100 && !isHeaderHidden.value) {
        isHeaderHidden.value = true;
        translateY.value = withTiming(-headerHeight, { duration: 200 });
      }

      if (delta < 0 && isHeaderHidden.value) {
        isHeaderHidden.value = false;
        translateY.value = withTiming(0, { duration: 200 });
      }

      lastScrollY.value = currentY;
    },
  });

  const headerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const PodcastHeader = useMemo(() => (
    <View className="my-4">
      <Text className="mb-3 px-4 text-lg font-bold" style={{color:colors.text}}>Podcasts</Text>
      <FlatList
        horizontal
        data={audios}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={renderAudio}
      />
    </View>
  ), [colors.text]);

return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>

      {/* Static status bar background — never animates */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: insets.top,
          backgroundColor: colors.background,
          zIndex: 1000,
        }}
      />

      {/* Animated header — sits below status bar fill */}
      <Animated.View
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 999,
            elevation: 999,
            backgroundColor: colors.background,
          },
          headerStyle,
        ]}
      >
        <View style={{ paddingTop: insets.top }}>
          <HomeHeader />
        </View>
      </Animated.View>

      <AnimatedFlatList
        data={feedData}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: headerHeight,
          paddingBottom: 24,
        }}
        keyExtractor={(item) => item.feedId}
        ListHeaderComponent={PodcastHeader}
        renderItem={({ item }) =>
          item.type === "video"
            ? <MemoVideoCard item={item} />
            : <MemoAdCard item={item} />
        }
        windowSize={5}
        maxToRenderPerBatch={5}
        initialNumToRender={5}
        removeClippedSubviews
      />
    </View>
  );
}