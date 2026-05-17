/**
 * Explore Audio Stories Section
 */

import React, {
  useCallback,
  memo,
} from "react";

import {
  FlatList,
  Text,
  View,
  Pressable,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useRouter,
} from "expo-router";

import {
  ImageBackground,
} from "expo-image";

import SeeAll from "../SeeAll";

import {
  DUMMY_AUDIO_STORIES,
} from "@/constants/audio_data";
import { useTheme } from "@/context/ThemeContext";

type AudioItem = {
  id: string;
  title: string;
  subtitle: string;
  progress: number;
  audio: string;
  thumbnail: string;
};

type CardProps = {
  item: AudioItem;
  onPress: (item: AudioItem) => void;
};

const AudioCard = memo(
  ({
    item,
    onPress,
  }: CardProps) => {
    const { colors } = useTheme();

    return (
      <Pressable
        onPress={() => onPress(item)}
        className="mr-4 h-44 w-72 overflow-hidden rounded-3xl"
      >
        <ImageBackground
          source={item.thumbnail}
          contentFit="cover"
          transition={300}
          style={{
            flex: 1,
            padding: 20,
          }}
          imageStyle={{
            borderRadius: 24,
          }}
        >
          {/* Dark Overlay */}
          <View className="absolute inset-0 rounded-3xl bg-black/35" />

          {/* Content */}
          <View className="flex-1 justify-between">
            <View>
              <Text className="text-2xl font-bold text-white">
                {item.title}
              </Text>

              <Text className="mt-1 text-violet-100">
                {item.subtitle}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              {/* Progress */}
              <View className="h-1.5 flex-1 rounded-full bg-white/30">
                <View
                  style={{
                    width: `${item.progress}%`,
                  }}
                  className="h-full rounded-full bg-white"
                />
              </View>

              {/* Play Button */}
              <Pressable
                onPress={() => onPress(item)}
                className="ml-3 h-12 w-12 items-center justify-center rounded-full bg-white"
              >
                <Ionicons
                  name="play"
                  size={22}
                  color={colors.primary}
                />
              </Pressable>
            </View>
          </View>
        </ImageBackground>
      </Pressable>
    );
  }
);

AudioCard.displayName = "AudioCard";

const ExploreAudioStories =
  () => {
    const router = useRouter();
    const { colors } = useTheme();

    const handleOpenAudio =
      useCallback(
        (item: AudioItem) => {
          router.push({
            pathname: "/audio",
            params: {
              id: item.id,
            },
          });
        },
        [router]
      );

    const renderItem =
      useCallback(
        ({
          item,
        }: {
          item: AudioItem;
        }) => (
          <AudioCard
            item={item}
            onPress={
              handleOpenAudio
            }
          />
        ),
        [handleOpenAudio]
      );

    return (
      <View className="mt-10">

        {/* Header */}
        <View className="mb-4 flex-row items-center justify-between px-5">
          <Text className="text-xl font-bold" style={{ color: colors.text }}>
            Audio Stories
          </Text>

          <SeeAll
            title="Audio Stories"
            data={
              DUMMY_AUDIO_STORIES
            }
            horizontal={false}
            keyExtractor={(
              item
            ) => item.id}
            renderItem={renderItem}
          />
        </View>

        {/* List */}
        <FlatList
          horizontal
          data={DUMMY_AUDIO_STORIES.slice(
            0,
            5
          )}
          keyExtractor={(
            item
          ) => item.id}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={{
            paddingHorizontal: 20,
          }}
          removeClippedSubviews
          initialNumToRender={3}
          maxToRenderPerBatch={5}
          windowSize={5}
        />
      </View>
    );
  };

export default ExploreAudioStories;
