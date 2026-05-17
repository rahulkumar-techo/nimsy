/**
 * Advanced Category Card
 * Responsive + Horizontal Support
 * React Native + NativeWind
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
import { useTheme } from "@/context/ThemeContext";

type Props = {
  title: string;
  image: string;

  subtitle?: string;
  count?: number;

  onPress?: () => void;

  // layouts
  horizontalSection?: boolean;

  // optional badges
  trending?: boolean;
  premium?: boolean;
};

const CategoryCard = ({
  title,
  image,
  subtitle,
  count,
  onPress,
  horizontalSection = false,
  trending,
  premium,
}: Props) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className={`
        overflow-hidden
        rounded-3xl
        shadow-sm
        border
        
        ${horizontalSection
          ? "mb-4 flex-row"
          : "mr-4 w-44"
        }
      `}
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
      }}
    >
      {/* Image */}
      <View
        className={`
          relative overflow-hidden
          ${horizontalSection
            ? "h-32 w-32"
            : "h-40 w-full"
          }
        `}
      >
        <Image
          source={{ uri: image }}
          className="h-full w-full"
          resizeMode="cover"
        />

        {/* Trending Badge */}
        {trending && (
          <View className="absolute left-3 top-3 flex-row items-center rounded-full bg-red-500 px-3 py-1">
            <Ionicons
              name="flame"
              size={12}
              color="white"
            />

            <Text className="ml-1 text-xs font-bold text-white">
              Trending
            </Text>
          </View>
        )}

        {/* Premium Badge */}
        {premium && (
          <View className="absolute right-3 top-3 rounded-full bg-yellow-400 px-3 py-1">
            <Text className="text-xs font-bold text-black">
              PRO
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View
        className={`
          flex-1 justify-between p-4
        `}
      >
        <View>

          <Text
            numberOfLines={1}
            className="text-lg font-bold"
            style={{ color: colors.text }}
          >
            {title}
          </Text>

          {!!subtitle && (
            <Text
              numberOfLines={2}
              className="mt-1 text-sm"
              style={{ color: colors.secondaryText }}
            >
              {subtitle}
            </Text>
          )}

        </View>

        {/* Footer */}
        <View className="mt-4 flex-row items-center justify-between">

          <Text
            className="text-sm font-medium"
            style={{ color: colors.secondaryText }}
          >
            {count
              ? `${count} stories`
              : "120 stories"}
          </Text>

          {
            horizontalSection && (
              <View
                className="h-9 w-9 items-center justify-center rounded-full"
                style={{ backgroundColor: colors.background }}
              >
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={colors.secondaryText}
                />
              </View>
            )
          }

        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CategoryCard;
