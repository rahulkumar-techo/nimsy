/**
 * ThumbnailPicker
 */

import React from "react";
import * as DocumentPicker from "expo-document-picker";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  thumbnail: string | null;
  onChange: (uri: string) => void;
};

export default function ThumbnailPicker({ thumbnail, onChange }: Props) {
  const { colors } = useTheme();

  const pick = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "image/*",
      copyToCacheDirectory: true,
    });
    if (!result.canceled) onChange(result.assets[0].uri);
  };

  return (
    <View className="mb-1">
      <View className="flex-row gap-2.5">
        {/* Auto-generated placeholder */}
        <View className="flex-1 aspect-video rounded-xl border items-center justify-center overflow-hidden gap-1" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <Ionicons name="film-outline" size={24} color={colors.mutedText} />
          <Text className="text-xs font-semibold" style={{ color: colors.mutedText }}>Auto</Text>
        </View>

        {/* Custom */}
        <TouchableOpacity
          onPress={pick}
          className="flex-1 aspect-video rounded-xl border items-center justify-center overflow-hidden"
          style={{ backgroundColor: colors.surface, borderColor: thumbnail ? colors.accent : colors.border }}
          activeOpacity={0.7}
        >
          {thumbnail ? (
            <Image source={{ uri: thumbnail }} style={StyleSheet.absoluteFill} resizeMode="cover" />
          ) : (
            <>
              <Ionicons name="add-circle-outline" size={26} color={colors.accent} />
              <Text className="text-xs font-semibold" style={{ color: colors.accent }}>Custom</Text>
            </>
          )}
        </TouchableOpacity>

        {/* AI-generated placeholder */}
        <View className="flex-1 aspect-video rounded-xl border items-center justify-center overflow-hidden gap-1" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <Ionicons name="sparkles-outline" size={24} color={colors.secondaryText} />
          <Text className="text-xs font-semibold" style={{ color: colors.secondaryText }}>AI</Text>
        </View>
      </View>
    </View>
  );
}