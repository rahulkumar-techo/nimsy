/**
 * Achievement Card
 */

import React from "react";

import {
  Text,
  View,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";

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
  const { colors } = useTheme();

  return (
    <View
      className="mr-4 w-40 rounded-[30px] p-5"
      style={{ backgroundColor: colors.card }}
    >
      <Text className="text-5xl">
        {emoji}
      </Text>

      <Text
        className="mt-4 text-xl font-black"
        style={{ color: colors.text }}
      >
        {title}
      </Text>

      <Text className="mt-2" style={{ color: colors.secondaryText }}>
        {subtitle}
      </Text>
    </View>
  );
};

export default React.memo(AchievementCard);
