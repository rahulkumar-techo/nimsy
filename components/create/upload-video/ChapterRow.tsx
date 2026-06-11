/**
 * ChapterRow
 */

import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  time: string;
  title: string;
  onTimeChange: (v: string) => void;
  onTitleChange: (v: string) => void;
  onDelete: () => void;
};

export default function ChapterRow({ time, title, onTimeChange, onTitleChange, onDelete }: Props) {
  const { colors } = useTheme();

  const inputBaseStyle = {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    color: colors.text,
  };

  return (
    <View className="flex-row items-center mb-2.5 gap-2">
      <TextInput
        value={time}
        onChangeText={onTimeChange}
        placeholder="0:00"
        placeholderTextColor={colors.mutedText}
        keyboardType="numbers-and-punctuation"
        className="border rounded-xl px-2.5 py-2.5 text-sm w-16 text-center"
        style={inputBaseStyle}
      />
      <TextInput
        value={title}
        onChangeText={onTitleChange}
        placeholder="Chapter title"
        placeholderTextColor={colors.mutedText}
        className="border rounded-xl px-2.5 py-2.5 text-sm flex-1"
        style={inputBaseStyle}
      />
      <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="trash-outline" size={20} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );
}