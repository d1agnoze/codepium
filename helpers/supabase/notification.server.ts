import { SupabaseClient } from "@supabase/supabase-js";

interface Args {
  thread_ref: string | null;
  source_ref: string | null;
  sender: string;
  receiver: string;
  message: string;
}
const sendNotification = async (sb: SupabaseClient, args: Args) => {
  try {
    const { error } = await sb.from("Notification").insert({ ...args });
    if (error) throw new Error(error.message);
  } catch (err: any) {
    throw err;
  }
};
export { sendNotification };
