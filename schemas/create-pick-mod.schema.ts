import { z } from "zod";

export const pickModeSchema = z.object({
  mode: z.union([z.literal("post"), z.literal("question")], {
    invalid_type_error: "Invalid field type",
    required_error: "This field is required",
  }),
});
