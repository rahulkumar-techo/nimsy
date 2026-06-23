
import { Chapter, UploadTab, VisibilityOption } from "@/types/upload-video.types";
import { useState } from "react";
import { DetailsTab } from "../sub-comp/tabs/DetailsTab";
import { ChaptersTab } from "../ChaptersTab";
import { MoreTab } from "../MoreTab";
import { UploadTabs } from "../UploadTabs";
import { VisibilityTab } from "../VisibilityTab";

type Props = {
  control: any;
  errors: any;
  inputStyle: any;
  video: { uri: string; name: string; size?: number } | null;
  onReplaceVideo: () => void;
  chapters: Chapter[];
  onAddChapter: () => void;
  onUpdateChapter: (id: string, field: "time" | "title", value: string) => void;
  onRemoveChapter: (id: string) => void;
  visibility: VisibilityOption;
  onSelectVisibility: (v: VisibilityOption) => void;
  colors: any;
};

// Step 2 owns its own sub-navigation (Details / Chapters / Visibility / More)
// — this mirrors the original tabbed layout, just scoped to one step instead
// of the whole screen. Thumbnail picking has moved out to its own step, so
// DetailsTab renders without its Thumbnail section here.
export function MetadataStep({
  control,
  errors,
  inputStyle,
  video,
  onReplaceVideo,
  chapters,
  onAddChapter,
  onUpdateChapter,
  onRemoveChapter,
  visibility,
  onSelectVisibility,
  colors,
}: Props) {
  const [activeTab, setActiveTab] = useState<UploadTab>("details");

  return (
    <>
      <UploadTabs activeTab={activeTab} onChange={setActiveTab} colors={colors} />

      {activeTab === "details" && (
        <DetailsTab
          control={control}
          errors={errors}
          inputStyle={inputStyle}
          thumbnail={null}
          onThumbnailChange={() => {}}
          video={video}
          onReplaceVideo={onReplaceVideo}
          colors={colors}
          showVideoPreview={false}
          showThumbnail={false}
        />
      )}

      {activeTab === "chapters" && (
        <ChaptersTab
          chapters={chapters}
          onAdd={onAddChapter}
          onUpdate={onUpdateChapter}
          onRemove={onRemoveChapter}
          colors={colors}
        />
      )}

      {activeTab === "visibility" && (
        <VisibilityTab visibility={visibility} onSelect={onSelectVisibility} colors={colors} />
      )}

      {activeTab === "more" && <MoreTab control={control} colors={colors} />}
    </>
  );
}
