"use server";
import { EmailService } from "@/services/email.service";
import { schema } from "@/types/ban-user.schema";
import { User } from "@/types/user.type";
import { adminClient } from "@/utils/supabase/admin";
import { createServerActionClient as initClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function BanUser(id: string, duration: number, reason: string) {
  try {
    const sb = adminClient();
    const supabase = initClient({ cookies: () => cookies() });
    const email = new EmailService();
    const valid = schema.safeParse({
      user_id: id,
      reason,
      banned_until: duration,
    });

    if (!valid.success) throw new Error(valid.error.message);
    const pl = valid.data;
    const banDur = valid.data.banned_until * 24;

    sb.updateUserById(id, { ban_duration: `${banDur}h` });

    const {
      data: { user },
    } = await sb.getUserById(pl.user_id);

    if (!user) throw Error("No user data");

    const { data, error } = await supabase
      .from("get_user_full")
      .select()
      .eq("id", pl.user_id)
      .single<User>();

    if (!data || error) throw new Error(error.message);

    email.sendBanNotification(data.email, data.user_name, `${banDur}h`, reason);
  } catch (err: any) {
    throw err;
  }
}
export async function UnbanUser(id: string) {
  try {
    const sb = adminClient();
    const supabase = initClient({ cookies: () => cookies() });
    const email = new EmailService();

    sb.updateUserById(id, { ban_duration: `none` });
    const {
      data: { user },
    } = await sb.getUserById(id);

    if (!user) throw Error("No user data");

    const { data, error } = await supabase
      .from("get_user_full")
      .select()
      .eq("id", user.id)
      .single<User>();

    if (!data || error) throw new Error(error.message);

    email.sendRevokBanEmail(data.email, data.user_name);
  } catch (err: any) {
    throw err;
  }
}
