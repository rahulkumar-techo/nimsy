/**
 * Authentication Header
 */

import React from "react";
import {
  Text,
  View,
} from "react-native";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({
  title,
  subtitle,
}: AuthHeaderProps) {
  return (
    <View className="mb-10">
      <Text className="mb-2 text-3xl font-bold text-black dark:text-white">
        {title}
      </Text>

      <Text className="text-gray-500">
        {subtitle}
      </Text>
    </View>
  );
}