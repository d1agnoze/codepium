import { z } from "zod";

export const update_exp_schema = z.object({
  id: z.string().min(16),
  name: z.string().min(1),
});
