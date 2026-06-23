import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Chapter } from "@/types/upload-video.types";

type Props = {
  chapters: Chapter[];
  onAdd: () => void;
  onUpdate: (id: string, field: "time" | "title", value: string) => void;
  onRemove: (id: string) => void;
  colors: any;
};

export function ChaptersTab({ chapters, onAdd, onUpdate, onRemove, colors }: Props) {
  return (
    <View style={styles.wrap}>
      {chapters.map((chapter) => (
        <View key={chapter.id} style={[styles.row, { borderBottomColor: colors.border }]}>
          <TouchableOpacity
            onPress={() => onUpdate(chapter.id, "time", chapter.time)}
            style={[styles.cell, { borderColor: colors.border, backgroundColor: colors.surface }]}
          >
            <Ionicons name="time-outline" size={16} color={colors.mutedText} />
            <Text style={[styles.cellText, { color: colors.text }]}>{chapter.time || "0:00"}</Text>
          </TouchableOpacity>
          <View style={[styles.cell, { borderColor: colors.border, backgroundColor: colors.surface, flex: 1 }]}>
            <Text style={[styles.cellText, { color: colors.text }]}>{chapter.title || "Chapter title"}</Text>
          </View>
          <TouchableOpacity
            onPress={() => onRemove(chapter.id)}
            style={[styles.cell, { borderColor: colors.border, backgroundColor: colors.surface }]}
          >
            <Ionicons name="trash-outline" size={16} color="#ff4444" />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        onPress={onAdd}
        style={[styles.addBtn, { borderColor: colors.border }]}
        activeOpacity={0.7}
      >
        <Ionicons name="add" size={18} color={colors.accent} />
        <Text style={[styles.addText, { color: colors.accent }]}>Add chapter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  cellText: { fontSize: 14 },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 4,
  },
  addText: { fontSize: 14, fontWeight: "600" },
});
