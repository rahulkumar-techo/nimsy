/**
 * Favorite Card
 */

import React from "react";

import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  title: string;
  image: string;
};

const FavoriteCard = ({
  title,
  image,
}: Props) => {
  return (
    <TouchableOpacity className="mr-4 w-44 overflow-hidden rounded-[28px] bg-white">
      <Image
        source={{
          uri: image,
        }}
        className="h-36 w-full"
      />

      <View className="p-4">
        <Text className="text-lg font-bold text-slate-900">
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(FavoriteCard);
