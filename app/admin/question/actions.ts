"use server";
import { AuthError } from "@/helpers/error/AuthError";
import { ValidationError } from "@/helpers/error/ValidationError";
import { sendNotification } from "@/helpers/supabase/notification.server";
import { schema } from "@/schemas/archieve-question.schema";
import { schema as exp_schema } from "@/schemas/change-expertiset.schema";
import { createServerActionClient as initClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const ArchieveQuestion = async (id: string, reason: string): Promise<void> => {
  try {
    const valid = schema.safeParse({ id, reason });
    if (!valid.success) throw new ValidationError(valid.error.message);
    const sb = initClient({ cookies: () => cookies() });
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) throw new AuthError("Unauthorized request");

    const { data, error } = await sb
      .from("Question")
      .update({ isArchieved: true, archieveReason: valid.data.reason })
      .eq("id", valid.data.id)
      .select("user_id")
      .single<{ user_id: string }>();

    if (error || !data) throw new Error(error.message);

    sendNotification(sb, {
      thread_ref: null,
      source_ref: null,
      sender: user.id,
      receiver: data.user_id,
      message: "Your question has been archived due to: " + valid.data.reason,
    });
  } catch (err: any) {
    throw err;
  }
};

const ChangeExpertise = async (
  id: string,
  expertise: string[],
): Promise<void> => {
  try {
    const valid = exp_schema.safeParse({ id, expertise });
    if (!valid.success) throw new ValidationError(valid.error.message);

    const sb = initClient({ cookies: () => cookies() });

    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) throw new AuthError("Unauthorized request");

    const { data, error } = await sb
      .from("Question")
      .update({ tag: valid.data.expertise })
      .eq("id", valid.data.id)
      .select("user_id")
      .single<{ user_id: string }>();

    if (error || !data) throw new Error(error.message);

    sendNotification(sb, {
      thread_ref: null,
      source_ref: null,
      sender: user.id,
      receiver: data.user_id,
      message: "ADMIN has changed your thread Expertise",
    });

    return;
  } catch (err: any) {
    throw err;
  }
};

const RestoreQuestion = async (id: string): Promise<void> => {
  try {
    const sb = initClient({ cookies: () => cookies() });
    const {
      data: { user },
    } = await sb.auth.getUser();

    if (!user) throw new AuthError("Unauthorized request");
    const { data, error } = await sb
      .from("Question")
      .update({ isArchieved: false, archieveReason: null })
      .eq("id", id)
      .select("user_id")
      .single<{ user_id: string }>();

    console.log(data);

    if (error || !data) throw new Error(error.message);

    sendNotification(sb, {
      thread_ref: id,
      source_ref: id,
      sender: user.id,
      receiver: data.user_id,
      message: "ADMIN has restored your question",
    });
    return;
  } catch (err: any) {
    throw err;
  }
};

export { ArchieveQuestion, ChangeExpertise, RestoreQuestion };
