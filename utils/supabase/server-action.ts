import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const Supabase = () => {
    const supabase = createServerActionClient({cookies: () => cookies()})
    return supabase
}
 
export default Supabase;