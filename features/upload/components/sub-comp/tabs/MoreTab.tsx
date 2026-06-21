import React from "react";
import { View, StyleSheet } from "react-native";
import { Section }    from "../ui/Section";
import { SwitchRow }  from "../ui/SwitchRow";
import { SelectMock } from "../ui/SelectMock";

type Props = { control: any; colors: any };

export const MoreTab = ({ control, colors }: Props) => (
  <>
    <Section title="AUDIENCE" colors={colors}>
      <SwitchRow
        control={control}
        name="madeForKids"
        label="Made for kids"
        sub="Required by law if content targets children"
        colors={colors}
      />
    </Section>

    <Section title="COMMENTS & RATINGS" colors={colors}>
      <SwitchRow control={control} name="allowComments" label="Allow comments" sub="Viewers can leave comments" colors={colors} />
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <SwitchRow control={control} name="allowRatings" label="Show like count" sub="Viewers can see the like count" colors={colors} />
    </Section>

    <Section title="LICENSE" colors={colors}>
      <SelectMock label="Standard YouTube License" colors={colors} />
    </Section>
  </>
);

const styles = StyleSheet.create({
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 12 },
});