import { z } from "zod";

/** @constant {zod Schema}
 *  @property mode "question" | "post" | "answer" | "comment"
 *  @property thread_id id of the current_thread (can a comment or a answer based on the mode props)
 *  @property parent_id id of source thread, must be a answer or a post
 *  @property content comment content
 *  @property user_id id of current user
 *  @property receviver id of the person that user is replying to, can be null if this comment aimed at the answer or post or question owner
 */
export const commentSchema = z.object({
  mode: z.enum(["question", "post", "answer", "comment"]),
  thread_id: z.string().min(16),
  parent_id: z.string().min(16),
  content: z.string().min(5),
  user_id: z.string().min(16),
  receviver: z.string().min(16),
}).refine((data) => {
  if (data.mode === "post" || data.mode === "question") {
    return data.parent_id === data.thread_id;
  } else if (data.mode === "answer") {
    return data.thread_id != data.parent_id;
  }
}, {
  message: "Invalid field combination",
});
