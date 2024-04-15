import { AuthError } from "@/helpers/error/AuthError";
import { SupabaseClient } from "@supabase/supabase-js";

export const getUser = async (sb: SupabaseClient) => {
  try {
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) {
      throw new AuthError("User not found");
    }
    return user;
  } catch (err: any) {
    throw err;
  }
};
