/**
 * Video upload form validation schema
 * Validates metadata before starting upload
 * Used with React Hook Form + Zod
 */

import { z } from "zod";

export const uploadSchema = z.object({
  title: z.string().min(3, "At least 3 characters").max(100),

  description: z.string().max(5000).optional(),

  tags: z.string().optional(),

  madeForKids: z.boolean(),

  allowComments: z.boolean(),

  allowRatings: z.boolean(),

  chapters: z.array(
    z.object({
      id: z.string(),
      time: z.string().regex(/^(?:\d{1,2}:)?\d{1,2}:\d{2}$/, "Invalid time format (e.g., 0:00 or 1:23:45)"),
      title: z.string().min(1, "Chapter title cannot be empty").max(100),
    })
  ),
});

export type UploadFormData = z.infer<typeof uploadSchema>;