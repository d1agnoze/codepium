import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const Supabase = () => {
    const cookieStore = cookies()
    const supabase = createServerActionClient({ cookies: () => cookieStore })
    return supabase;
}

export default Supabase;