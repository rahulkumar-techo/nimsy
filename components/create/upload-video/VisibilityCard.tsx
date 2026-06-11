/**
 * VisibilityCard
 */

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
};

export default function VisibilityCard({ title, description, icon, selected, onPress }: Props) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className="flex-row items-center p-3.5 rounded-xl border mb-2.5 gap-3.5"
      style={{ borderColor: selected ? colors.accent : colors.border, backgroundColor: selected ? colors.accentSurface : colors.surface }}
    >
      <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: selected ? colors.accent : colors.surface }}>
        <Ionicons name={icon} size={20} color={selected ? "#fff" : colors.secondaryText} />
      </View>

      <View className="flex-1">
        <Text className="text-base font-semibold" style={{ color: selected ? colors.accent : colors.text }}>
          {title}
        </Text>
        <Text className="text-xs mt-0.5" style={{ color: colors.secondaryText }}>
          {description}
        </Text>
      </View>

      {selected && <Ionicons name="checkmark-circle" size={22} color={colors.accent} />}
    </TouchableOpacity>
  );
}