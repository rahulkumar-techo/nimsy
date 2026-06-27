// useUploadForm.ts
import { useState, useCallback, useEffect } from "react";
import { Alert } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadSchema } from "../validators/upload.schema";
import { useUpload } from "./useUpload";
import { z } from "zod";
import type { Visibility } from "../types/upload.types";
import type { SelectedVideo } from "@/types/upload-video.types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";


export type FormData = z.infer<typeof uploadSchema>;

const DEFAULT_VALUES: FormData = {
  title: "",
  description: "",
  tags: "",
  madeForKids: false,
  allowComments: true,
  allowRatings: true,
};

function getThumbnailType(uri: string): "image/jpeg" | "image/png" {
  return uri.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
}

export function useUploadForm(video: SelectedVideo | null) {
  const [visibility, setVisibility] = useState<Visibility>("PUBLIC");
  const { startUpload, ...uploadState } = useUpload();

  const { thumbnailUri } = useSelector((state: RootState) => state.upload);

  const form = useForm<FormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: DEFAULT_VALUES,
  });

  // Only reset once the upload has actually finished successfully.
  // Resetting on "COMPLETING" wipes the user's data if the final
  // step (e.g. thumbnail PUT) then fails.
  useEffect(() => {
    if (uploadState.status === "COMPLETED") {
      form.reset(DEFAULT_VALUES);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisibility("PUBLIC");
    }
  }, [uploadState.status, form]);

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (!video) {
        Alert.alert("No Video", "Please select a video.");
        return;
      }

      try {
        // Thumbnail is optional — only convert when one actually exists.
        // let thumbnailBody: string | undefined;
        let thumbnailType: "image/jpeg" | "image/png" | undefined;

        if (thumbnailUri) {
          // thumbnailBody = await uriToBlob(thumbnailUri);
          thumbnailType = getThumbnailType(thumbnailUri);
        }

        await startUpload({
          fileUri: video.uri,
          fileName: video.name ?? "video",
          mimeType: video.mimeType ?? "video/mp4",
          fileSize: video.size ?? 0,
          thumbnailLocalUri: thumbnailUri as string,
          thumbnailType,
          metadata: {
            title: data.title,
            description: data.description,
            visibility,
            madeForKids: data.madeForKids,
            chapters: [],
            allowComments: data.allowComments,
            allowRating: data.allowRatings,
          },
        });

        Alert.alert("Upload Started", "Your upload has started.");
      } catch (err) {
        console.error("[UploadForm]", err);
      }
    },
    [video, visibility, startUpload, thumbnailUri],
  );

  return {
    form,
    visibility,
    setVisibility,
    onSubmit,
    ...uploadState,
  };
}