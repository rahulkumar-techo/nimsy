/**
 * Reusable Settings Row
 */

import React from "react";

import {
  Pressable,
  Text,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

export type SettingsIconName =
  keyof typeof Ionicons.glyphMap;

type Props = {
  title: string;
  subtitle: string;
  icon: SettingsIconName;
  expanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
};

const SettingsRow = ({
  title,
  subtitle,
  icon,
  expanded,
  onToggle,
  children,
}: Props) => {
  const { colors } = useTheme();

  return (
    <View
      className="mb-3 overflow-hidden rounded-3xl"
      style={{
        backgroundColor: colors.card,
        shadowColor: colors.shadow,
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        elevation: 2,
      }}
    >
      {/* Header */}
      <Pressable
        onPress={onToggle}
        className="flex-row items-center px-4 py-4"
      >
        <View
          className="mr-4 h-12 w-12 items-center justify-center rounded-2xl"
          style={{ backgroundColor: colors.background }}
        >
          <Ionicons
            name={icon}
            size={22}
            color={colors.text}
          />
        </View>

        <View className="flex-1">
          <Text
            className="text-base font-semibold"
            style={{ color: colors.text }}
          >
            {title}
          </Text>

          <Text
            className="mt-1 text-sm"
            style={{ color: colors.secondaryText }}
          >
            {subtitle}
          </Text>
        </View>

        <Ionicons
          name={
            expanded
              ? "chevron-up"
              : "chevron-down"
          }
          size={20}
          color={colors.secondaryText}
        />
      </Pressable>

      {/* Dropdown */}
      {expanded && (
        <View
          className="border-t px-4 py-4"
          style={{ borderTopColor: colors.border }}
        >
          {children}
        </View>
      )}
    </View>
  );
};

export default SettingsRow;
