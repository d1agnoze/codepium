"use server";

import { AuthError } from "@/helpers/error/AuthError";
import { question_seo } from "@/types/question.seo";
import { createServerActionClient as initClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const getQuestions = async () => {
  try {
    const sb = initClient({ cookies: () => cookies() });
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) throw new AuthError("Unauthorized access");

    const { data, error } = await sb
      .from("get_question_seo")
      .select()
      .eq("user_id", user.id)
      .returns<question_seo[]>();
    if (!data || error) throw new Error(error.message);

    return data;
  } catch (err: any) {
    throw err;
  }
};
