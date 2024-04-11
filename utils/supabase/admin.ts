import { createClient } from "@supabase/supabase-js";

export const adminClient = () => {
  try {
    const sb_url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const sr = process.env.SUPABASE_SERVICE_ROLE;
    if (!sb_url || !sr) {
      throw new Error("Missing supabase url or service role");
    }
    const supabase = createClient(sb_url, sr, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    const adminAuthClient = supabase.auth.admin;
    return adminAuthClient;
  } catch (err: any) {
    throw err;
  }
};
