"use server";

import { answerSchema } from "@/schemas/answer-submit.schema";
import userService from "@/services/user.services";
import { MessageObject } from "@/types/message.route";
import Supabase from "@/utils/supabase/server-action";

export async function AnswerQuestion(
  prevState: any,
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
    console.log(validated.error);
    return { message: "Bad request: " + validated.error.message, ok: true };
  }

  if (validated.data.user_id !== user?.id) {
    return { message: "Bad request: User id does not match", ok: true };
  }

  //TODO: make posgresql function to submit the answer, also check out the real time database bound
  return { message: "OK", ok: true };
}
