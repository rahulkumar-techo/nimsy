import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  items: string[];
};

const ExplorePopularSearches = ({ items }: Props) => (
  <View className="mt-10 px-5">
    <View className="mb-4 flex-row items-center justify-between">
      <Text className="text-xl font-bold text-black">Popular Searches</Text>
      <Text className="font-semibold text-violet-600">See All</Text>
    </View>

    <View className="flex-row flex-wrap">
      {items.map((item, index) => (
        <TouchableOpacity key={index} className="mb-3 mr-3 rounded-full bg-gray-100 px-4 py-3">
          <Text className="font-medium text-gray-700">{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default ExplorePopularSearches;
