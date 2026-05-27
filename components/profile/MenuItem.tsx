/**
 * Profile Menu Item
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

import {
  Href,
  useRouter,
} from "expo-router";

import { useTheme } from "@/context/ThemeContext";

type Props = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  link?: Href;
  subtitle?: string;
};

const MenuItem = ({
  title,
  icon,
  link,
  subtitle = "Manage settings",
}: Props) => {
  const router = useRouter();

  const { colors } =
    useTheme();

  /**
   * Redirect
   */
  const handleRedirect =
    () => {
      if (!link) return;

      router.push(link);
    };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handleRedirect}
      className="mb-4 flex-row items-center justify-between rounded-[28px] p-5"
      style={{
        backgroundColor:
          colors.card,
      }}
    >
      {/* Left */}
      <View className="flex-row items-center">
        {/* Icon */}
        <View
          className="mr-4 h-16 w-16 items-center justify-center rounded-3xl"
          style={{
            backgroundColor:
              colors.primaryLight,
          }}
        >
          <Ionicons
            name={icon}
            size={28}
            color={
              colors.primary
            }
          />
        </View>

        {/* Content */}
        <View>
          <Text
            className="text-xl font-bold"
            style={{
              color:
                colors.text,
            }}
          >
            {title}
          </Text>

          <Text
            className="mt-1"
            style={{
              color:
                colors.secondaryText,
            }}
          >
            {subtitle}
          </Text>
        </View>
      </View>

      {/* Arrow */}
      <Ionicons
        name="chevron-forward"
        size={24}
        color={
          colors.secondaryText
        }
      />
    </TouchableOpacity>
  );
};

export default MenuItem;