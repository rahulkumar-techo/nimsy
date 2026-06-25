import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function EditVideoScreen() {
  return (
    <View style={styles.safe}>
      <View style={styles.center}>
        <Ionicons name="create-outline" size={48} color="#888" />
        <Text style={styles.text}>Edit Video</Text>
        <Text style={styles.sub}>Edit video screen coming soon.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  text: { color: "#fff", fontSize: 18, fontWeight: "700" },
  sub: { color: "#888", fontSize: 14 },
});
