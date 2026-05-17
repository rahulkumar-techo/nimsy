/**
 * Explore New Trending Section
 */

import React from "react";

import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import SeeAll from "../SeeAll";

type Item = {
  title: string;
  image: string;
};

type Props = {
  items: Item[];


};

const ExploreNewTrending = ({
  items
}: Props) => {

  /**
   * Render Item
   */
const renderItem = ({
  item,
  horizontalText,
}: {
  item: Item;
  horizontalText?: boolean;
}) => (
  <TouchableOpacity
    activeOpacity={0.9}
    className={`
      overflow-hidden
      rounded-3xl
      bg-black
      
      ${
        horizontalText
          ? "mb-4 w-full flex-row"
          : "mr-4 w-48"
      }
    `}
  >

    {/* Image */}
    <Image
      source={{
        uri: item.image,
      }}
      resizeMode="cover"
      className={
        horizontalText
          ? "h-28 w-28"
          : "h-64 w-full opacity-90"
      }
    />

    {/* Content */}
    <View
      className={
        horizontalText
          ? "flex-1 justify-center p-4"
          : "absolute bottom-0 left-0 right-0 p-4"
      }
    >

      <Text
        numberOfLines={2}
        className="text-2xl font-bold text-white"
      >
        {item.title}
      </Text>

      <Text className="mt-1 text-gray-200">
        7 mins read
      </Text>

    </View>

  </TouchableOpacity>
);

  return (
    <View className="mt-10 ">

      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between">

        <Text className="text-xl font-bold text-black">
          New & Trending
        </Text>

        <SeeAll
          title="New & Trending"
          data={items}
         

          keyExtractor={(item) =>
            item.title
          }
          renderItem={({ item }) =>
            renderItem({
              item,
              horizontalText: true,
            })
          }
        />

      </View>

      {/* Preview Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
      >
        {items.map((item, index) => (
          <View key={index}>
            {renderItem({ item })}
          </View>
        ))}
      </ScrollView>

    </View>
  );
};

export default ExploreNewTrending;