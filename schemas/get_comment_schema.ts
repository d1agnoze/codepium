import { z } from "zod";

export const get_comment_schema = z.object({
  thread_ref: z.string({
    invalid_type_error: "Invalid thread ref!",
    required_error: "thread ref is required!",
  }).min(16),
  parent_ref: z.string({
    invalid_type_error: "Invalid parent ref!",
    required_error: "Parent ref is required!",
  }).min(16),
  mode: z.enum(["post", "question", "answer"], {
    invalid_type_error: "Invalid mode!",
    required_error: "Mode is required!",
  }),
});
