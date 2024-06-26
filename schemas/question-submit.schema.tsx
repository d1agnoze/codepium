import { z } from "zod";

export const questionSchema = z.object({
  title: z.string({
    required_error: "Question title is required",
    invalid_type_error: "Question title must be a string of characters",
  }).min(15, "Minimum length of this field is 15 characters"),
  content: z.string({
    required_error: "Question description is required",
    invalid_type_error: "Question description must be a string of characters",
  }).min(10, "Minimum length of this field is 10 characters").max(2000),
  expertises: z.object({
    id: z.string().min(1),
    display_name: z.string().min(1),
  }).array().min(1).max(5)
});
