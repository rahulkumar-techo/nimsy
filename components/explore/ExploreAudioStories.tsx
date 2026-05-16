import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const ExploreAudioStories = () => (
  <View className="mt-10 px-5">
    <View className="mb-4 flex-row items-center justify-between">
      <Text className="text-xl font-bold text-black">Audio Stories</Text>
      <Text className="font-semibold text-violet-600">See All</Text>
    </View>

    <TouchableOpacity className="rounded-3xl bg-violet-600 p-5">
      <Text className="text-2xl font-bold text-white">The Night Sky</Text>
      <Text className="mt-2 text-violet-100">Relaxing bedtime audio story</Text>

      <View className="mt-6 flex-row items-center justify-between">
        <View className="h-1 flex-1 rounded-full bg-violet-300">
          <View className="h-full w-1/2 rounded-full bg-white" />
        </View>

        <TouchableOpacity className="ml-4 h-14 w-14 items-center justify-center rounded-full bg-white">
          <Ionicons name="play" size={28} color="#7c3aed" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  </View>
);

export default ExploreAudioStories;
