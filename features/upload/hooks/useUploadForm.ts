import { z } from "zod";
import { useState } from "react";
import { Alert } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Chapter, SelectedVideo, VisibilityOption } from "../types/upload.types";
import { uploadSchema } from "../validators/upload.schema";
import { uploadVideoFlow } from "../services/upload.service";
import { startUploadPolling } from "../utils/upload-polling.util";

/**
 * Manage video upload form state and workflow.
 *
 * Responsibilities:
 * - Handle form validation with React Hook Form + Zod.
 * - Manage video visibility settings.
 * - Manage video chapters.
 * - Execute the upload process.
 * - Track upload progress and status messages.
 * - Poll the server until video processing is completed.
 *
 * Example:
 * const {
 *   form,
 *   progress,
 *   loading,
 *   onSubmit,
 * } = useUploadForm(video);
 */

export type FormData = z.infer<typeof uploadSchema>;

export function useUploadForm(video: SelectedVideo | null) {
  const [visibility, setVisibility] =
    useState<VisibilityOption>("public");

  const [chapters, setChapters] = useState<Chapter[]>([
    { id: "1", time: "0:00", title: "Intro" },
  ]);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: "",
      madeForKids: false,
      allowComments: true,
      allowRatings: true,
    },
  });
  // Add a new empty chapter
  const addChapter = () =>
    setChapters((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        time: "0:00",
        title: "",
      },
    ]);
  // Update a new empty chapter
  const updateChapter = (
    id: string,
    field: "time" | "title",
    value: string
  ) =>
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === id
          ? { ...chapter, [field]: value }
          : chapter
      )
    );
  // remove a new empty chapter
  const removeChapter = (id: string) =>
    setChapters((prev) =>
      prev.filter((chapter) => chapter.id !== id)
    );
  // Submit form and start upload workflow
  const onSubmit = async (data: FormData) => {
    if (!video) {
      Alert.alert(
        "No Video",
        "Please select a video."
      );
      return;
    }

    try {
      setLoading(true);
      setProgress(0);

      const { upload } = await uploadVideoFlow({
        video,
        metadata: {
          title: data.title,
          description: data.description,
          fileName: video.name,
          mimeType: video.mimeType,
          fileSize: video.size,
        },
        onProgress: (progress, _, message) => {
          setProgress(progress);
          setMessage(message);
        },
      });

      startUploadPolling(upload.videoId, (status) => {
        setMessage(status.status);
        if (status.isCompleted) {
          setProgress(100);
          Alert.alert(
            "Success",
            "Video processing completed."
          );
        }
      });
    } catch (error) {
      Alert.alert(
        "Upload Failed",
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    form,

    visibility,
    setVisibility,

    chapters,
    addChapter,
    updateChapter,
    removeChapter,

    progress,
    message,
    loading,

    onSubmit,
  };
}
