import { z } from "zod";

export const deleteSchema = z.object({
  mode: z.enum(["answer", "post", "question", "comment"]),
  id: z.union([z.string(), z.number()]),
  content: z.string().nullable(),
})
  .refine((data) => {
    if (data.mode === "comment") {
      return !isNaN(+data.id);
    } else return typeof data.id === "string";
  }, { message: "Invalid field combination", path: ["id"] })
  .refine((data) => {
    if (data.mode === "question" && data.content == null) return false;
    return true;
  }, { message: "No archieve reason specified", path: ["content"] });
