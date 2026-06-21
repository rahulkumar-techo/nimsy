import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";

type Props = {
  control: any;
  name: "madeForKids" | "allowComments" | "allowRatings";
  label: string;
  sub?: string;
  colors: any;
};

export const SwitchRow = ({ control, name, label, sub, colors }: Props) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { value, onChange } }) => (
      <View style={styles.switchRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.switchLabel, { color: colors.text }]}>{label}</Text>
          {sub && (
            <Text style={[styles.switchSub, { color: colors.secondaryText }]}>{sub}</Text>
          )}
        </View>
        <Switch
          value={value}
          onValueChange={onChange}
          trackColor={{ false: colors.border, true: colors.accent }}
          thumbColor="#fff"
        />
      </View>
    )}
  />
);

const styles = StyleSheet.create({
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  switchLabel: { fontSize: 14, fontWeight: "600" },
  switchSub:   { fontSize: 12, marginTop: 2 },
});