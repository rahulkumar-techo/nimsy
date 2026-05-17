/**
 * Quick Action Item
 */

import React from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const QuickActionItem = ({
  title,
  icon,
}: Props) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      className="mb-4 flex-row items-center justify-between rounded-[28px] p-5"
      style={{ backgroundColor: colors.card }}
    >
      <View className="flex-row items-center">
        <View
          className="mr-4 h-14 w-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: colors.primaryLight }}
        >
          <Ionicons
            name={icon}
            size={24}
            color={colors.primary}
          />
        </View>

        <Text className="text-lg font-bold" style={{ color: colors.text }}>
          {title}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={24}
        color={colors.secondaryText}
      />
    </TouchableOpacity>
  );
};

export default React.memo(QuickActionItem);
