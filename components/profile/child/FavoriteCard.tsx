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
import { useTheme } from "@/context/ThemeContext";

type Props = {
  title: string;
  image: string;
};

const FavoriteCard = ({
  title,
  image,
}: Props) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      className="mr-4 w-44 overflow-hidden rounded-[28px]"
      style={{ backgroundColor: colors.card }}
    >
      <Image
        source={{
          uri: image,
        }}
        className="h-36 w-full"
      />

      <View className="p-4">
        <Text className="text-lg font-bold" style={{ color: colors.text }}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(FavoriteCard);
