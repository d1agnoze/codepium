"use server";

import { postSchema } from "@/schemas/post-submit.schema";
import { questionSchema } from "@/schemas/question-submit.schema";
import { INITIAL_MESSAGE_OBJECT, MessageObject } from "@/types/message.route";
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

/**
 * createPost: create new post
 * @param _: prev state, doesnt do anything
 * @param formData
 */
export async function createPost(
  _: any,
  formData: FormData,
): Promise<MessageObject> {
  const supabase = createServerActionClient({ cookies });

  // INFO: check if user exists
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { message: "Unauthorized", ok: false };

  const validate = postSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    expertises: JSON.parse(formData.getAll("expertises").toString()),
  });
  if (!validate.success) return { message: "Bad Request", ok: false };

  try {
    const { data, error } = await supabase
      .rpc("create_post", {
        content: validate.data.content,
        expertise: validate.data.expertises.map((item) => item.id),
        title: validate.data.title,
      });

    if (error) throw new Error(error.message);
    if (data) {
      console.log(data)
      return { message: data, ok: true };
    }
  } catch (err) {
    console.log(err)
    if (err instanceof Error) throw new Error();
  }

  return { message: "Internal Server Error", ok: false };
}
