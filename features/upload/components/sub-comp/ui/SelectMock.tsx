import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = { label: string; colors: any };

export const SelectMock = ({ label, colors }: Props) => (
  <TouchableOpacity
    style={[styles.selectMock, { backgroundColor: colors.surface, borderColor: colors.border }]}
    activeOpacity={0.7}
  >
    <Text style={[styles.selectText, { color: colors.secondaryText }]}>{label}</Text>
    <Ionicons name="chevron-down" size={16} color={colors.mutedText} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  selectMock: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  selectText: { flex: 1, fontSize: 14 },
});