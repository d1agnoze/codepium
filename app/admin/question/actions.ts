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
    const { error } = await sb
      .from("Question")
      .update({ isArchieved: true, archieveReason: valid.data.reason })
      .eq("id", valid.data.id);

    if (error) throw new Error(error.message);
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

    const { error } = await sb
      .from("Question")
      .update({ tag: valid.data.expertise })
      .eq("id", valid.data.id);

    if (error) throw new Error(error.message);

    sendNotification(sb, {
      thread_ref: null,
      source_ref: null,
      sender: user.id,
      receiver: valid.data.id,
      message: "ADMIN has changed your thread Expertise",
    });

    return;
  } catch (err: any) {
    throw err;
  }
};

export { ArchieveQuestion, ChangeExpertise };
