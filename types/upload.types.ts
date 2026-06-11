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