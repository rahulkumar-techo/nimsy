/**
 * Authentication Footer
 */

import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface AuthFooterProps {
  text: string;
  actionText: string;
  onPress: () => void;
}

export default function AuthFooter({
  text,
  actionText,
  onPress,
}: AuthFooterProps) {
  return (
    <View className="mt-6 flex-row justify-center">
      <Text>{text}</Text>

      <TouchableOpacity onPress={onPress}>
        <Text className="ml-1 font-semibold">
          {actionText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}