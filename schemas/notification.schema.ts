import { z } from "zod";

export const schema = z.object({
  thread_ref: z.string().nullable(),
  source_ref: z.string().nullable(),
  sender: z.string().min(16),
  receiver: z.string().min(16),
  message: z.string().min(16),
});
