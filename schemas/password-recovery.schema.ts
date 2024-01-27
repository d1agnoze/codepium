import { z } from "zod";

export const formSchema = z.object({
  email: z.string().email().min(4, {
    message: "How can your email be this short?",
  }),
});
