"use server";
import { answerSchema } from "@/schemas/answer-submit.schema";
import { MessageObject } from "@/types/message.route";
import Supabase from "@/utils/supabase/server-action";

export async function AnswerQuestion(
  _: any,
  formData: FormData,
): Promise<MessageObject> {
  const { data: { user } } = await Supabase().auth.getUser();
  const validated = answerSchema.safeParse({
    content: formData.get("content"),
    userValidated: JSON.parse(
      formData.get("userValidated")?.toString() ?? "false",
    ),
    user_id: formData.get("user_id"),
    thread_id: formData.get("thread_id"),
  });

  if (!validated.success) {
    return { message: "Bad request: " + validated.error.message, ok: true };
  }

  if (validated.data.user_id !== user?.id) {
    return { message: "Bad request: User id does not match", ok: true };
  }
  //TODO: check for IsArchieved

  // Fetch data from supabse using function call
  const { data: ans_id, error } = await Supabase()
    .rpc("insert_answer", {
      answer_text: validated.data.content,
      question_id: validated.data.thread_id,
      valid: validated.data.userValidated,
    });

  if (error) {
    return { message: "Internal Server Error: " + error.message, ok: false };
  }

  return { message: ans_id, ok: true };
}
