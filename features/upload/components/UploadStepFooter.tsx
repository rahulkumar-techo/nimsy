import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  isFirst: boolean;
  isLast: boolean;
  nextDisabled?: boolean;
  submitting?: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  colors: any;
};

export function UploadStepFooter({
  isFirst,
  isLast,
  nextDisabled,
  submitting,
  onBack,
  onNext,
  onSubmit,
  colors,
}: Props) {
  return (
    <View style={[styles.row, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
      {!isFirst ? (
        <TouchableOpacity onPress={onBack} style={[styles.backBtn, { borderColor: colors.border }]} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={18} color={colors.text} />
          <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
        </TouchableOpacity>
      ) : (
        <View style={{ width: 1 }} />
      )}

      <TouchableOpacity
        onPress={isLast ? onSubmit : onNext}
        disabled={nextDisabled || submitting}
        style={[styles.nextBtn, { backgroundColor: colors.accent, opacity: nextDisabled || submitting ? 0.5 : 1 }]}
        activeOpacity={0.85}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.nextText}>{isLast ? "Upload" : "Next"}</Text>
            <Ionicons name={isLast ? "cloud-upload-outline" : "chevron-forward"} size={18} color="#fff" />
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  backText: { fontSize: 14, fontWeight: "600" },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
  },
  nextText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
