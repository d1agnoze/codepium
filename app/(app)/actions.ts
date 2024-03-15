"use server";

import { commentSchema } from "@/schemas/comment.schema";
import { INITIAL_COMMENT_OPTIMISTIC } from "@/types/comment.optimistic";
import { comment } from "@/types/comment.type";
import { MessageObject } from "@/types/message.route";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function CreateComment(
  _preState: any,
  formData: FormData,
): Promise<comment | MessageObject> {
  const supabase = createServerActionClient({ cookies: () => cookies() });
  const { data: { user } } = await supabase.auth.getUser();
  const validated = commentSchema.safeParse({
    mode: formData.get("mode"),
    content: formData.get("content"),
    thread_id: formData.get("thread_ref"),
    parent_id: formData.get("parent_ref"),
    user_id: formData.get("user_id"),
    receviver: formData.get("receviver"),
  });

  // validation FAILED
  if (!validated.success) {
    console.log(validated.error.message);
    return { message: validated.error.message, ok: false };
  }

  //User id mismatch
  if (!user || validated.data.user_id !== user?.id) {
    return { message: "Bad request: Invalid identity", ok: true };
  }

  // finally push to supabase
  // this function returns a id
  const { data, error } = await supabase
    .rpc("create_comment", {
      content: validated.data.content,
      mode: validated.data.mode,
      parent_ref: validated.data.parent_id,
      reply: validated.data.receviver,
      thread_ref: validated.data.thread_id,
      user_id: validated.data.user_id,
    }).returns<number>();

  //error handling
  if (error || data == null || data === -1) {
    return {
      message: "Internal Server Error: Failed to process the request",
      ok: false,
    };
  }

  // success
  const { data: res, error: res_err } = await supabase.from("get_comment_full")
    .select().eq(
      "id",
      data,
    ).returns<comment>().single();

  //error handling
  if (res_err || res == null) {
    return {
      message: "Internal Server Error: Failed to retrieve data",
      ok: false,
    };
  }

  return res;
}
