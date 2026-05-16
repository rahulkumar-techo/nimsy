import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { router } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { VideoView, useVideoPlayer } from "expo-video";
import React, { useEffect, useState } from "react";
import { Pressable, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import VideoSettingsDrawer from "./VideoSettingsDrawer";

type Props = {
  videoUrl: string;
  title?: string;
};

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const VideoPlayer = ({ videoUrl, title }: Props) => {
  const insets = useSafeAreaInsets();
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSetting, setIsSettings] = useState(false);
  const [playbackSpeedState, setPlaybackSpeedState] = useState<number>(1);
  const [isLoopingState, setIsLoopingState] = useState<boolean>(false);
  const [isScreenLockedState, setIsScreenLockedState] = useState<boolean>(false);
  const player = useVideoPlayer(videoUrl, (p) => {
    p.loop = false;
  });

  const isVideoEnded = duration > 0 && currentTime >= duration - 0.5;

  const seekForward = () => {
    player.currentTime = (player.currentTime || 0) + 10;
  };

  const seekBackward = () => {
    player.currentTime = Math.max((player.currentTime || 0) - 10, 0);
  };

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentTime(player.currentTime || 0);
      setDuration(player.duration || 0);
    }, 250);

    return () => clearInterval(id);
  }, [player]);

  useEffect(() => {
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => null);
      StatusBar.setHidden(false);
    };
  }, []);

  useEffect(() => {
    // apply loop state to player
    player.loop = isLoopingState;
  }, [isLoopingState, player]);

  useEffect(() => {
    // apply playback speed to player
    player.playbackRate = playbackSpeedState;
  }, [playbackSpeedState, player]);

  useEffect(() => {
    const applyLock = async () => {
      try {
        if (isScreenLockedState) {
          await ScreenOrientation.lockAsync(
            isFullscreen ? ScreenOrientation.OrientationLock.LANDSCAPE : ScreenOrientation.OrientationLock.PORTRAIT_UP
          );
        } else {
          await ScreenOrientation.unlockAsync();
        }
      } catch {}
    };

    applyLock();
  }, [isScreenLockedState, isFullscreen]);

  const togglePlay = () => {
    if (isVideoEnded) {
      player.currentTime = 0;
      player.play();
    } else if (player.playing) player.pause();
    else player.play();
    setShowControls(true);
  };

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        StatusBar.setHidden(true);
        setIsFullscreen(true);
      } else {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        StatusBar.setHidden(false);
        setIsFullscreen(false);
      }
    } catch (e) {
      setIsFullscreen((s) => !s);
    }
    setShowControls(true);
  };

  return (
    <View className="bg-black">
      <View className={`${isFullscreen ? "h-screen" : "h-[240px]"} bg-black`}>
        <VideoView player={player} nativeControls={false} style={{ width: "100%", height: "100%" }} />

        <Pressable className="absolute inset-0" onPress={() => setShowControls((s) => !s)} />

        {showControls && (
          <View className="absolute inset-0" pointerEvents="box-none">
            <View style={{ paddingTop: insets.top + 8 }} className="absolute left-0 right-0 top-0 flex-row items-center justify-between px-4">
              <View className="flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                  <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>

                <Text className="text-white text-base">{title || "Video"}</Text>
              </View>
            </View>

            <View className="absolute inset-0 flex-row items-center justify-center">
              <TouchableOpacity onPress={seekBackward} activeOpacity={0.8} className="mx-6 items-center">
                <Ionicons name="play-back" size={36} color="white" />
              </TouchableOpacity>

              <TouchableOpacity onPress={togglePlay} className="h-16 w-16 items-center justify-center rounded-full bg-black/60">
                <Ionicons name={isVideoEnded ? "refresh" : player.playing ? "pause" : "play"} size={36} color="white" />
              </TouchableOpacity>

              <TouchableOpacity onPress={seekForward} activeOpacity={0.8} className="mx-6 items-center">
                <Ionicons name="play-forward" size={36} color="white" />
              </TouchableOpacity>
            </View>

            <View className="absolute bottom-0 left-0 right-0 px-4 pb-3">
              <Slider
                minimumValue={0}
                maximumValue={duration || 0}
                value={currentTime}
                minimumTrackTintColor="#ff0000"
                maximumTrackTintColor="#666"
                thumbTintColor="#ff0000"
                onSlidingComplete={(v) => (player.currentTime = v)}
              />

              <View className="flex-row items-center justify-between">
                {/* TIME */}
                <Text className="text-xs text-white">
                  {formatTime(currentTime)} /{" "}
                  {formatTime(duration)}
                </Text>

                {/* RIGHT ICONS */}
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() =>
                      setIsSettings(true)
                    }
                    className="mr-4"
                  >
                    <Ionicons
                      name="settings"
                      color="white"
                      size={20}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={toggleFullscreen}
                  >
                    <Ionicons
                      name={
                        isFullscreen
                          ? "contract"
                          : "expand"
                      }
                      size={20}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <VideoSettingsDrawer
                visible={isSetting}
                onClose={() => setIsSettings(false)}
                playbackSpeed={playbackSpeedState}
                onChangeSpeed={(speed) => {
                  setPlaybackSpeedState(speed);
                }}
                isLooping={isLoopingState}
                onToggleLoop={() => setIsLoopingState((s) => !s)}
                isScreenLocked={isScreenLockedState}
                onToggleLock={() => setIsScreenLockedState((s) => !s)}
                isFullscreen={isFullscreen}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default VideoPlayer;