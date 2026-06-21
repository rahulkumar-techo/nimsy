// @/types/video.ts
export interface ApiVideo {
  id: string;
  title: string;
  description: string;
  tags: string[] | null;
  fileName: string;
  objectKey: string;
  mimeType: string;
  fileSize: string;
  thumbnailKey: string;
  previewKey: string;
  uploadedById: string;
  status: "DRAFT" | "PROCESSING" | "PUBLISHED" | "FAILED";
  madeForKids: boolean;
  allowComments: boolean;
  allowRatings: boolean;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  uploadedBy: {
    name: string;
    username: string;
    avatarUrl: string | null;
  };
}