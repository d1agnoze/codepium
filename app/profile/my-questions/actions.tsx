"use server";

import { Question } from "@/types/question.type";
import Supabase from "@/utils/supabase/server-action";
import { getUser } from "@/utils/supabase/user";

export const getQuestions = async () => {
  try {
    const sb = Supabase();
    const user = await getUser(sb);

    const { data, error } = await sb
      .from("get_question_full")
      .select()
      .eq("user_id", user.id)
      .returns<Question[]>();
    if (!data || error) throw new Error(error.message);

    return data;
  } catch (err: any) {
    throw err;
  }
};
