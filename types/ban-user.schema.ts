import { z } from "zod";

export const schema = z.object({
  user_id: z.string().min(10),
  reason: z.string().min(10),
  banned_until: z.number().min(0).max(999),
});
