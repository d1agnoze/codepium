"use server";

import StopLoading from "@/components/stoploading";
import { Button } from "@/components/ui/button";
import { DEFAULT_HERO_IMAGE } from "@/defaults/profile";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Check, MessageCircleQuestion, Users } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Index() {
  const supabase = createServerComponentClient({ cookies: () => cookies() });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex-1 w-full min-h-screen flex flex-col gap-2 items-center">
      <StopLoading />
      <div
        className="hero max-md:min-h-screen bg-base-200"
        style={{ backgroundImage: `url(${DEFAULT_HERO_IMAGE})` }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-white text-center my-10">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Welcome to Codepium</h1>
            <p className="py-6">
              Codepium is an open-source question-and-answer platform aimed for
              computer programmers.
            </p>
            <div className="flex gap-3 justify-center">
              {!user && (
                <Button className="bg-accent">Join Codepium community</Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-grow flex-col w-full gap-2 px-3 border-box">
        <div className="flex flex-col gap-3 items-center rounded-md p-3 pb-6 bg-hslvar">
          <h1 className="text-xl font-bold">
            Codepium can be your trusted Q&A platform, here's why:
          </h1>
          <div className="flex gap-6">
            <div className="flex flex-col items-center text-sm gap-2">
              <Users size={30} />
              <p className="">Warm welcome community</p>
            </div>
            <div className="flex flex-col items-center text-sm gap-2">
              <MessageCircleQuestion size={30} />
              <p className="">Easy to Ask</p>
            </div>
            <div className="flex flex-col items-center text-sm gap-2">
              <Check size={30} />
              <p className="">The right answer, Right on top</p>
            </div>
          </div>
          <div className="divider mb-0"></div>
          <Link className="btn btn-accent flex-grow-0" href={"/question"}>
            Browse Questions
          </Link>
        </div>
        <div className="flex flex-col items-center gap-2 mt-5 text-sm">
          <h1>Not here for Q&A ?</h1>
          <p>Explore Codepium's community:</p>
          <Link className="btn btn-info btn-sm" href={"/post"}>
            Browse Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
