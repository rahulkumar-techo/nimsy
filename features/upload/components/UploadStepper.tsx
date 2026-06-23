import { StyleSheet, Text, View } from "react-native";

const LABELS = ["Video", "Details", "Thumbnail"];

type Props = {
  stepIndex: number;
  colors: any;
};

export function UploadStepper({ stepIndex, colors }: Props) {
  return (
    <View style={styles.row}>
      {LABELS.map((label, i) => {
        const isActive = i === stepIndex;
        const isDone = i < stepIndex;
        const isFilled = isActive || isDone;

        return (
          <View key={label} style={styles.stepWrap}>
            <View style={styles.stepRow}>
              <View style={[styles.dot, { backgroundColor: isFilled ? colors.accent : colors.border }]}>
                <Text style={[styles.dotText, { color: isFilled ? "#fff" : colors.mutedText }]}>{i + 1}</Text>
              </View>
              {i < LABELS.length - 1 && (
                <View style={[styles.line, { backgroundColor: isDone ? colors.accent : colors.border }]} />
              )}
            </View>
            <Text
              style={[
                styles.label,
                { color: isActive ? colors.text : colors.mutedText, fontWeight: isActive ? "700" : "500" },
              ]}
            >
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 },
  stepWrap: { flex: 1, alignItems: "center" },
  stepRow: { flexDirection: "row", alignItems: "center" },
  dot: { width: 24, height: 24, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  dotText: { fontSize: 12, fontWeight: "700" },
  line: { flex: 1, height: 2, marginHorizontal: 4 },
  label: { fontSize: 11, marginTop: 6 },
});
