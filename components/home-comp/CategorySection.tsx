/**
 * CategorySection (Top Categories)
 */

import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

import CategoryCard from "./CategoryCard";

type CategoryItem = {
  id: string;
  title: string;
  subtitle?: string;
  image: any;
};

type Props = {
  data: CategoryItem[];
};

export default function CategorySection({ data }: Props) {
  const router = useRouter();

  /**
   * Navigate to category screen
   */
  const handleCategory = (
    title: string,
    id: string
  ) => {
    router.push({
      pathname: "/category",
      params: {
        id,
        title,
      },
    });
  };

  return (
    <View className="w-full">

      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-bold text-slate-900">
          Top Categories
        </Text>

        <Pressable>
          <Text className="font-semibold text-blue-600">
            See All
          </Text>
        </Pressable>
      </View>

      {/* Grid */}
      <View className="flex-row flex-wrap justify-between gap-y-4">
        {data.map((item) => (
          <CategoryCard
            key={item.id}
            {...item}
            onPress={() => handleCategory(item.title, item.id)}
          />
        ))}
      </View>

    </View>
  );
}
