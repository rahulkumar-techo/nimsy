/**
 * Explore Recommended Section
 * Personalized Recommendation Cards
 */

import React, {
  memo,
  useCallback,
} from "react";

import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import SeeAll from "../SeeAll";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type RecommendedItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
};

type Props = {
  items: RecommendedItem[];
};

type CardProps = {
  item: RecommendedItem;
  fullWidth?: boolean;
  onPress?: (
    item: RecommendedItem
  ) => void;
};

/* -------------------------------------------------------------------------- */
/*                              RECOMMENDED CARD                              */
/* -------------------------------------------------------------------------- */

const RecommendedCard = memo(
  ({
    item,
    onPress,
    fullWidth = false,
  }: CardProps) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          onPress?.(item)
        }
        className={`
          mb-4
          overflow-hidden
          rounded-3xl
          bg-gray-100
          ${fullWidth ? "w-full" : ""}
        `}
      >

        <View className="flex-row">

          {/* Thumbnail */}
          <Image
            source={{
              uri: item.image,
            }}
            className="h-36 w-36"
          />

          {/* Content */}
          <View className="flex-1 justify-center p-4">

            {/* Title */}
            <Text className="text-xl font-bold text-black">
              {item.title}
            </Text>

            {/* Description */}
            <Text
              numberOfLines={2}
              className="mt-2 text-gray-500"
            >
              {item.description}
            </Text>

            {/* Duration */}
            <View className="mt-4 flex-row items-center">

              <Ionicons
                name="time-outline"
                size={16}
                color="gray"
              />

              <Text className="ml-1 text-gray-500">
                {item.duration}
              </Text>

            </View>

          </View>

        </View>

      </TouchableOpacity>
    );
  }
);

RecommendedCard.displayName =
  "RecommendedCard";

/* -------------------------------------------------------------------------- */
/*                           EXPLORE RECOMMENDED                              */
/* -------------------------------------------------------------------------- */

const ExploreRecommended =
  ({ items }: Props) => {

    /**
     * Handle Card Press
     */
    const handlePress =
      useCallback(
        (
          item: RecommendedItem
        ) => {
          console.log(
            "Selected:",
            item.title
          );
        },
        []
      );

    /**
     * Render FlatList Item
     */
    const renderItem =
      useCallback(
        ({
          item,
        }: {
          item: RecommendedItem;
        }) => (
          <RecommendedCard
            item={item}
            onPress={
              handlePress
            }
            fullWidth
          />
        ),
        [handlePress]
      );

    return (
      <View className="mt-10 px-5">

        {/* Header */}
        <View className="mb-4 flex-row items-center justify-between">

          <Text className="text-xl font-bold text-black">
            Recommended For You
          </Text>

          <SeeAll
            title="Recommended"
            data={items}
            keyExtractor={(
              item
            ) => item.id}
            renderItem={
              renderItem
            }
          />

        </View>

        {/* Preview Items */}
        {items
          .slice(0, 3)
          .map((item) => (
            <RecommendedCard
              key={item.id}
              item={item}
              onPress={
                handlePress
              }
            />
          ))}

      </View>
    );
  };

export default memo(
  ExploreRecommended
);