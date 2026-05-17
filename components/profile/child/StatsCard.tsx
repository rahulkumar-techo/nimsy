/**
 * Stats Card
 */

import React from "react";

import {
  Text,
  View,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  points: string;
  streak: string;
};

const StatsCard = ({
  points,
  streak,
}: Props) => {
  const { colors } = useTheme();

  return (
    <View
      className="mt-8 flex-row items-center justify-between rounded-[32px] px-8 py-7"
      style={{ backgroundColor: colors.primary }}
    >
      <View className="items-center">
        <Text className="text-5xl">
          ⭐
        </Text>

        <Text
          className="mt-2 text-3xl font-black"
          style={{ color: colors.buttonText }}
        >
          {points}
        </Text>

        <Text className="mt-1" style={{ color: colors.buttonText }}>
          Total Points
        </Text>
      </View>

      <View
        className="h-20 w-[1px]"
        style={{ backgroundColor: colors.border }}
      />

      <View className="items-center">
        <Text className="text-5xl">
          🔥
        </Text>

        <Text
          className="mt-2 text-3xl font-black"
          style={{ color: colors.buttonText }}
        >
          {streak}
        </Text>

        <Text className="mt-1" style={{ color: colors.buttonText }}>
          Day Streak
        </Text>
      </View>
    </View>
  );
};

export default React.memo(StatsCard);
