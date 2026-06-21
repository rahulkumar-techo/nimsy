/**
 * Reusable Auth Button
 */

import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";

interface AuthButtonProps {
  title: string;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

export default function AuthButton({
  title,
  loading,
  disabled,
  onPress,
}: AuthButtonProps) {
  return (
    <TouchableOpacity
      disabled={loading || disabled}
      onPress={onPress}
      className="items-center rounded-2xl bg-black py-4 dark:bg-white"
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text className="font-semibold text-white dark:text-black">
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}