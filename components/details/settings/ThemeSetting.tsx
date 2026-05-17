/**
 * Theme Setting
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

import SettingsRow from "./SettingsRow";
import { themes, type ThemeType } from "@/constants/themes";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  expanded: boolean;
  onToggle: () => void;
};

const THEMES: {
  id: ThemeType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    id: "light",
    label: "Light",
    icon: "sunny-outline",
  },
  {
    id: "dark",
    label: "Dark",
    icon: "moon-outline",
  },
  {
    id: "ocean",
    label: "Ocean",
    icon: "water-outline",
  },
  {
    id: "sunset",
    label: "Sunset",
    icon: "partly-sunny-outline",
  },
  {
    id: "forest",
    label: "Forest",
    icon: "leaf-outline",
  },
];

const ThemeSetting = ({
  expanded,
  onToggle,
}: Props) => {
  const { theme: selectedTheme, setTheme, colors } = useTheme();

  return (
    <SettingsRow
      title="Theme Settings"
      subtitle="Customize app appearance."
      icon="color-palette-outline"
      expanded={expanded}
      onToggle={onToggle}
    >
      <View className="gap-y-3">
        {THEMES.map((theme) => {
          const isActive =
            selectedTheme === theme.id;

          return (
            <Pressable
              key={theme.id}
              onPress={() =>
                setTheme(theme.id)
              }
              className="flex-row items-center rounded-2xl border px-4 py-4"
              style={{
                backgroundColor: isActive ? colors.primaryLight : colors.background,
                borderColor: isActive ? colors.primary : colors.border,
              }}
            >
              {/* Theme Color */}
              <View
                className="mr-4 h-12 w-12 rounded-2xl"
                style={{
                  backgroundColor:
                    themes[theme.id].colors.primary,
                }}
              />

              {/* Theme Info */}
              <View className="flex-1">
                <Text
                  className="text-base font-semibold"
                  style={{ color: isActive ? colors.primary : colors.text }}
                >
                  {theme.label}
                </Text>

                <Text
                  className="mt-1 text-sm"
                  style={{ color: colors.secondaryText }}
                >
                  {theme.label} theme style
                </Text>
              </View>

              {/* Icon */}
              <Ionicons
                name={theme.icon}
                size={22}
                color={
                  isActive
                    ? colors.primary
                    : colors.secondaryText
                }
              />
            </Pressable>
          );
        })}
      </View>
    </SettingsRow>
  );
};

export default ThemeSetting;
