/**
 * Reusable channel profile header
 * Avatar, name, username, followers, bio
 *
 * Location: src/components/profile/ProfileHeader.tsx
 */

import React from "react";
import { View, Text, Image } from "react-native";

import { useTheme } from "@/context/ThemeContext";

export default function ProfileHeader() {
  const { colors } = useTheme();

  return (
    <View className="px-4 pt-4" style={{ backgroundColor: colors.background }}>
      <Image
        source={{ uri: "https://i.pravatar.cc/150" }}
        className="h-24 w-24 rounded-full border-4"
      />

      <Text className="mt-3 text-xl font-bold" style={{ color: colors.primaryText }}>
        Rahul Tech
      </Text>

      <Text style={{ color: colors.secondaryText }}>@rahultech</Text>

      <Text className="mt-1" style={{ color: colors.secondaryText }}>
        120K subscribers • 245 contents
      </Text>

      <Text className="mt-2" style={{ color: colors.primaryText }}>
        Building amazing apps with React Native, Expo and AI.
      </Text>
    </View>
  );
}