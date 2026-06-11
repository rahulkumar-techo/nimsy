/**
 * UploadTabs — underline-style tab bar
 */

import { useTheme } from "@/context/ThemeContext";
import { UploadTab } from "@/types/upload.types";
import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";


const TABS: { id: UploadTab; label: string }[] = [
  { id: "details",    label: "Details"    },
  { id: "chapters",   label: "Chapters"   },
  { id: "visibility", label: "Visibility" },
  { id: "more",       label: "More"       },
];

type Props = {
  activeTab: UploadTab;
  onChange: (tab: UploadTab) => void;
};

export default function UploadTabs({ activeTab, onChange }: Props) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.bar, { backgroundColor: colors.background, borderBottomColor: colors.border }]}
      contentContainerStyle={styles.content}
    >
      {TABS.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onChange(tab.id)}
            style={[
              styles.tab,
              active
                ? { borderBottomColor: colors.accent }
                : { borderBottomColor: "transparent" },
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                { color: active ? colors.accent : colors.secondaryText },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bar: {
    maxHeight: 46,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  content: {
    paddingHorizontal: 16,
  },
  tab: {
    marginRight: 24,
    paddingVertical: 12,
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});