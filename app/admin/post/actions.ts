"use server";

import { AuthError } from "@/helpers/error/AuthError";
import { sendNotification } from "@/helpers/supabase/notification.server";
import { createServerActionClient as initClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function DeletePost(id: string) {
  try {
    if (id == null || id === "") throw new Error("Invalid id");
    const sb = initClient({ cookies: () => cookies() });
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) throw new AuthError("Invalid user");

    const { data, error } = await sb
      .from("Post")
      .update({ isDeleted: true })
      .eq("id", id)
      .select("user_id")
      .single<{ user_id: string }>();
    if (error || !data) throw new Error(error.message);

    sendNotification(sb, {
      thread_ref: null,
      source_ref: null,
      sender: user.id,
      receiver: data.user_id,
      message: "ADMIN has deleted your article",
    });
  } catch (err: any) {
    throw err;
  }
}

export async function RestorePost(id: string) {
  try {
    if (id == null || id === "") throw new Error("Invalid id");

    const sb = initClient({ cookies: () => cookies() });

    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) throw new AuthError("Invalid user");

    const { data, error } = await sb
      .from("Post")
      .update({ isDeleted: false })
      .eq("id", id)
      .select("user_id")
      .single<{ user_id: string }>();
    if (error || !data) throw new Error(error.message);

    sendNotification(sb, {
      thread_ref: id,
      source_ref: id,
      sender: user.id,
      receiver: data.user_id,
      message: "ADMIN has restored your article",
    });
    return;
  } catch (err: any) {
    throw err;
  }
}
