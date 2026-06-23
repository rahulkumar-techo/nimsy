import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { UploadTab } from "@/types/upload-video.types";

type Props = {
  activeTab: UploadTab;
  onChange: (tab: UploadTab) => void;
  colors: any;
};

const TABS: { key: UploadTab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "details", label: "Details", icon: "document-text-outline" },
  { key: "chapters", label: "Chapters", icon: "list-outline" },
  { key: "visibility", label: "Visibility", icon: "eye-outline" },
  { key: "more", label: "More", icon: "ellipsis-horizontal-outline" },
];

export function UploadTabs({ activeTab, onChange, colors }: Props) {
  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={[
              styles.tab,
              isActive && [styles.activeTab, { borderBottomColor: colors.accent }],
            ]}
            activeOpacity={0.7}
          >
            <Ionicons
              name={tab.icon}
              size={18}
              color={isActive ? colors.accent : colors.mutedText}
            />
            <Text style={[styles.label, { color: isActive ? colors.accent : colors.mutedText }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    gap: 4,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {},
  label: { fontSize: 12, fontWeight: "600" },
});
