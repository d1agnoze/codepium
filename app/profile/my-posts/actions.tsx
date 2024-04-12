"use server";

import { AuthError } from "@/helpers/error/AuthError";
import { post_seo } from "@/types/post.seo";
import { createServerActionClient as initClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const getPosts = async () => {
  try {
    const sb = initClient({ cookies: () => cookies() });
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) throw new AuthError("Unauthorized access");

    const { data, error } = await sb
      .from("get_post_seo")
      .select()
      .eq("user_id", user.id)
      .returns<post_seo[]>();
    if (!data || error) throw new Error(error.message);

    return data;
  } catch (err: any) {
    throw err;
  }
};
