"use server";

import AccountSettings from "@/components/profile-update/AccountSettings";
import { Separator } from "@/components/ui/separator";
import { User } from "@/types/user.type";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Page() {
  const sb = createServerComponentClient({ cookies: () => cookies() });
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) throw new Error("Unauthorized access!");

  const { data: profile, error } = await sb
    .from("get_user_full")
    .select()
    .eq("id", user.id)
    .single<User>();
  if (error) throw new Error("Error fetching profile: " + error.message);
  if (!profile) throw new Error("Profile not found!");

  return (
    <div className="flex flex-col gap-2 p-5">
      <h1 className="font-bold text-2xl">Account Settings</h1>
      <Separator />
      <AccountSettings user={profile} />
    </div>
  );
}
