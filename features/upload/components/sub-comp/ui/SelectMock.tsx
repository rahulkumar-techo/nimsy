import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  label: string;
  colors: any;
};

export function SelectMock({ label, colors }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.7} style={[styles.select, { borderColor: colors.border, backgroundColor: colors.surface }]}>
      <Text style={[styles.text, { color: colors.mutedText }]}>{label}</Text>
      <Text style={[styles.chevron, { color: colors.mutedText }]}>▼</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  select: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  text: { fontSize: 14 },
  chevron: { fontSize: 12, fontWeight: "700" },
});
