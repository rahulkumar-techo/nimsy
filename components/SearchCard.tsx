/**
 * Search Card
 */

import React from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Image,
} from "expo-image";

import {
  Ionicons,
} from "@expo/vector-icons";

type Props = {
  item: {
    id: string;
    title: string;
    thumbnail: string;
    stories: unknown[];
  };

  onPress: () => void;
};

const SearchCard = ({
  item,
  onPress,
}: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="mb-4 flex-row overflow-hidden rounded-3xl bg-white"
      style={{
        elevation: 2,
      }}
    >
      <Image
        source={{
          uri: item.thumbnail,
        }}
        contentFit="cover"
        transition={200}
        style={{
          width: 110,
          height: 110,
        }}
      />

      <View className="flex-1 justify-between px-4 py-3">
        <View>
          <Text
            numberOfLines={1}
            className="text-lg font-bold text-black"
          >
            {item.title}
          </Text>

          <Text
            numberOfLines={2}
            className="mt-2 text-sm leading-5 text-gray-500"
          >
            Explore fun and engaging
            stories from this category.
          </Text>
        </View>

        <View className="mt-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons
              name="book-outline"
              size={16}
              color="#7C3AED"
            />

            <Text className="ml-1 text-sm font-medium text-violet-600">
              {item.stories.length} stories
            </Text>
          </View>

          <Ionicons
            name="arrow-forward-circle"
            size={26}
            color="#7C3AED"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SearchCard;