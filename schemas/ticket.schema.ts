import { z } from "zod";

export const ticket_schema = z.object({
  relatedId: z.string().min(0),
  title: z.string().min(5),
  message: z.string().min(10).max(300),
});
