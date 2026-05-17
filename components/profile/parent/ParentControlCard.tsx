/**
 * Parent Control Card
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
  subtitle: string;
  status: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const ParentControlCard = ({
  title,
  subtitle,
  status,
  icon,
}: Props) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      className="mb-4 flex-row items-center rounded-[24px] border p-4"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
      }}
    >
      <View
        className="h-14 w-14 items-center justify-center rounded-2xl"
        style={{ backgroundColor: colors.primaryLight }}
      >
        <Ionicons
          name={icon}
          size={26}
          color={colors.primary}
        />
      </View>

      <View className="ml-4 flex-1">
        <View className="flex-row items-start justify-between">
          <Text
            className="flex-1 pr-3 text-lg font-black"
            style={{ color: colors.text }}
          >
            {title}
          </Text>

          <View
            className="rounded-full px-3 py-1"
            style={{ backgroundColor: colors.background }}
          >
            <Text
              className="text-xs font-bold"
              style={{ color: colors.primary }}
            >
              {status}
            </Text>
          </View>
        </View>

        <Text
          className="mt-1 text-sm font-medium"
          style={{ color: colors.secondaryText }}
        >
          {subtitle}
        </Text>
      </View>

      <View
        className="ml-3 h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: colors.background }}
      >
        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.primary}
        />
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(ParentControlCard);
