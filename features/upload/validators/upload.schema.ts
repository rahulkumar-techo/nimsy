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
});

export type UploadFormData = z.infer<typeof uploadSchema>;