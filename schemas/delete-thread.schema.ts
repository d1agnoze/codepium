import { z } from "zod";

export const deleteSchema = z.object({
  mode: z.enum(["answer", "post", "question", "comment"]),
  id: z.union([z.string(), z.number()]),
}).refine((data) => {
  if (data.mode === "comment") return typeof data.id === "number";
  else return typeof data.id === "string";
}, { message: "Invalid field combination", path: ["id"] });
