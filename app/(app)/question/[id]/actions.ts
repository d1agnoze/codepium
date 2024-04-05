"use server";
import { AuthError } from "@/helpers/error/AuthError";
import { ReputationError } from "@/helpers/error/ReputationError";
import { SupabaseError } from "@/helpers/error/SupabaseError";
import { ValidationError } from "@/helpers/error/ValidationError";
import { answerSchema } from "@/schemas/answer-submit.schema";
import { ReputationService } from "@/services/reputation.service";
import { MessageObject } from "@/types/message.route";
import { Question } from "@/types/question.type";
import Supabase from "@/utils/supabase/server-action";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function AnswerQuestion(
  _: any,
  formData: FormData,
): Promise<MessageObject> {
  try {
    const { data: { user }, } = await Supabase().auth.getUser();

    const validated = answerSchema.safeParse({
      content: formData.get("content"),
      userValidated: JSON.parse(
        formData.get("userValidated")?.toString() ?? "false",
      ),
      user_id: formData.get("user_id"),
      thread_id: formData.get("thread_id"),
    });

    if (!validated.success) throw new ValidationError(validated.error.message);

    if (validated.data.user_id !== user?.id)
      throw new AuthError("User id does not match");

    const { data: question, error } = await Supabase()
      .from("questions")
      .select()
      .eq("id", validated.data.thread_id)
      .single<Question>();

    if (question == null || error)
      throw new Error("Bad request: Question not found");
    if (question.isArchieved)
      throw new Error(
        "Question is archieved due to:" + question.archieveReason,
      );

    // INFO: Fetch data from supabse using reputation system
    const rep = new ReputationService(Supabase(), user);
    const { data: ans_id } = await rep.doAction("verified_answer", async () => {
      const res: PostgrestSingleResponse<string> = await Supabase().rpc(
        "insert_answer",
        {
          answer_text: validated.data.content,
          question_id: validated.data.thread_id,
          valid: validated.data.userValidated,
        },
      );
      if (res.error) throw new SupabaseError(res.error.message);
      return res;
    });
    return { message: ans_id, ok: true };
  } catch (err: any) {
    if (err instanceof SupabaseError)
      return { message: err.message, ok: false };
    if (err instanceof ValidationError)
      return { message: err.message, ok: false };
    if (err instanceof AuthError) return { message: err.message, ok: false };
    if (err instanceof ReputationError)
      return { message: err.message, ok: false };
    return { message: err.message, ok: false };
  }
}

export async function VerifyAnswer(id: string): Promise<MessageObject> {
  const supabase = createServerActionClient({ cookies: () => cookies() });
  const { error } = await supabase.rpc("verify_answer", { ans_id: id });
  if (error) throw new Error(error.message);

  return { message: "answer verified", ok: true };
}
export async function UnverifyAnswer(id: string): Promise<MessageObject> {
  const supabase = createServerActionClient({ cookies: () => cookies() });
  const { error } = await supabase.rpc("unverify_answer", { ans_id: id });
  if (error) throw new Error(error.message);
  return { message: "answer unverified", ok: true };
}
