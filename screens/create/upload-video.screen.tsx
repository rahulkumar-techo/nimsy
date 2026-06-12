import React, { useRef, useState } from "react";
import {
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Animated,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { useVideoUpload } from "@/hooks/useVideoUpload";
import { useRouter } from "expo-router";
import { UploadTab } from "@/types/upload.types";

import UploadHeader from "@/components/create/upload-video/UploadHeader";
import UploadProgress from "@/components/create/upload-video/UploadProgress";
import { useUploadForm } from "@/components/create/upload-video/hook/useUploadForm";
import { DetailsTab } from "@/components/create/upload-video/components/tabs/DetailsTab";
import { ChaptersTab } from "@/components/create/upload-video/components/tabs/ChaptersTab";
import { VisibilityTab } from "@/components/create/upload-video/components/tabs/VisibilityTab";
import { MoreTab } from "@/components/create/upload-video/components/tabs/MoreTab";
import UploadTabs from "@/components/create/upload-video/UploadTabs";



export default function UploadVideoScreen() {
  const { colors } = useTheme();
  const { video, uploadProgress, pickVideo, updateProgress } = useVideoUpload();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<UploadTab>("details");
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const {
    form,
    visibility, setVisibility,
    chapters, addChapter, updateChapter, removeChapter,
  } = useUploadForm(video);


  const { control, handleSubmit, formState: { errors, isSubmitting } } = form;

  // ── Animated video collapse on scroll ───────────────────────────────────────

  const scrollY = useRef(new Animated.Value(0)).current;


  const inputStyle = [
    styles.input,
    { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
  ];

  // ── handleUpload Video ────────────────────────────────────────────────────────────────────

const handleUpload = handleSubmit(async (data) => {
  if (!video) {
    Alert.alert("No Video", "Please select a video first.");
    return;
  }

  try {
    updateProgress(0);
    console.log("Form Data:=============>", data);
    console.log("Video:", video);
    console.log("Thumbnail:", thumbnail);
    console.log("Visibility:", visibility);
    console.log("Chapters:", chapters);

    updateProgress(null);

    // router.push("/upload");

  } catch (err: any) {
    updateProgress(null);

    Alert.alert(
      "Upload Failed",
      err?.message ?? "Something went wrong."
    );
  }
});

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
          onPress={handleUpload}
            disabled={isSubmitting}
            style={[styles.uploadBtn, { backgroundColor: colors.accent }]}
            activeOpacity={0.85}
          >
            <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
            <Text style={styles.uploadBtnText}>
              {isSubmitting ? "Uploading…" : "Upload Video"}
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