import { StyleSheet, Text, View } from "react-native";

type Props = {
  title?: string;
  colors: any;
  children: React.ReactNode;
};

export function Section({ title, colors, children }: Props) {
  return (
    <View style={[styles.wrap, { borderColor: colors.border }]}>
      {title && <Text style={[styles.title, { color: colors.mutedText }]}>{title}</Text>}
      <View style={[styles.content, { backgroundColor: colors.surface }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 14,
  },
  title: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    marginBottom: 6,
    paddingHorizontal: 14,
    marginTop: 14,
  },
  content: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
});
