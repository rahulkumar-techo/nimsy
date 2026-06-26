import { useTheme } from "@/context/ThemeContext";
import { useVideoUpload } from "@/hooks/useVideoUpload";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MetadataStep } from "@/features/upload/components/steps/MetadataStep";
import { SelectVideoStep } from "@/features/upload/components/steps/SelectVideoStep";
import { ThumbnailStep } from "@/features/upload/components/steps/ThumbnailStep";
import UploadHeader from "@/features/upload/components/UploadHeader";
import { UploadStepFooter } from "@/features/upload/components/UploadStepFooter";
import { UploadStepper } from "@/features/upload/components/UploadStepper";
import { useUploadForm } from "@/features/upload/hooks/useUploadForm";
import { useUploadSteps } from "@/features/upload/hooks/useUploadSteps";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
import UploadProgressScreen from "../components/UploadProgress";

export default function UploadVideoScreen() {
  const { colors } = useTheme();
  const { video, pickVideo } = useVideoUpload();
  const router = useRouter();

  const { step, stepIndex, isFirst, isLast, goNext, goBack } = useUploadSteps();
  const {
    form,
    visibility,
    setVisibility,
    onSubmit,
    status,
    // progress,
    // error,
    // pauseUpload,
    cancelUpload,
  } = useUploadForm(video);

  const loading = status === "UPLOADING" || status === "INITIATED" || status === "INITIALIZING";
  // const message =
  //   status === "PAUSED"
  //     ? "Paused"
  //     : status === "FAILED"
  //       ? "Failed"
  //       : status === "COMPLETED"
  //         ? "Completed"
  //         : status === "CANCELLED"
  //           ? "Cancelled"
  //           : "Uploading...";

  const inputStyle = [
    styles.input,
    { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
  ];

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = form;

  const isNextDisabled = step === "video" && !video;

  const handleNext = async () => {
    if (step === "video") {
      if (!video) return;
      goNext();
      return;
    }

    if (step === "details") {
      const valid = await trigger("title");
      if (!valid) return;
      goNext();
      return;
    }
  };

  const handleCancel = () => {
    cancelUpload();
    router.back();
  };

  // const ProgressStatus = useSelector((state: RootState) => state.uploadUI.status);
  // const showUpload = status !== "IDLE" && status !== "CANCELLED";

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top", "bottom"]}>
      <UploadHeader onClosePress={handleCancel} />

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
                chapters={[]}
                onAddChapter={() => { }}
                onUpdateChapter={() => { }}
                onRemoveChapter={() => { }}
                visibility={visibility === "PUBLIC" ? "public" : visibility === "PRIVATE" ? "private" : "unlisted"}
                onSelectVisibility={(v) => setVisibility(v === "public" ? "PUBLIC" : v === "private" ? "PRIVATE" : "UNLISTED")}
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

      {isSubmitting && <UploadProgressScreen />}
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