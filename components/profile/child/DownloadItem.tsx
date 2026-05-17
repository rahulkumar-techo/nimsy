/**
 * Download Item
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
  type: string;
  size?: string;
};

const DownloadItem = ({
  title,
  type,
  size = "45MB",
}: Props) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      className="mb-4 flex-row items-center justify-between rounded-[28px] p-5"
      style={{ backgroundColor: colors.card }}
    >
      <View className="flex-row items-center">
        <View
          className="h-16 w-16 rounded-2xl"
          style={{ backgroundColor: colors.primaryLight }}
        />

        <View className="ml-4">
          <Text className="text-xl font-bold" style={{ color: colors.text }}>
            {title}
          </Text>

          <Text className="mt-1" style={{ color: colors.secondaryText }}>
            {type} • {size}
          </Text>
        </View>
      </View>

      <View
        className="h-14 w-14 items-center justify-center rounded-full"
        style={{ backgroundColor: colors.primaryLight }}
      >
        <Ionicons
          name="download"
          size={22}
          color={colors.primary}
        />
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(DownloadItem);
