import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Category = {
  title: string;
  icon: string;
};

type Props = {
  categories: Category[];
};

const ExploreCategories = ({ categories }: Props) => (
  <View className="mt-8 px-5">
    <Text className="mb-4 text-xl font-bold text-black">Categories</Text>
    <View className="flex-row justify-between">
      {categories.map((item, index) => (
        <TouchableOpacity key={index} className="items-center">
          <View className="mb-2 h-20 w-20 items-center justify-center rounded-3xl bg-violet-100">
            <Ionicons name={item.icon as any} size={32} color="#7c3aed" />
          </View>
          <Text className="font-semibold text-black">{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default ExploreCategories;
