import { useTheme } from "@/context/ThemeContext";
import { useVideoUpload } from "@/hooks/useVideoUpload";
import { UploadTab } from "@/types/upload.types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChaptersTab } from "@/components/create/upload-video/components/tabs/ChaptersTab";
import { DetailsTab } from "@/components/create/upload-video/components/tabs/DetailsTab";
import { MoreTab } from "@/components/create/upload-video/components/tabs/MoreTab";
import { VisibilityTab } from "@/components/create/upload-video/components/tabs/VisibilityTab";
import UploadHeader from "@/components/create/upload-video/UploadHeader";
import UploadProgress from "@/components/create/upload-video/UploadProgress";
import UploadTabs from "@/components/create/upload-video/UploadTabs";
import { UploadProgressCircle } from "@/components/UploadProgressCircle";
import { useUploadForm } from "@/hooks/useUploadForm";



export default function UploadVideoScreen() {
  const { colors } = useTheme();
  const { video, uploadProgress, pickVideo } = useVideoUpload();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<UploadTab>("details");
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const {
    loading, progress, message,
    form,
    visibility, setVisibility,
    chapters, addChapter, updateChapter, removeChapter,
    onSubmit
  } = useUploadForm(video);


  const { control, handleSubmit, formState: { errors, isSubmitting } } = form;

  // ── Animated video collapse on scroll ───────────────────────────────────────

  const scrollY = useMemo(() => new Animated.Value(0), []);


  const inputStyle = [
    styles.input,
    { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
  ];

  // ── handleUpload Video ────────────────────────────────────────────────────────────────────



  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <UploadHeader
        onClose={() => router.back()}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Animated.ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.scroll, { backgroundColor: colors.surface }]}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {/* ── Video pill / picker ── */}
          {!video ? (
            <TouchableOpacity
              onPress={pickVideo}
              style={[styles.topPicker, { backgroundColor: colors.accentSurface, borderColor: colors.accentBorder }]}
              activeOpacity={0.8}
            >
              <Ionicons name="videocam-outline" size={20} color={colors.accent} />
              <Text style={[styles.topPickerText, { color: colors.accent }]}>
                Select a video from your device
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.mutedText} />
            </TouchableOpacity>
          ) : null}

          <UploadTabs activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === "details" && (
            <DetailsTab
              control={control}
              errors={errors}
              inputStyle={inputStyle}
              thumbnail={thumbnail}
              onThumbnailChange={setThumbnail}
              video={video}
              onReplaceVideo={pickVideo}
              colors={colors}
            />
          )}
          {activeTab === "chapters" && (
            <ChaptersTab
              chapters={chapters}
              onAdd={addChapter}
              onUpdate={updateChapter}
              onRemove={removeChapter}
              colors={colors}
            />
          )}
          {activeTab === "visibility" && (
            <VisibilityTab
              visibility={visibility}
              onSelect={setVisibility}
              colors={colors}
            />
          )}
          {activeTab === "more" && (
            <MoreTab control={control} colors={colors} />
          )}

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            style={[styles.uploadBtn, { backgroundColor: colors.accent }]}
            activeOpacity={0.85}
          >
            <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
            <Text style={styles.uploadBtnText}>
              {loading ? <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.8)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <UploadProgressCircle progress={progress} />

                <Text
                  style={{
                    color: "#fff",
                    marginTop: 20,
                    fontSize: 16,
                  }}
                >
                  {message}
                </Text>
              </View> : <Text> Upload</Text>


              }
            </Text>
          </TouchableOpacity>

          <Text style={[styles.tos, { color: colors.mutedText }]}>
            By uploading, you agree to the Terms of Service and Community Guidelines.
          </Text>
        </Animated.ScrollView>
      </KeyboardAvoidingView>

      {uploadProgress !== null && <UploadProgress progress={uploadProgress} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topPicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  topPickerText: { flex: 1, fontSize: 14, fontWeight: "500" },
  scroll: { paddingBottom: 48, gap: 12 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
    marginTop: 8,
    marginHorizontal: 16,
  },
  uploadBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  tos: { fontSize: 11, textAlign: "center", marginTop: 14, lineHeight: 17, paddingHorizontal: 16 },
});