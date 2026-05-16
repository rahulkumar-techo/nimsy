import React from "react";

import {
    Modal,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  onClose: () => void;
  playbackSpeed: number;
  onChangeSpeed: (s: number) => void;
  isLooping: boolean;
  onToggleLoop: () => void;
  isScreenLocked: boolean;
  onToggleLock: () => void;
  isFullscreen?: boolean;
};

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 2];

const VideoSettingsDrawer = ({
  visible,
  onClose,
  playbackSpeed,
  onChangeSpeed,
  isLooping,
  onToggleLoop,
  isScreenLocked,
  onToggleLock,
  isFullscreen = false,
}: Props) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
    >
      {/* BACKDROP */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        // if fullscreen, make backdrop a row so drawer appears from right
        className={isFullscreen ? "flex-1 flex-row justify-end bg-black/50" : "flex-1 justify-end bg-black/50"}
      >
        {/* DRAWER */}
        <TouchableOpacity
          activeOpacity={1}
          className={isFullscreen ? "rounded-l-3xl bg-[#1c1c1e] px-5 pb-10 pt-4 w-80" : "rounded-t-3xl bg-[#1c1c1e] px-5 pb-10 pt-4"}
        >
          {/* HANDLE */}
          <View className="mb-5 items-center">
            <View className="h-1.5 w-14 rounded-full bg-gray-500" />
          </View>

          {/* TITLE */}
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-white">Video Settings</Text>

            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={26} color="white" />
            </TouchableOpacity>
          </View>

          {/* PLAYBACK SPEED */}
          <View className="mb-4">
            <Text className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-400">
              Playback speed
            </Text>

            <View className="flex-row flex-wrap gap-2">
              {SPEED_OPTIONS.map((s) => {
                const active = playbackSpeed === s;

                return (
                  <TouchableOpacity
                    key={s}
                    onPress={() => onChangeSpeed(s)}
                    activeOpacity={0.9}
                    className={`rounded-full px-3 py-2 ${
                      active ? "bg-white" : "bg-slate-800"
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        active ? "text-slate-900" : "text-white"
                      }`}
                    >
                      {s}x
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* LOOP & LOCK */}
          <View className="mb-4">
            <View className="mb-3 flex-row items-center justify-between">
              <View>
                <Text className="text-base font-semibold text-white">Loop</Text>
                <Text className="text-xs text-slate-400">Repeat the current video</Text>
              </View>

              <TouchableOpacity
                onPress={onToggleLoop}
                activeOpacity={0.9}
                className={`rounded-full px-4 py-2 ${
                  isLooping ? "bg-white" : "bg-slate-800"
                }`}
              >
                <Text className={`text-sm font-semibold ${isLooping ? "text-slate-900" : "text-white"}`}>
                  {isLooping ? "On" : "Off"}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-base font-semibold text-white">Lock rotation</Text>
                <Text className="text-xs text-slate-400">Keep current screen orientation</Text>
              </View>

              <TouchableOpacity
                onPress={onToggleLock}
                activeOpacity={0.9}
                className={`rounded-full px-4 py-2 ${
                  isScreenLocked ? "bg-white" : "bg-slate-800"
                }`}
              >
                <Text className={`text-sm font-semibold ${isScreenLocked ? "text-slate-900" : "text-white"}`}>
                  {isScreenLocked ? "Locked" : "Unlocked"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* PLACEHOLDER: Other settings (quality, captions) - kept as non-interactive rows for now */}
          <View>
            <TouchableOpacity activeOpacity={0.8} className="mb-2 flex-row items-center justify-between rounded-2xl bg-[#2c2c2e] px-4 py-4">
              <View className="flex-row items-center">
                <View className="mr-4 h-11 w-11 items-center justify-center rounded-full bg-[#3a3a3c]">
                  <Ionicons name={"md-hd" as any} size={22} color="white" />
                </View>

                <Text className="text-base font-semibold text-white">Quality</Text>
              </View>

              <View className="flex-row items-center">
                <Text className="mr-2 text-sm text-gray-400">Auto</Text>
                <Ionicons name="chevron-forward" size={20} color="gray" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} className="mb-2 flex-row items-center justify-between rounded-2xl bg-[#2c2c2e] px-4 py-4">
              <View className="flex-row items-center">
                <View className="mr-4 h-11 w-11 items-center justify-center rounded-full bg-[#3a3a3c]">
                  <Ionicons name="chatbubble-ellipses-outline" size={22} color="white" />
                </View>

                <Text className="text-base font-semibold text-white">Captions</Text>
              </View>

              <View className="flex-row items-center">
                <Text className="mr-2 text-sm text-gray-400">Off</Text>
                <Ionicons name="chevron-forward" size={20} color="gray" />
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default VideoSettingsDrawer;