import { useState } from "react";
import { Alert } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Chapter, VisibilityOption } from "@/types/upload.types";

const schema = z.object({
  title:         z.string().min(3, "At least 3 characters").max(100),
  description:   z.string().max(5000).optional(),
  tags:          z.string().optional(),
  madeForKids:   z.boolean(),
  allowComments: z.boolean(),
  allowRatings:  z.boolean(),
});

export type FormData = z.infer<typeof schema>;

export function useUploadForm(video: any) {
  const [visibility,     setVisibility]     = useState<VisibilityOption>("public");
  const [chapters,       setChapters]       = useState<Chapter[]>([
    { id: "1", time: "0:00", title: "Intro" },
  ]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title:         "",
      description:   "",
      tags:          "",
      madeForKids:   false,
      allowComments: true,
      allowRatings:  true,
    },
  });

  // ── Chapter helpers ────────────────────────────────────────────────────────

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

  // ── Upload simulation ──────────────────────────────────────────────────────

  const simulateUpload = () => {
    setUploadProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 9 + 1;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        setTimeout(() => setUploadProgress(null), 2000);
      }
      setUploadProgress(Math.round(p));
    }, 250);
  };

  const onSubmit = async (data: FormData) => {
    if (!video) {
      Alert.alert("No Video", "Please select a video first.");
      return;
    }
    console.log({ ...data, video, chapters, visibility });
    simulateUpload();
  };

  return {
    form,
    visibility, setVisibility,
    chapters,
    addChapter, updateChapter, removeChapter,
    uploadProgress,
    onSubmit,
  };
}