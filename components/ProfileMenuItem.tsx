/**
 * Reusable Profile Menu Item Card
 */

import React from "react";

import {
  Image,
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

import {
  useTheme,
} from "@/context/ThemeContext";

type Props = {
  title: string;
  subtitle?: string;

  thumbnail?: string;

  icon: keyof typeof Ionicons.glyphMap;

  iconColor?: string;

  rightText?: string;

  link?: Href;

  onPress?: () => void;

  danger?: boolean;
};

const ProfileMenuItem = ({
  title,
  subtitle,
  thumbnail,
  icon,
  iconColor,
  rightText,
  link,
  onPress,
  danger = false,
}: Props) => {
  const router = useRouter();

  const { colors } = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    if (link) {
      router.push(link);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      className="mb-4"
    >
      <View
        className="rounded-[28px] overflow-hidden"
        style={{
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        {/* Thumbnail */}
        {thumbnail && (
          <Image
            source={{
              uri: thumbnail,
            }}
            className="w-full h-44"
          />
        )}

        {/* Content */}
        <View className="p-4 flex-row items-center justify-between">
          {/* Left */}
          <View className="flex-row items-center flex-1">
            <View
              className="w-14 h-14 rounded-2xl items-center justify-center"
              style={{
                backgroundColor: `${
                  iconColor || colors.primary
                }15`,
              }}
            >
              <Ionicons
                name={icon}
                size={24}
                color={
                  danger
                    ? "#EF4444"
                    : iconColor || colors.primary
                }
              />
            </View>

            <View className="ml-4 flex-1">
              <Text
                numberOfLines={1}
                className="text-lg font-bold"
                style={{
                  color: danger
                    ? "#EF4444"
                    : colors.text,
                }}
              >
                {title}
              </Text>

              {subtitle && (
                <Text
                  numberOfLines={2}
                  className="text-sm mt-1"
                  style={{
                    color: colors.secondaryText,
                  }}
                >
                  {subtitle}
                </Text>
              )}
            </View>
          </View>

          {/* Right */}
          <View className="items-end">
            {rightText && (
              <Text
                className="text-sm font-semibold mb-1"
                style={{
                  color: colors.secondaryText,
                }}
              >
                {rightText}
              </Text>
            )}

            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.secondaryText}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(ProfileMenuItem);