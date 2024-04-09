import { z } from "zod";

export const schema = z.object({
  id: z.string().min(16),
  reason: z.string().min(5),
});
