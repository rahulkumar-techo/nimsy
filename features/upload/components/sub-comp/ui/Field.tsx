import { StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  error?: string;
  hint?: string;
  colors: any;
  children: React.ReactNode;
};

export function Field({ label, error, hint, colors, children }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      {hint && <Text style={[styles.hint, { color: colors.mutedText }]}>{hint}</Text>}
      <View style={styles.inputWrap}>{children}</View>
      {error && <Text style={[styles.error, { color: "#ff4444" }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 4 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  hint: { fontSize: 12, marginBottom: 6 },
  inputWrap: {},
  error: { fontSize: 12, marginTop: 4 },
});
