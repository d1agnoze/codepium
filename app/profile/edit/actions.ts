"use server";

import { deleteSchema } from "@/schemas/delete-thread.schema";
import { editThreadSchema } from "@/schemas/edit-thread-2.schema";
import { editSchema } from "@/schemas/edit-thread.schema";
import { comment } from "@/types/comment.type";
import { MessageObject } from "@/types/message.route";
import { isAfterEditWins } from "@/utils/checkdate";
import { schemaChecker } from "@/utils/formDataChecker";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

/**
 * Edit thread
 * Use for COMMENT and ANSWER
 * @param {FormData} formData (id, mode)
 * @returns {MessageObject} message object {message, ok}
 */
export async function EditThread(formData: FormData): Promise<MessageObject> {
  const supabase = createServerActionClient({ cookies: () => cookies() });
  const { data: { user } } = await supabase.auth.getUser();

  if (user == null) throw new Error("Bad request: Invalid identity");

  const validate = editSchema.safeParse({
    content: formData.get("content"),
    id: formData.get("id"),
    mode: formData.get("mode"),
  });
  if (!validate.success) throw new Error(validate.error.message);

  // console.log(typeof validate.data.id, validate.data.id);
  const { error } = await supabase
    .rpc("update_" + validate.data.mode, {
      content_text: validate.data.content,
      search_id: validate.data.id,
    });
  if (error) throw new Error(error.message);

  return { message: "thread edited", ok: true };
}

/**
 * Delete thread
 * @param {FormData} formData (id, mode)
 * @returns {MessageObject} message object {message, ok}
 */
export async function DeleteThread(formData: FormData): Promise<MessageObject> {
  const supabase = createServerActionClient({ cookies: () => cookies() });
  const { data: { user } } = await supabase.auth.getUser();

  const validate = deleteSchema.safeParse({
    id: formData.get("id"),
    mode: formData.get("mode"),
    content: formData.get("content"),
  });
  if (!validate.success) throw new Error(validate.error.message);

  if (validate.data.mode === "comment") {
    const { data, error } = await supabase.from("comment")
      .select().eq("id", validate.data.id)
      .single<comment>();

    if (error || !data) throw new Error(error.message);

    if (data.user_id !== user?.id) {
      throw new Error("Bad request: Invalid identity");
    }

    if (isAfterEditWins(data.created_at)) {
      throw new Error("Bad request: Edit windows expired");
    }
  }

  if (validate.data.mode !== "question") {
    const { error } = await supabase
      .rpc("delete_" + validate.data.mode, { del_id: validate.data.id });
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .rpc("delete_question", {
        del_id: validate.data.id,
        reason: validate.data.content,
      });
    if (error) throw new Error(error.message);
  }

  return { message: "Action completed", ok: true };
}

/**
 * Edit thread (second func)
 * use this function for QUESTION and ANSWER
 * @param {FormData} formData (id, mode)
 * @returns {MessageObject} message object {message, ok}
 */
export async function EditThread2(
  _: any,
  formData: FormData,
): Promise<MessageObject> {
  const supabase = createServerActionClient({ cookies: () => cookies() });
  const { data: { user } } = await supabase.auth.getUser();

  if (user == null) throw new Error("Bad request: Invalid identity");

  if (!schemaChecker(formData, editThreadSchema)) {
    throw new Error("Bad request: Lacking form content");
  }

  const validate = editThreadSchema.safeParse({
    content: formData.get("content"),
    title: formData.get("title"),
    expertises: JSON.parse(formData.getAll("expertises").toString()),
    id: formData.get("id"),
    mode: formData.get("mode"),
  });

  if (!validate.success) throw new Error(validate.error.message);

  const { error } = await supabase.rpc("update_" + validate.data.mode, {
    content_text: validate.data.content,
    search_id: validate.data.id,
    new_tag: validate.data.expertises.map((item) => item.id),
    title_text: validate.data.title,
  });

  if (error) {
    throw new Error(`Error: ${error.message}`);
  }

  return { message: "success - " + validate.data.id + "deleted", ok: true };
}
