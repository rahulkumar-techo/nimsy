import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  colors: any;
};

export const Field = ({ label, hint, error, children, colors }: Props) => (
  <View style={styles.field}>
    <Text style={[styles.fieldLabel, { color: colors.primaryText }]}>{label}</Text>
    {hint && <Text style={[styles.fieldHint, { color: colors.secondaryText }]}>{hint}</Text>}
    {children}
    {error && <Text style={styles.fieldError}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  field:      { marginBottom: 14 },
  fieldLabel: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  fieldHint:  { fontSize: 12, marginBottom: 6, lineHeight: 17 },
  fieldError: { fontSize: 12, color: "#DC2626", marginTop: 4 },
});