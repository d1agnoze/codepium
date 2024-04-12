"use server";

import Personalization from "@/components/dialogs/change-user-images.dialog";
import ProfileShowCase from "@/components/server/profile/ProfileShowcase";
import Statistic from "@/components/server/profile/Statistic";
import StopLoading from "@/components/stoploading";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { get_user_seo } from "@/types/get_user_seo.dto";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { PencilLine } from "lucide-react";
import { cookies } from "next/headers";

export default async function Page() {
  const supabase = createServerComponentClient({ cookies: () => cookies() });
  const { data, error } = await supabase.from("get_user_seo").select("*");
  const { data: email_col, error: email_err } = await supabase
    .from("get_user_email")
    .select("*");

  if (
    error ||
    email_err ||
    !email_col ||
    !data ||
    data.length === 0 ||
    email_col.length === 0
  )
    throw new Error("Error fetching user data");

  const user = (data as get_user_seo[])[0];
  if (user) user.email = email_col.at(0).email.trim().toLowerCase();

  const { data: stats, error: stats_error } = await supabase
    .from("get_statistic")
    .select("*")
    .eq("id", user.id)
    .single<Statistic>();
  if (!stats || stats_error) throw new Error("Error fetching statistics");

  const profile_prop = {
    background_image: user.background_image,
    display_name: user.display_name,
    user_name: user.user_name,
    email: user.email,
  };

  return (
    <div className="flex flex-col justify-center box-border px-2 relative">
      <ProfileShowCase {...profile_prop} />
      {/*INFO: stop loading to hide loading icon */}
      <StopLoading />
      <div className="absolute top-1 right-3">
        <Personalization user={user}/>
      </div>
      <div className="container">
        <div className="w-full flex flex-col gap-2 bg-hslvar rounded-md px-5 py-3 mb-3">
          <div className="flex gap-1">
            <PencilLine />
            <p>About</p>
          </div>
          <Textarea disabled value={user.about} className="bg-hslvar" />
        </div>

        <Statistic statistic={stats} />
      </div>
    </div>
  );
}
