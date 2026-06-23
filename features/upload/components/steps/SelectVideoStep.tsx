import VideoPreview from "@/features/upload/components/VideoPreview";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  video: { uri: string; name: string; size?: number } | null;
  onPickVideo: () => void;
  colors: any;
};

export function SelectVideoStep({ video, onPickVideo, colors }: Props) {
  if (!video) {
    return (
      <View style={styles.wrap}>
        <TouchableOpacity
          onPress={onPickVideo}
          style={[styles.picker, { backgroundColor: colors.accentSurface, borderColor: colors.accentBorder }]}
          activeOpacity={0.8}
        >
          <Ionicons name="videocam-outline" size={32} color={colors.accent} />
          <Text style={[styles.title, { color: colors.accent }]}>Select a video</Text>
          <Text style={[styles.sub, { color: colors.mutedText }]}>
            Choose a video from your device to get started
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <VideoPreview uri={video.uri} name={video.name} size={video.size} onReplace={onPickVideo} />
      <Text style={[styles.helper, { color: colors.mutedText }]}>
        Looks good? Tap Next to add details, or replace the video above.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingTop: 24, gap: 16 },
  picker: {
    alignItems: "center",
    gap: 8,
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  title: { fontSize: 16, fontWeight: "700", marginTop: 8 },
  sub: { fontSize: 13, textAlign: "center" },
  helper: { fontSize: 13, textAlign: "center" },
});
