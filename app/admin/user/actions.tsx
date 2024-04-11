'use server'
import { adminClient } from "@/utils/supabase/admin";

export async function BanUser(id: string, duration: number) {
  try {
    const sb = adminClient();
    sb.updateUserById(id, { ban_duration: `${duration * 24}h` });
  } catch (err: any) {
    throw err;
  }
}
export async function UnbanUser(id: string) {
  try {
    const sb = adminClient();
    sb.updateUserById(id, { ban_duration: `none` });
  } catch (err: any) {
    throw err;
  }
}
