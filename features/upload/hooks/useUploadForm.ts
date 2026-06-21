// Upload form hook.

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";

import { uploadVideoThunk } from "@/features/upload/store/upload.thunks";
import type { AppDispatch, RootState } from "@/store/store";
import { Chapter, SelectedVideo, VisibilityOption } from "../types/upload.types";
import { uploadSchema } from "../validators/upload.schema";

export type FormData = z.infer<typeof uploadSchema>;

export function useUploadForm(video: SelectedVideo | null) {
  const dispatch = useDispatch<AppDispatch>();

  // upload state from redux
  const progress = useSelector((state: RootState) => state.upload.progress);
  const loading = useSelector((state: RootState) => state.upload.loading);
  const message = useSelector((state: RootState) => state.upload.message);

  // local UI state
  const [visibility, setVisibility] = useState<VisibilityOption>("public");
  const [thumbnail, setThumbnail] = useState<{ uri: string; fileName: string } | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([{ id: "1", time: "0:00", title: "Intro" }]);

  const form = useForm<FormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: "",
      chapters,
      madeForKids: false,
      allowComments: true,
      allowRatings: true,
    },
  });

  // add a new empty chapter
  const addChapter = () =>
    setChapters((prev) => [...prev, { id: Date.now().toString(), time: "0:00", title: "" }]);

  // update a chapter field by id
  const updateChapter = (id: string, field: "time" | "title", value: string) =>
    setChapters((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));

  // remove a chapter by id
  const removeChapter = (id: string) =>
    setChapters((prev) => prev.filter((c) => c.id !== id));

  // submit handler: dispatches upload thunk
  const onSubmit = async (data: FormData) => {
    if (!video) {
      Alert.alert("No Video", "Please select a video.");
      return;
    }

    try {
      await dispatch(
        uploadVideoThunk({
          video,
          metadata: {
            title: data.title,
            description: data.description,
            fileName: video.name,
            mimeType: video.mimeType,
            fileSize: video.size,
            chapters,
            madeForKids: data.madeForKids,
            allowComments: data.allowComments,
            allowRatings: data.allowRatings,
          },
        }),
      ).unwrap();
    } catch (error) {
      Alert.alert("Upload Failed", error instanceof Error ? error.message : "Something went wrong.");
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
    thumbnail,
    setThumbnail,
    progress,
    loading,
    message,
    onSubmit,
  };
}