/**
 * Video Upload Validation Schema
 */

import { z } from "zod";

export const videoUploadSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),
});

export type VideoUploadFormData = z.infer<typeof videoUploadSchema>;

// Error type for form errors
export type FormErrors<T> = {
  [K in keyof T]?: string;
};