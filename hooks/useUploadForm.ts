import { useState } from "react";
import { Alert } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Chapter, VisibilityOption } from "@/types/upload.types";
import { videoService } from "@/services/video/video.service";



const logStep = (step: string, data: any) => {
  console.log(`\n─── ${step} ───`);
  console.log(JSON.stringify(data, null, 2));
};

const logError = (step: string, error: any) => {
  console.log(`\n─── ${step} ERROR ───`);
  console.error(error);
};


const schema = z.object({
  title: z.string().min(3, "At least 3 characters").max(100),
  description: z.string().max(5000).optional(),
  tags: z.string().optional(),
  madeForKids: z.boolean(),
  allowComments: z.boolean(),
  allowRatings: z.boolean(),
});

export type FormData = z.infer<typeof schema>;

export function useUploadForm(video: any) {
  const [visibility, setVisibility] = useState<VisibilityOption>("public");
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: "1", time: "0:00", title: "Intro" },
  ]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
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

  const addChapter = () =>
    setChapters((prev) => [
      ...prev,
      { id: Date.now().toString(), time: "0:00", title: "" },
    ]);

  const updateChapter = (id: string, field: "time" | "title", value: string) =>
    setChapters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );

  const removeChapter = (id: string) =>
    setChapters((prev) => prev.filter((c) => c.id !== id));

  const onSubmit = async (data: FormData) => {
    if (!video) {
      Alert.alert("No Video", "Please select a video.");
      return;
    }

    try {
      setLoading(true);
      setProgress(0);

      logStep("INIT", { video, data });

      setMessage("Preparing upload...");

      const response = await fetch(video.uri);
      const file = await response.blob();

      if (!file || file.size === 0) {
        throw new Error("Invalid video file");
      }

      logStep("FILE_LOADED", {
        size: file.size,
        type: file.type,
        hasSlice: typeof file.slice,
        hasArrayBuffer: typeof (file as any).arrayBuffer,
      });

      setMessage("Creating upload session...");

      const upload = await videoService.requestPresignedUrls({
        title: data.title,
        description: data.description,
        fileName: video.name,
        mimeType: video.mimeType,
        fileSize: video.size,
      });

      logStep("UPLOAD_SESSION", {
        videoId: upload.videoId,
        uploadId: upload.uploadId,
        totalChunks: upload.totalChunks,
        chunkSize: upload.chunkSize,
      });

      setMessage("Uploading video...");

      const parts = await videoService.uploadChunks(
        file,
        upload,
        (progress) => {
          setProgress(progress);
          setMessage(`Uploading ${progress}%`);
        }
      );

      logStep("CHUNKS_UPLOADED", parts);

      setMessage("Finalizing upload...");

      await videoService.completeUpload({
        videoId: upload.videoId,
        uploadId: upload.uploadId,
        parts,
      });

      setProgress(100);
      setMessage("Video processing started");

      Alert.alert(
        "Success",
        "Video uploaded successfully."
      );
    } catch (error) {
      logError("UPLOAD_FAILED", error);

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
    visibility, setVisibility,
    chapters,
    addChapter, updateChapter, removeChapter,
    onSubmit,
    loading, progress, message
  };
}