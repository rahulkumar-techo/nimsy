import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { VisibilityOption } from "@/types/upload-video.types";

type Props = {
  visibility: VisibilityOption;
  onSelect: (v: VisibilityOption) => void;
  colors: any;
};

const OPTIONS: { value: VisibilityOption; label: string; description: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: "public", label: "Public", description: "Everyone can watch", icon: "globe-outline" },
  { value: "unlisted", label: "Unlisted", description: "Anyone with the link can watch", icon: "link-outline" },
  { value: "private", label: "Private", description: "Only you can watch", icon: "lock-closed-outline" },
];

export function VisibilityTab({ visibility, onSelect, colors }: Props) {
  return (
    <View style={styles.wrap}>
      {OPTIONS.map((opt) => {
        const isActive = visibility === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onSelect(opt.value)}
            style={[
              styles.option,
              { borderColor: isActive ? colors.accent : colors.border, backgroundColor: isActive ? colors.accent + "15" : colors.surface },
            ]}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrap, { backgroundColor: isActive ? colors.accent + "20" : "transparent" }]}>
              <Ionicons name={opt.icon} size={20} color={isActive ? colors.accent : colors.mutedText} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.text }]}>{opt.label}</Text>
              <Text style={[styles.desc, { color: colors.mutedText }]}>{opt.description}</Text>
            </View>
            <View style={[styles.radio, { borderColor: colors.border }]}>
              {isActive && <View style={[styles.radioFill, { backgroundColor: colors.accent }]} />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { fontSize: 15, fontWeight: "600" },
  desc: { fontSize: 12, marginTop: 2 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioFill: { width: 10, height: 10, borderRadius: 5 },
});
