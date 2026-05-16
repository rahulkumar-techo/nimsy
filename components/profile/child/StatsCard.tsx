/**
 * Stats Card
 */

import React from "react";

import {
  Text,
  View,
} from "react-native";

type Props = {
  points: string;
  streak: string;
};

const StatsCard = ({
  points,
  streak,
}: Props) => {
  return (
    <View className="mt-8 flex-row items-center justify-between rounded-[32px] bg-violet-600 px-8 py-7">
      <View className="items-center">
        <Text className="text-5xl">
          ⭐
        </Text>

        <Text className="mt-2 text-3xl font-black text-white">
          {points}
        </Text>

        <Text className="mt-1 text-violet-100">
          Total Points
        </Text>
      </View>

      <View className="h-20 w-[1px] bg-violet-300" />

      <View className="items-center">
        <Text className="text-5xl">
          🔥
        </Text>

        <Text className="mt-2 text-3xl font-black text-white">
          {streak}
        </Text>

        <Text className="mt-1 text-violet-100">
          Day Streak
        </Text>
      </View>
    </View>
  );
};

export default React.memo(StatsCard);
