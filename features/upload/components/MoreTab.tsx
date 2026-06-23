import { StyleSheet, Switch, Text, View } from "react-native";
import { Controller } from "react-hook-form";

type Props = {
  control: any;
  colors: any;
};

export function MoreTab({ control, colors }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.label, { color: colors.text }]}>Made for kids</Text>
          <Text style={[styles.desc, { color: colors.mutedText }]}>This content is suitable for children.</Text>
        </View>
        <Controller
          control={control}
          name="madeForKids"
          render={({ field: { value, onChange } }) => (
            <Switch value={value} onValueChange={onChange} trackColor={{ true: colors.accent, false: colors.border }} />
          )}
        />
      </View>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.label, { color: colors.text }]}>Allow comments</Text>
        </View>
        <Controller
          control={control}
          name="allowComments"
          render={({ field: { value, onChange } }) => (
            <Switch value={value} onValueChange={onChange} trackColor={{ true: colors.accent, false: colors.border }} />
          )}
        />
      </View>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.label, { color: colors.text }]}>Allow ratings</Text>
        </View>
        <Controller
          control={control}
          name="allowRatings"
          render={({ field: { value, onChange } }) => (
            <Switch value={value} onValueChange={onChange} trackColor={{ true: colors.accent, false: colors.border }} />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingVertical: 12 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 8,
  },
  label: { fontSize: 15, fontWeight: "600" },
  desc: { fontSize: 12, marginTop: 2 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 4 },
});
