import { useTheme } from "@/context/ThemeContext";
import { UploadTab } from "@/types/upload.types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Animated,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChaptersTab } from "@/components/create/upload-video/components/tabs/ChaptersTab";
import { DetailsTab } from "@/components/create/upload-video/components/tabs/DetailsTab";
import { MoreTab } from "@/components/create/upload-video/components/tabs/MoreTab";
import { VisibilityTab } from "@/components/create/upload-video/components/tabs/VisibilityTab";
import UploadHeader from "@/components/create/upload-video/UploadHeader";
import UploadTabs from "@/components/create/upload-video/UploadTabs";
import { useUploadForm } from "@/features/upload/hooks/useUploadForm";

export default function EditVideoScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const videoId = params.id as string;
  
  const [activeTab, setActiveTab] = useState<UploadTab>("details");

  const {
    form,
    visibility, setVisibility,
    chapters, addChapter, updateChapter, removeChapter,
  } = useUploadForm(null);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = form;

  const [scrollY] = useState(() => new Animated.Value(0));

  const inputStyle = [
    styles.input,
    { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
  ];

  useEffect(() => {
    if (videoId) {
      console.log("Fetching video:", videoId);
    }
  }, [videoId]);

  const handleSave = async (data: any) => {
    if (!videoId) {
      Alert.alert("Error", "No video ID provided");
      return;
    }
    try {
      console.log("Saving video changes:", {
        videoId,
        formData: data,
        visibility,
        chapters,
      });
      Alert.alert("Success", "Video updated successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Update Failed", error?.message ?? "Something went wrong.");
    }
  };

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
          <Text style={[styles.videoLabel, { color: colors.mutedText }]}>
            Video ID: {videoId}
          </Text>

          <UploadTabs activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === "details" && (
            <DetailsTab
              control={control}
              errors={errors}
              inputStyle={inputStyle}
              thumbnail={null}
              onThumbnailChange={() => {}}
              video={null}
              onReplaceVideo={() => {}}
              colors={colors}
              showVideoPreview={false}
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
            onPress={handleSubmit(handleSave)}
            disabled={isSubmitting}
            style={[styles.saveBtn, { backgroundColor: colors.accent }]}
            activeOpacity={0.85}
          >
            <Ionicons name="save-outline" size={20} color="#fff" />
            <Text style={styles.saveBtnText}>
              {isSubmitting ? "Saving…" : "Save Changes"}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.tos, { color: colors.mutedText }]}>
            Changes to video settings will be applied immediately.
          </Text>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  videoLabel: { fontSize: 12, paddingHorizontal: 16, paddingTop: 12 },
  scroll: { paddingBottom: 48, gap: 12 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
    marginTop: 8,
    marginHorizontal: 16,
  },
  saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  tos: { fontSize: 11, textAlign: "center", marginTop: 14, lineHeight: 17, paddingHorizontal: 16 },
});