import { z } from "zod";

export const editThreadSchema = z.object({
  title: z
    .string({
      required_error: "Thread title is required",
      invalid_type_error: "Thread title must be a string of characters",
    })
    .min(15, "Minimum length of this field is 15 characters"),
  content: z
    .string({
      required_error: "Thread description is required",
      invalid_type_error: "Thread description must be a string of characters",
    })
    .min(10, "Minimum length of this field is 10 characters")
    .max(2000),
  expertises: z
    .object({
      id: z.string().min(1),
      display_name: z.string().min(1),
    })
    .array()
    .min(1)
    .max(5),
  mode: z.enum(["post", "question"]),
  id: z.string().min(16),
});
