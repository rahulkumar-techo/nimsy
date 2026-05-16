import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

const ExploreSearch = () => (
  <View className="mt-6 flex-row items-center px-5">
    <View className="mr-3 flex-1 flex-row items-center rounded-2xl bg-gray-100 px-4 py-3">
      <Ionicons name="search" size={20} color="gray" />
      <TextInput placeholder="Search stories..." placeholderTextColor="gray" className="ml-3 flex-1 text-black" />
    </View>

    <TouchableOpacity className="h-14 w-14 items-center justify-center rounded-2xl bg-violet-600">
      <Ionicons name="options-outline" size={24} color="white" />
    </TouchableOpacity>
  </View>
);

export default ExploreSearch;
