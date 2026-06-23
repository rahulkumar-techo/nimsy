import { UploadProgressCircle } from "@/components/UploadProgressCircle";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  progress: number;
  message: string;
};

// Was previously rendered *inside* a <Text> as a <View> in the upload
// button — invalid in React Native and would never display correctly.
// Rendered here as a proper full-screen sibling overlay instead.
export function UploadLoadingOverlay({ progress, message }: Props) {
  return (
    <View style={styles.overlay} pointerEvents="auto">
      <UploadProgressCircle progress={progress} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
  },
  message: { color: "#fff", marginTop: 20, fontSize: 16 },
});
