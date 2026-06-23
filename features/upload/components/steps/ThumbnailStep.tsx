import ThumbnailPicker from "@/features/upload/components/ThumbnailPicker";
import { Section } from "@/features/upload/components/sub-comp/ui/Section";
import { StyleSheet, Text, View } from "react-native";

type Props = {

  colors: any;
};

export function ThumbnailStep({ colors }: Props) {
  return (
    <View style={styles.wrap}>
      <Section title="THUMBNAIL" colors={colors}>
        <Text style={[styles.hint, { color: colors.secondaryText }]}>
          Pick a thumbnail that stands out and gives viewers a clear idea of what's in your video.
        </Text>
        <ThumbnailPicker />
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: 8 },
  hint: { fontSize: 13, lineHeight: 20, marginBottom: 14 },
});
