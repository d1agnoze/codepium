import { z } from "zod";

export const ticket_update_schema = z.object({
  id: z.coerce.number(),
  relatedId: z.string().uuid().optional().or(z.literal("")),
  title: z.string().min(5).max(100),
  message: z.string().min(10).max(300),
});
