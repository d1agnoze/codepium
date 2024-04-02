"use server";

import ProfileShowCase from "@/components/server/profile/ProfileShowcase";
import Statistic from "@/components/server/profile/Statistic";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/types/user.type";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { PencilLine } from "lucide-react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = createServerComponentClient({ cookies: () => cookies() });
  /*INFO: check if user is current user*/
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user?.id === id) {
    redirect("/profile/");
  }

  const { data: user_data, error: user_err } = await supabase
    .from("get_user_full")
    .select("*")
    .eq("id", id)
    .single<User>();
  const { data: stat_data, error: stat_err } = await supabase
    .from("get_statistic")
    .select()
    .eq("id", id)
    .single<Statistic>();

  if (user_err || !user_data || stat_err || !stat_data) {
    notFound();
  }

  return (
    <div className="w-full border-box ">
      <div className="flex flex-col justify-center box-border px-2 gap-3">
        <ProfileShowCase
          background_image={user_data.background_image}
          user_name={user_data.user_name}
          email={user_data.email}
          display_name={user_data.display_name}
        />
        <div className="container">
          <div className="w-full flex flex-col gap-2 bg-hslvar rounded-md px-5 py-3">
            <div className="flex gap-1">
              <PencilLine />
              <p>About</p>
            </div>
            <Textarea disabled value={user_data.about} className="bg-hslvar" />
          </div>
        </div>
        <div className="container">
          <Statistic statistic={stat_data} />
        </div>
      </div>
    </div>
  );
}
