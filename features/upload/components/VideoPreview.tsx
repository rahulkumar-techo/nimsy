import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  uri: string;
  name: string;
  size?: number;
  onReplace: () => void;
};

export default function VideoPreview({ uri, name, size, onReplace }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.preview, { backgroundColor: "#000" }]}>
        <Ionicons name="film-outline" size={48} color="#fff" />
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        {typeof size === "number" && (
          <Text style={styles.size}>{(size / (1024 * 1024)).toFixed(1)} MB</Text>
        )}
      </View>
      <TouchableOpacity onPress={onReplace} style={styles.replaceBtn} activeOpacity={0.8}>
        <Ionicons name="refresh-outline" size={16} color="#fff" />
        <Text style={styles.replaceText}>Replace video</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  preview: {
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    gap: 8,
    aspectRatio: 16 / 9,
    justifyContent: "center",
  },
  name: { color: "#fff", fontSize: 14, fontWeight: "600", maxWidth: "100%" },
  size: { color: "#aaa", fontSize: 12 },
  replaceBtn: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  replaceText: { color: "#fff", fontSize: 13, fontWeight: "500" },
});
