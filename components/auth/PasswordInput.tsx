/**
 * Password Input Component
 */

import React, { useState } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

import { Eye, EyeOff } from "lucide-react-native";

interface PasswordInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export default function PasswordInput({
  label,
  error,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] =
    useState(false);

  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </Text>

      <View
        className={`flex-row items-center rounded-2xl border bg-white px-4 dark:bg-zinc-900 ${
          error
            ? "border-red-500"
            : "border-gray-300 dark:border-zinc-700"
        }`}
      >
        <TextInput
          secureTextEntry={!showPassword}
          className="flex-1 py-4 text-base dark:text-white"
          placeholderTextColor="#9CA3AF"
          {...props}
        />

        <TouchableOpacity
          onPress={() =>
            setShowPassword(!showPassword)
          }
        >
          {showPassword ? (
            <EyeOff size={22} />
          ) : (
            <Eye size={22} />
          )}
        </TouchableOpacity>
      </View>

      {error && (
        <Text className="mt-1 text-xs text-red-500">
          {error}
        </Text>
      )}
    </View>
  );
}