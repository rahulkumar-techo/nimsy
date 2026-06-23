import { z } from "zod";

export const uploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  tags: z.string().optional(),
  chapters: z
    .array(
      z.object({
        id: z.string(),
        time: z.string(),
        title: z.string(),
      }),
    )
    .optional(),
  madeForKids: z.boolean(),
  allowComments: z.boolean(),
  allowRatings: z.boolean(),
});
