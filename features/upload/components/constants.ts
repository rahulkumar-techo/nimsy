import { VisibilityOption } from "@/types/upload-video.types";
import { Ionicons } from "@expo/vector-icons";

export const VIDEO_PREVIEW_HEIGHT = 200;
export const VIDEO_DURATION       = 120;

export const VISIBILITY_OPTIONS: {
  value: VisibilityOption;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { value: "public",    title: "Public",   description: "Everyone can watch",             icon: "earth-outline"       },
  { value: "unlisted",  title: "Unlisted", description: "Anyone with the link can watch", icon: "link-outline"        },
  { value: "private",   title: "Private",  description: "Only you can watch",             icon: "lock-closed-outline" },
  { value: "scheduled", title: "Schedule", description: "Set a publish date and time",    icon: "calendar-outline"    },
];