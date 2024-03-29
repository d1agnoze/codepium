"use server";

import StopLoading from "@/components/stoploading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { DEFAULT_AVATAR } from "@/defaults/profile";
import { get_user_seo } from "@/types/get_user_seo.dto";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { sha256 } from "js-sha256";
import { PanelRightOpen } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function Page() {
  const supabase = createServerComponentClient({ cookies: () => cookies() });
  const { data, error } = await supabase.from("get_user_seo").select("*");
  const { data: email_col, error: email_err } = await supabase.from(
    "get_user_email",
  ).select("*");
  if (
    error || email_err || !email_col || !data || data.length === 0 ||
    email_col.length === 0
  ) return notFound();
  const user = (data as get_user_seo[]).at(0);
  if (user) user.email = email_col.at(0).email.trim().toLowerCase();
  return (
    <div className="flex flex-col justify-center box-border px-2">
      <div className="w-full md:h-[24vh] max-sm:h-[20dvh] max-sm:mb-6 md:mb-8 overflow-hidden relative">
        <Image
          src={user!.background_image}
          fill={true}
          className="z-0 rounded-lg"
          priority={true}
          alt="user's background image"
        />
        <div className="absolute bottom-3 left-5 z-10 flex gap-3 items-center">
          <Avatar className="w-28 h-28 border-white border-2">
            <AvatarImage
              src={`https://gravatar.com/avatar/${sha256(user!.email)}?d=${
                encodeURIComponent(DEFAULT_AVATAR)
              }&s=100`}
              alt="@shadcn"
            />
            <AvatarFallback>{user?.user_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <Card className="py-2 pl-5 pr-8 border-0 bg-hslvar transition cursor-default">
            <CardTitle>{user?.display_name}</CardTitle>
            <CardDescription>@{user?.user_name}</CardDescription>
          </Card>
          <StopLoading />
        </div>
      </div>
      <div className="container">
        {user?.user_name}
        <label
          htmlFor="drawer"
          className="btn bg-transparent hover:bg-hslvar drawer-button lg:hidden"
        >
          <PanelRightOpen />
        </label>
      </div>
    </div>
  );
}
