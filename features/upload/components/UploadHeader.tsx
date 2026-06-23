/**
 * Upload header component.
 * Shows title, subtitle and optional back/close actions.
 */

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface UploadHeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  showCloseButton?: boolean;
  onBackPress?: () => void;
  onClosePress?: () => void;
}

export default function UploadHeader({
  title = "Upload Video",
  subtitle,
  showBackButton = true,
  showCloseButton = false,
  onBackPress,
  onClosePress,
}: UploadHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) return onBackPress();
    router.back();
  };

  return (
    <View className="flex-row items-center justify-between px-4 py-3 border-b border-neutral-800 bg-black">
      <View className="w-10">
        {showBackButton && (
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-1 items-center px-4">
        <Text
          className="text-white text-lg font-semibold"
          numberOfLines={1}
        >
          {title}
        </Text>

        {subtitle && (
          <Text
            className="text-neutral-400 text-sm mt-1"
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>

      <View className="w-10 items-end">
        {showCloseButton && (
          <TouchableOpacity onPress={onClosePress}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}