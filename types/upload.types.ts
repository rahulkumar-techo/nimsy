/**
 * Upload Types
 */

export type UploadTab = "details" | "chapters" | "visibility" | "more";

export type VisibilityOption = "public" | "unlisted" | "private" | "scheduled";

export type Chapter = {
  id: string;
  time: string;
  title: string;
};

export type VideoAsset = {
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
};

export interface VideoFormData {
  title: string;
  description?: string;
  tags?: string;
  madeForKids: boolean;
  allowComments: boolean;
  allowRatings: boolean;
}