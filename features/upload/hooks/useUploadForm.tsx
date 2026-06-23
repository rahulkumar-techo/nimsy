import { z } from "zod";
import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";

import { Chapter, SelectedVideo, UploadPhase, VisibilityOption } from "../types/upload.types";
import { uploadSchema } from "../validators/upload.schema";
import { uploadVideoThunk } from "../store/upload.thunk";
import { setUploadProgress, setUploadMessage } from "../store/uploadApi.slice";
import { startUploadPolling } from "../utils/upload-polling.util";
import type { AppDispatch, RootState } from "@/store/store";

export type FormData = z.infer<typeof uploadSchema>;

export function useUploadForm(video: SelectedVideo | null) {
  const dispatch = useDispatch<AppDispatch>();
  const [visibility, setVisibility] =
    useState<VisibilityOption>("public");

  const [chapters, setChapters] = useState<Chapter[]>([
    { id: "1", time: "0:00", title: "Intro" },
  ]);

  const loading = useSelector((state: RootState) => state.uploadApi.isUploading);
  const progress = useSelector((state: RootState) => state.uploadApi.uploadProgress);
  const message = useSelector((state: RootState) => state.uploadApi.uploadMessage);

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

  const addChapter = useCallback(() =>
    setChapters((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        time: "0:00",
        title: "",
      },
    ]),
  []);

  const updateChapter = useCallback(
    (id: string, field: "time" | "title", value: string) =>
      setChapters((prev) =>
        prev.map((chapter) =>
          chapter.id === id
            ? { ...chapter, [field]: value }
            : chapter
        )
      ),
    []
  );

  const removeChapter = useCallback(
    (id: string) =>
      setChapters((prev) =>
        prev.filter((chapter) => chapter.id !== id)
      ),
    []
  );

  const onSubmit = useCallback(async (data: FormData) => {
    if (!video) {
      Alert.alert(
        "No Video",
        "Please select a video."
      );
      return;
    }

    try {
      const result = await dispatch(
        uploadVideoThunk({
          video,
          metadata: {
            title: data.title,
            description: data.description,
            fileName: video.name,
            mimeType: video.mimeType ?? "",
            fileSize: video.size ?? 0,
            chapters,
            madeForKids: data.madeForKids,
            allowComments: data.allowComments,
            allowRatings: data.allowRatings,
          },
          onProgress: ((p: number, _phase: UploadPhase, msg: string) => {
            dispatch(setUploadProgress(p));
            dispatch(setUploadMessage(msg));
          }),
        })
      ).unwrap();

      startUploadPolling(result.videoId, (status) => {
        if ("status" in status) {
          dispatch(setUploadMessage(status.status));
          if (status.isCompleted) {
            dispatch(setUploadProgress(100));
            Alert.alert(
              "Success",
              "Video processing completed."
            );
          }
        }
      });
    } catch (error) {
      Alert.alert(
        "Upload Failed",
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    }
  }, [dispatch, video, chapters]);

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
