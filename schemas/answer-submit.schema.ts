import { z } from "zod";

export const answerSchema = z.object({
  content: z.string({
    required_error: "answer content is required",
    invalid_type_error: "answer content must be a string",
  }).min(10),
  userValidated: z.boolean().default(false),
  user_id: z.string().min(30),
  thread_id: z.string().min(30),
});
