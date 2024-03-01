"use server";

import { questionSchema } from "@/schemas/question-submit.schema";
import { MessageObject } from "@/types/message.route";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function createQuestion(
  prevSate: any,
  formData: FormData,
): Promise<MessageObject> {
  const supabase = createServerActionClient({ cookies });

  // INFO: check if user exists
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { message: "Unauthorized", ok: false };
  }

  // INFO: validate
  const validate = questionSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    expertises: JSON.parse(formData.getAll("expertises").toString()),
  });
  if (!validate.success) return { message: "Bad Request", ok: false };

  const { data, error } = await supabase
    .rpc("create_question", {
      content: validate.data.content,
      expertise: validate.data.expertises.map((item) => item.id),
      title: validate.data.title,
    });

  if (error) {
    console.log(error);
    return { message: error.message, ok: false };
  }

  return { message: data, ok: true };
}
