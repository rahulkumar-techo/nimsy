import { useTheme } from "@/context/ThemeContext";
import { useVideoUpload } from "@/hooks/useVideoUpload";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MetadataStep } from "@/features/upload/components/steps/MetadataStep";
import { SelectVideoStep } from "@/features/upload/components/steps/SelectVideoStep";
import { ThumbnailStep } from "@/features/upload/components/steps/ThumbnailStep";
import { UploadLoadingOverlay } from "@/features/upload/components/UploadLoadingOverlay";
import UploadHeader from "@/features/upload/components/UploadHeader";
import UploadProgress from "@/features/upload/components/UploadProgress";
import { UploadStepFooter } from "@/features/upload/components/UploadStepFooter";
import { UploadStepper } from "@/features/upload/components/UploadStepper";
import { useUploadForm } from "@/features/upload/hooks/useUploadForm";
import { useUploadSteps } from "@/features/upload/hooks/useUploadSteps";
import { useImagePicker } from "../hooks/use-pickThumbnail";

export default function UploadVideoScreen() {
  const { colors } = useTheme();
  const { video, uploadProgress, pickVideo } = useVideoUpload();
  const router = useRouter();
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const { step, stepIndex, isFirst, isLast, goNext, goBack } = useUploadSteps();

  const {
    loading, progress, message,
    form,
    visibility, setVisibility,
    chapters, addChapter, updateChapter, removeChapter,
    onSubmit,
  } = useUploadForm(video);



  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = form;

  const inputStyle = [
    styles.input,
    { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
  ];

  // ── Step navigation ──────────────────────────────────────────────────────

  const isNextDisabled = step === "video" && !video;

  const handleNext = async () => {
    if (step === "video") {
      if (!video) return;
      goNext();
      return;
    }

    if (step === "details") {
      // Only block on the required field — chapters/visibility/more stay optional.
      const valid = await trigger("title");
      if (!valid) return;
      goNext();
      return;
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top", "bottom"]}>
      <UploadHeader onClosePress={() => router.back()} />

      <UploadStepper stepIndex={stepIndex} colors={colors} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={{ flex: 1 }}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[styles.scroll, { backgroundColor: colors.surface }]}
            showsVerticalScrollIndicator={false}
          >
            {step === "video" && <SelectVideoStep video={video} onPickVideo={pickVideo} colors={colors} />}

            {step === "details" && (
              <MetadataStep
                control={control}
                errors={errors}
                inputStyle={inputStyle}
                video={video}
                onReplaceVideo={pickVideo}
                chapters={chapters}
                onAddChapter={addChapter}
                onUpdateChapter={updateChapter}
                onRemoveChapter={removeChapter}
                visibility={visibility}
                onSelectVisibility={setVisibility}
                colors={colors}
              />
            )}

            {step === "thumbnail" && <ThumbnailStep colors={colors} />}

            {isLast && (
              <Text style={[styles.tos, { color: colors.mutedText }]}>
                By uploading, you agree to the Terms of Service and Community Guidelines.
              </Text>
            )}
          </ScrollView>

          <UploadStepFooter
            isFirst={isFirst}
            isLast={isLast}
            nextDisabled={isNextDisabled}
            submitting={isSubmitting || loading}
            onBack={goBack}
            onNext={handleNext}
            onSubmit={handleSubmit(onSubmit)}
            colors={colors}
          />
        </View>
      </KeyboardAvoidingView>

      {uploadProgress !== null && <UploadProgress progress={uploadProgress} />}
      {loading && <UploadLoadingOverlay progress={progress} message={message} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 32, gap: 12, flexGrow: 1 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  tos: { fontSize: 11, textAlign: "center", marginTop: 14, lineHeight: 17, paddingHorizontal: 16 },
});

/*
<UploadHeader
  title="Create Upload"
  subtitle="Step 1: Select Video"
/>

<UploadProgress
  currentStep={1}
  totalSteps={2}
  progress={50}
/>

*/ 