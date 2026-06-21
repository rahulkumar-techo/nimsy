/**
 * Social Auth Button
 */

import React from "react";
import {
  Text,
  TouchableOpacity,
} from "react-native";

interface SocialButtonProps {
  title: string;
  onPress: () => void;
}

export default function SocialButton({
  title,
  onPress,
}: SocialButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-center rounded-2xl border border-gray-300 py-4"
    >
      <Text className="font-medium">
        {title}
      </Text>
    </TouchableOpacity>
  );
}