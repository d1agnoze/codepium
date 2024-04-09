import { z } from "zod";

export const schema = z.object({
  id: z.string().min(16),
  expertise: z.array(z.string().min(16)),
});
