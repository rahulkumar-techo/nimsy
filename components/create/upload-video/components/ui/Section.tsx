import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = { title?: string; children: React.ReactNode; colors: any };

export const Section = ({ title, children, colors }: Props) => (
  <View style={[styles.section, { backgroundColor: colors.background, borderColor: colors.border }]}>
    {title && (
      <Text style={[styles.sectionTitle, { color: colors.mutedText }]}>{title}</Text>
    )}
    {children}
  </View>
);

const styles = StyleSheet.create({
  section: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.7,
    marginBottom: 10,
  },
});