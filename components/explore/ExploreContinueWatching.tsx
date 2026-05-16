/**
 * Continue Watching Section
 */

import React from "react";

import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ContinueItem = {
  id: string;
  title: string;
  image: string;
  progress: number;
  duration: string;
};

type Props = {
  data: ContinueItem[];

  /* HOW MANY ITEMS TO SHOW */
  limit?: number;

  /* HORIZONTAL / VERTICAL */
  horizontal?: boolean;

  /* ENABLE SCROLL */
  scrollEnabled?: boolean;
};

const ExploreContinueWatching = ({
  data,
  limit = 5,
  horizontal = false,
  scrollEnabled = true,
}: Props) => {
  /* LIMITED DATA */
  const limitedData =
    data.slice(0, limit);

  const renderItem = (item: ContinueItem) => (
    <TouchableOpacity
      key={item.id}
      activeOpacity={0.9}
      className={`overflow-hidden rounded-3xl bg-gray-100 ${
        horizontal
          ? "w-[280px]"
          : "w-full"
      }`}
    >
      <Image
        source={{
          uri: item.image,
        }}
        className={`w-full ${
          horizontal
            ? "h-48"
            : "h-56"
        }`}
        resizeMode="cover"
      />

      <View className="p-4">
        <Text
          numberOfLines={1}
          className="text-xl font-bold text-black"
        >
          {item.title}
        </Text>

        <View className="mt-2 flex-row items-center justify-between">
          <Text className="text-gray-500">
            {item.progress}%
            watched
          </Text>

          <Text className="text-gray-500">
            {item.duration}
          </Text>
        </View>

        <View className="mt-4 h-2 overflow-hidden rounded-full bg-gray-300">
          <View
            style={{
              width: `${item.progress}%`,
            }}
            className="h-full rounded-full bg-violet-600"
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="mt-10 px-5">
      {/* HEADER */}
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-xl font-bold text-black">
          Continue Watching
        </Text>

        <TouchableOpacity>
          <Text className="font-semibold text-violet-600">
            See All
          </Text>
        </TouchableOpacity>
      </View>

      {horizontal ? (
        <FlatList
          horizontal
          data={limitedData}
          keyExtractor={(item) =>
            item.id
          }
          scrollEnabled={
            scrollEnabled
          }
          showsHorizontalScrollIndicator={
            false
          }
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={{
            gap: 16,
            paddingRight: 20,
          }}
          renderItem={({ item }) =>
            renderItem(item)
          }
        />
      ) : (
        <View className="gap-4">
          {limitedData.map(renderItem)}
        </View>
      )}
    </View>
  );
};

export default ExploreContinueWatching;
