/**
 * Reusable Auth Input Component
 */

import React from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

interface AuthInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export default function AuthInput({
  label,
  error,
  ...props
}: AuthInputProps) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </Text>

      <TextInput
        className={`rounded-2xl border bg-white px-4 py-4 text-base dark:bg-zinc-900 dark:text-white ${
          error
            ? "border-red-500"
            : "border-gray-300 dark:border-zinc-700"
        }`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />

      {error ? (
        <Text className="mt-1 text-xs text-red-500">
          {error}
        </Text>
      ) : null}
    </View>
  );
}