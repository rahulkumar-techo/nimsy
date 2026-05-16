/**
 * Achievement Card
 */

import React from "react";

import {
  Text,
  View,
} from "react-native";

type Props = {
  title: string;
  subtitle: string;
  emoji: string;
};

const AchievementCard = ({
  title,
  subtitle,
  emoji,
}: Props) => {
  return (
    <View className="mr-4 w-40 rounded-[30px] bg-white p-5">
      <Text className="text-5xl">
        {emoji}
      </Text>

      <Text className="mt-4 text-xl font-black text-slate-900">
        {title}
      </Text>

      <Text className="mt-2 text-slate-500">
        {subtitle}
      </Text>
    </View>
  );
};

export default React.memo(AchievementCard);
