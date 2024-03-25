import { z } from "zod";

export const editSchema = z.object({
  mode: z.enum(["answer", "comment"]),
  id: z.union([z.string(), z.number()]),
  content: z.string({ required_error: "new content is required" }).min(10, {
    message: "new content must be longer than 10 characters",
  }),
}).refine((data) => {
  if (data.mode === "comment") return typeof data.id === "number";
  else return typeof data.id === "string";
}, { message: "Invalid field combination", path: ["id"] });
