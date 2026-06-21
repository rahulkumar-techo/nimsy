import ChapterRow from "@/features/upload/components/ChapterRow";
import { Chapter } from "@/types/upload-video.types";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Section } from "../ui/Section";

type Props = {
  chapters: Chapter[];
  onAdd: () => void;
  onUpdate: (id: string, field: "time" | "title", value: string) => void;
  onRemove: (id: string) => void;
  colors: any;
};

export const ChaptersTab = ({ chapters, onAdd, onUpdate, onRemove, colors }: Props) => (
  <Section title="CHAPTERS" colors={colors}>
    <Text style={[styles.hint, { color: colors.secondaryText }]}>
      Add at least 3 chapters starting at 0:00. Chapters let viewers jump to sections of your video.
    </Text>

    {chapters.map((ch) => (
      <ChapterRow
        key={ch.id}
        time={ch.time}
        title={ch.title}
        onTimeChange={(v) => onUpdate(ch.id, "time", v)}
        onTitleChange={(v) => onUpdate(ch.id, "title", v)}
        onDelete={() => onRemove(ch.id)}
      />
    ))}

    <TouchableOpacity onPress={onAdd} style={styles.addBtn} activeOpacity={0.7}>
      <Ionicons name="add-circle-outline" size={20} color={colors.accent} />
      <Text style={[styles.addText, { color: colors.accent }]}>Add chapter</Text>
    </TouchableOpacity>
  </Section>
);

const styles = StyleSheet.create({
  hint:    { fontSize: 13, lineHeight: 20, marginBottom: 14 },
  addBtn:  { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  addText: { fontSize: 14, fontWeight: "600" },
});
