import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

type Item = {
  title: string;
  image: string;
};

type Props = {
  items: Item[];
};

const ExploreNewTrending = ({ items }: Props) => (
  <View className="mt-10 px-5">
    <View className="mb-4 flex-row items-center justify-between">
      <Text className="text-xl font-bold text-black">New & Trending</Text>
      <Text className="font-semibold text-violet-600">See All</Text>
    </View>

    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {items.map((item, index) => (
        <TouchableOpacity key={index} className="mr-4 w-48 overflow-hidden rounded-3xl bg-black">
          <Image source={{ uri: item.image }} className="h-64 w-full opacity-90" />
          <View className="absolute bottom-0 left-0 right-0 p-4">
            <Text className="text-2xl font-bold text-white">{item.title}</Text>
            <Text className="mt-1 text-gray-200">7 mins read</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

export default ExploreNewTrending;
