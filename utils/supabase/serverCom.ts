import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const Supabase = () => {
  const sb = createServerComponentClient({ cookies: () => cookies() });
  return sb;
};
