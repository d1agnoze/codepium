"use server";

import { commentSchema } from "@/schemas/comment.schema";
import { voteSchema } from "@/schemas/vote.schema";
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
  if (!validated.success) { return { message: validated.error.message, ok: false }; }

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

export async function createVote(formData: FormData): Promise<MessageObject> {
  const supabase = createServerActionClient({ cookies: () => cookies() });
  const { data: { user } } = await supabase.auth.getUser();

  if (user == null) {
    return { message: "Bad request: Invalid identity", ok: false, code: 401 };
  }

  const validated = voteSchema.safeParse({
    mode: formData.get("mode"),
    user_id: formData.get("user_id"),
    thread_id: formData.get("thread_id"),
    impact: formData.get("impact"),
    direction: formData.get("direction"),
    source_id: formData.get("source_id"),
    final_stat: formData.get("final_stat"),
  });

  if (!validated.success) {
    return { message: validated.error.message, ok: false, code: 400 };
  }

  if (validated.data.user_id !== user?.id) {
    return {
      message: "Bad request: User id does not match",
      ok: false,
      code: 400,
    };
  }

  const { data, error } = await supabase.rpc("create_vote", {
    mode: validated.data.mode,
    user_id: validated.data.user_id,

    thread_id: validated.data.thread_id,
    source_id: validated.data.source_id,

    direct: validated.data.direction,
    impact: validated.data.impact,
    final_stat: validated.data.final_stat,
  }).select();

  if (error || data == null) {
    console.log(error);
    return {
      message: "Internal Server Error: Failed to process the request",
      ok: false,
      code: 500,
    };
  }

  return { message: "Success", ok: true };
}
