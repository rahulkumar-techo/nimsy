/**
 * Audio Story Player
 * Reusable Audio Player
 */

import React, {
  useEffect,
  useRef,
} from "react";

import {
  ActivityIndicator,
  Animated,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import Slider from "@react-native-community/slider";

import {
  Ionicons,
  Feather,
} from "@expo/vector-icons";

import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";

import { router } from "expo-router";

type Story = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  narrator: string;
  duration: string;
  thumbnail: string;
  audio: string;
};

type Props = {
  story: Story;
};

const AudioStoryPlayer = ({
  story,
}: Props) => {
  const player = useAudioPlayer(
    {
      uri: story.audio,
    },
    {
      updateInterval: 500,
      downloadFirst: false,
    }
  );

  const status =
    useAudioPlayerStatus(player);

  const { width, height } =
    useWindowDimensions();

  const scrollY = useRef(
    new Animated.Value(0)
  ).current;

  const artworkSize = Math.min(
    width - 64,
    height * 0.36,
    288
  );

  const collapsedArtworkSize =
    Math.min(
      Math.max(width * 0.22, 76),
      96
    );

  const animatedArtworkSize =
    scrollY.interpolate({
      inputRange: [0, 160],
      outputRange: [
        artworkSize,
        collapsedArtworkSize,
      ],
      extrapolate: "clamp",
    });

  const animatedArtworkRadius =
    scrollY.interpolate({
      inputRange: [0, 160],
      outputRange: [
        Math.min(
          40,
          artworkSize * 0.14
        ),
        16,
      ],
      extrapolate: "clamp",
    });

  const controlGap = Math.max(
    24,
    Math.min(width * 0.1, 40)
  );

  const playButtonSize = Math.min(
    Math.max(width * 0.22, 76),
    96
  );

  const sideButtonSize = Math.min(
    Math.max(width * 0.13, 48),
    56
  );

  const isLoaded =
    status.isLoaded;

  const isPlaying =
    status.playing;

  const position =
    status.currentTime || 0;

  const duration =
    status.duration || 1;

  /**
   * Configure Audio
   */
  useEffect(() => {
    async function configureAudio() {
      try {
        await setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true,
          shouldPlayInBackground: false,
          shouldRouteThroughEarpiece: false,
          interruptionMode: "duckOthers",
        });
      } catch (error) {
        console.log(
          "Audio mode error:",
          error
        );
      }
    }

    configureAudio();
  }, []);

  useEffect(() => {
    player.replace({
      uri: story.audio,
    });
  }, [player, story.audio]);

  /**
   * Play Pause
   */
  const togglePlayPause =
    () => {
      try {
        if (!isLoaded) return;

        if (
          !isPlaying &&
          position >= duration - 0.5
        ) {
          player.seekTo(0);
          player.play();
          return;
        }

        if (isPlaying) {
          player.pause();
        } else {
          player.play();
        }
      } catch (error) {
        console.log(
          "Audio playback error:",
          error
        );
      }
    };

  /**
   * Seek
   */
  const handleSeek = async (
    value: number
  ) => {
    if (!isLoaded) return;

    await player.seekTo(
      value
    );
  };

  /**
   * Jump
   */
  const jumpBy = async (
    seconds: number
  ) => {
    if (!isLoaded) return;

    const next =
      Math.min(
        Math.max(
          position + seconds,
          0
        ),
        duration
      );

    await player.seekTo(
      next
    );
  };

  /**
   * Format Time
   */
  const formatTime = (
    secondsValue: number
  ) => {
    const totalSeconds =
      Math.floor(secondsValue);

    const minutes =
      Math.floor(
        totalSeconds / 60
      );

    const seconds =
      totalSeconds % 60;

    return `${minutes}:${
      seconds < 10
        ? "0" + seconds
        : seconds
    }`;
  };

  return (
    <View className="flex-1 bg-[#4f35d7]">
      <Animated.ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: scrollY,
                },
              },
            },
          ],
          {
            useNativeDriver: false,
          }
        )}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 28,
        }}
      >
        <View className="flex-1 px-5">
          {/* Header */}
          <View className="flex-row items-center justify-between pt-5">

            <TouchableOpacity
              onPress={() =>
                router.back()
              }
              className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color="white"
              />
            </TouchableOpacity>

            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <Feather
                name="more-vertical"
                size={22}
                color="white"
              />
            </TouchableOpacity>

          </View>

          {/* Thumbnail */}
          <View className="mt-8 items-center">

            <Animated.Image
              source={{
                uri: story.thumbnail,
              }}
              style={{
                height:
                  animatedArtworkSize,
                width:
                  animatedArtworkSize,
                borderRadius:
                  animatedArtworkRadius,
              }}
              resizeMode="cover"
            />

          </View>

          {/* Info */}
          <View className="mt-8 items-center px-2">

            <Text
              numberOfLines={2}
              className="text-center text-3xl font-bold text-white"
            >
              {story.title}
            </Text>

            <Text
              numberOfLines={2}
              className="mt-2 text-center text-base text-violet-200"
            >
              {story.subtitle}
            </Text>

            <View className="mt-4 flex-row items-center gap-2 rounded-full bg-white/10 px-4 py-2">
              <Ionicons
                name="mic-outline"
                size={16}
                color="#ddd6fe"
              />

              <Text className="text-sm font-semibold text-violet-100">
                {story.narrator}
              </Text>

              <View className="h-1 w-1 rounded-full bg-violet-200" />

              <Text className="text-sm font-semibold text-violet-100">
                {story.duration}
              </Text>
            </View>

          </View>

          {/* Progress */}
          <View className="mt-8">

            <Slider
              disabled={!isLoaded}
              minimumValue={0}
              maximumValue={duration}
              value={Math.min(
                position,
                duration
              )}
              minimumTrackTintColor="#fff"
              maximumTrackTintColor="#ffffff55"
              thumbTintColor="#fff"
              onSlidingComplete={
                handleSeek
              }
            />

            <View className="mt-2 flex-row justify-between">

              <Text className="text-violet-200">
                {formatTime(position)}
              </Text>

              <Text className="text-violet-200">
                {formatTime(duration)}
              </Text>

            </View>

          </View>

          {/* Controls */}
          <View
            className="mt-9 flex-row items-center justify-center"
            style={{
              columnGap: controlGap,
            }}
          >

            <TouchableOpacity
              disabled={!isLoaded}
              onPress={() =>
                jumpBy(-10)
              }
              style={{
                height: sideButtonSize,
                width: sideButtonSize,
              }}
              className="items-center justify-center rounded-full bg-white/10 disabled:opacity-40"
            >
              <Ionicons
                name="play-back"
                size={28}
                color="white"
              />
            </TouchableOpacity>

            <TouchableOpacity
              disabled={
                !isLoaded
              }
              onPress={
                togglePlayPause
              }
              style={{
                height: playButtonSize,
                width: playButtonSize,
              }}
              className="items-center justify-center rounded-full bg-white disabled:opacity-70"
            >
              {
                isLoaded ? (
                  <Ionicons
                    name={
                      isPlaying
                        ? "pause"
                        : "play"
                    }
                    size={42}
                    color="#4f35d7"
                  />
                ) : (
                  <ActivityIndicator
                    color="#4f35d7"
                  />
                )
              }
            </TouchableOpacity>

            <TouchableOpacity
              disabled={!isLoaded}
              onPress={() =>
                jumpBy(10)
              }
              style={{
                height: sideButtonSize,
                width: sideButtonSize,
              }}
              className="items-center justify-center rounded-full bg-white/10 disabled:opacity-40"
            >
              <Ionicons
                name="play-forward"
                size={28}
                color="white"
              />
            </TouchableOpacity>

          </View>

          {/* Description */}
          <View className="mt-10 rounded-3xl bg-white/10 p-5">
            <Text className="text-xl font-bold text-white">
              About this story
            </Text>

            <Text className="mt-3 text-base leading-7 text-violet-100">
              {story.description}
            </Text>
          </View>

          <View className="mt-4 rounded-3xl bg-white/10 p-5">
            <Text className="text-xl font-bold text-white">
              Up next
            </Text>

            <Text className="mt-3 text-base leading-7 text-violet-100">
              Keep listening to gentle audio stories from Nimsy, including bedtime tales, calm fantasy journeys, and peaceful nature stories.
            </Text>
          </View>

          {/* Bottom Actions */}
          <View className="mt-8 flex-row items-center justify-around px-8 pt-2">

            <TouchableOpacity>
              <Ionicons
                name="list"
                size={28}
                color="white"
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <Ionicons
                name="bookmark-outline"
                size={26}
                color="white"
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <Ionicons
                name="timer-outline"
                size={26}
                color="white"
              />
            </TouchableOpacity>

          </View>
        </View>
      </Animated.ScrollView>

    </View>
  );
};

export default AudioStoryPlayer;
