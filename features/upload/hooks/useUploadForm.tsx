import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadSchema } from "../validators/upload.schema";
import { useUpload } from "./useUpload";
import { z } from "zod";
import type { Visibility } from "../types/upload.types";
import type { SelectedVideo } from "@/types/upload-video.types";

export type FormData = z.infer<typeof uploadSchema>;

export function useUploadForm(video: SelectedVideo | null) {
  const [visibility, setVisibility] = useState<Visibility>("PUBLIC");
  const { startUpload, ...uploadState } = useUpload();

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

  const onSubmit = useCallback(async (data: FormData) => {
    if (!video) {
      Alert.alert("No Video", "Please select a video.");
      return;
    }

    try {
      await startUpload({
        fileUri: video.uri,
        fileName: video.name ?? "video",
        mimeType: video.mimeType ?? "video/mp4",
        fileSize: video.size ?? 0,
        metadata: {
          title: data.title,
          description: data.description,
          visibility,
          madeForKids: data.madeForKids,
          chapters:[],
          allowComments: data.allowComments,
          allowRating: data.allowRatings
        },
      });
      Alert.alert("Upload Started", "Your upload has started.");
    } catch (err) {
      Alert.alert(
        "Upload Failed",
        err instanceof Error ? err.message : "Unknown error",
      );
    }
  }, [video, visibility, startUpload]);

  return {
    form,
    visibility,
    setVisibility,
    onSubmit,
    ...uploadState,
  };
}