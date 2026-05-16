/**
 * Collection Card Component
 */

import React from "react";

import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  item: {
    title: string;
    items: string;
    image: string;
    color: string;
  };
};

const CollectionCard = ({
  item,
}: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      className={`mr-4 w-64 overflow-hidden rounded-[30px] ${item.color}`}
    >
      <Image
        source={{
          uri: item.image,
        }}
        className="h-40 w-full"
        resizeMode="cover"
      />

      <View className="p-5">
        <Text className="text-2xl font-bold text-slate-900">
          {item.title}
        </Text>

        <Text className="mt-1 text-slate-500">
          {item.items}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(
  CollectionCard
);