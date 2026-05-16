import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Item = {
  title: string;
  description: string;
  image: string;
  duration: string;
};

type Props = {
  items: Item[];
};

const ExploreRecommended = ({ items }: Props) => (
  <View className="mt-10 px-5">
    <View className="mb-4 flex-row items-center justify-between">
      <Text className="text-xl font-bold text-black">Recommended For You</Text>
      <Text className="font-semibold text-violet-600">See All</Text>
    </View>

    {items.map((item, index) => (
      <TouchableOpacity key={index} className="mb-4 flex-row overflow-hidden rounded-3xl bg-gray-100">
        <Image source={{ uri: item.image }} className="h-36 w-36" />
        <View className="flex-1 justify-center p-4">
          <Text className="text-xl font-bold text-black">{item.title}</Text>
          <Text className="mt-2 text-gray-500">{item.description}</Text>
          <View className="mt-4 flex-row items-center">
            <Ionicons name="time-outline" size={16} color="gray" />
            <Text className="ml-1 text-gray-500">{item.duration}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ))}
  </View>
);

export default ExploreRecommended;
