/**
 * Recent Viewed Card
 */

import React from "react";

import {
  Image,
  Text,
  View,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  title: string;
  progress: string;
  image: string;
};

const RecentViewedCard = ({
  title,
  progress,
  image,
}: Props) => {
  const { colors } = useTheme();

  return (
    <View className="mr-4 w-44">
      <Image
        source={{
          uri: image,
        }}
        className="h-40 w-full rounded-[28px]"
      />

      <Text className="mt-3 text-xl font-bold" style={{ color: colors.text }}>
        {title}
      </Text>

      <Text className="mt-1" style={{ color: colors.secondaryText }}>
        {progress}
      </Text>
    </View>
  );
};

export default React.memo(RecentViewedCard);
