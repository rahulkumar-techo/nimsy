/**
 * Upload form hook for video metadata and multipart upload flow
 */

import { useState } from "react";
import { Alert } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Chapter, VisibilityOption } from "@/types/upload.types";
import { videoService } from "@/services/video/video.service";

const schema = z.object({
  title: z.string().min(3, "At least 3 characters").max(100),
  description: z.string().max(5000).optional(),
  tags: z.string().optional(),
  madeForKids: z.boolean(),
  allowComments: z.boolean(),
  allowRatings: z.boolean(),
});

export type FormData = z.infer<typeof schema>;

const logStep = (step: string, data?: unknown) => {
  console.log(`\n─── ${step} ───`);
  if (data) console.log(JSON.stringify(data, null, 2));
};

export function useUploadForm(video: any) {
  const [visibility, setVisibility] =
    useState<VisibilityOption>("public");

  const [chapters, setChapters] = useState<Chapter[]>([
    { id: "1", time: "0:00", title: "Intro" },
  ]);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      tags: "",
      madeForKids: false,
      allowComments: true,
      allowRatings: true,
    },
  });

  // Add chapter
  const addChapter = () =>
    setChapters((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        time: "0:00",
        title: "",
      },
    ]);

  // Update chapter field
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

  // Remove chapter
  const removeChapter = (id: string) =>
    setChapters((prev) =>
      prev.filter((chapter) => chapter.id !== id)
    );

  // Poll backend processing status
  const pollUploadStatus = (videoId: string) => {
    const interval = setInterval(async () => {
      try {
        const status =
          await videoService.getUploadStatus(videoId);

        setMessage(status.status);

        if (status.isCompleted) {
          clearInterval(interval);

          setProgress(100);

          Alert.alert(
            "Success",
            "Video processing completed."
          );
        }
      } catch (error) {
        clearInterval(interval);

        console.error(
          "Status polling failed",
          error
        );
      }
    }, 3000);

    return interval;
  };

  // Submit upload
  const onSubmit = async (data: FormData) => {
    console.log(video)
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

      logStep("INIT", {
        title: data.title,
        fileName: video.name,
      });

      setMessage("Reading video...");
      console.log("1");
      // Load local file
      const response = await fetch(video.uri);
      console.log("2", response);
      const fileBuffer = await response.arrayBuffer();

      console.log("BUFFER SIZE", fileBuffer.byteLength);
      if (!fileBuffer.byteLength) {
        throw new Error("Invalid video file");
      }

      setMessage("Uploading video...");

      // Execute full multipart upload
      const { upload } =
        await videoService.uploadVideo(
          fileBuffer,
          {
            title: data.title,
            description: data.description,
            fileName: video.name,
            mimeType: video.mimeType,
            fileSize: video.size,
          },
          (progress, _, message) => {
            setProgress(progress);
            setMessage(message);
          }
        );

      logStep("UPLOAD_COMPLETED", {
        videoId: upload.videoId,
      });

      // Start processing tracking
      pollUploadStatus(upload.videoId);
    } catch (error) {
      console.error(error);

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