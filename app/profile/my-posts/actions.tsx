"use server";

import { Post } from "@/types/post.type";
import Supabase from "@/utils/supabase/server-action";
import { getUser } from "@/utils/supabase/user";

export const getPosts = async () => {
  try {
    const sb = Supabase();
    const user = await getUser(sb);

    const { data, error } = await sb
      .from("get_post_full")
      .select()
      .eq("user_id", user.id)
      .returns<Post[]>();
    if (!data || error) throw new Error(error.message);

    return data;
  } catch (err: any) {
    throw err;
  }
};
