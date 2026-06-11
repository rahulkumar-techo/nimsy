/**
 * Upload Form Validation
 */

import { z } from "zod";

export const uploadSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100),

  description: z.string().optional(),

  tags: z.string().optional(),

  visibility: z.enum([
    "public",
    "unlisted",
    "private",
    "scheduled",
  ]),

  madeForKids: z.boolean(),

  allowComments: z.boolean(),

  allowRatings: z.boolean(),
});

export type UploadFormValues = z.infer<
  typeof uploadSchema
>;