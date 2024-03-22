"use server";

import { Button } from "@/components/ui/button";
import { DEFAULT_HERO_IMAGE } from "@/defaults/profile";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Index() {
  const supabase = createServerComponentClient({ cookies: () => cookies() });
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex-1 w-full min-h-screen flex flex-col gap-20 items-center">
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
                <Button className="bg-accent">
                  Join Codepium community
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-grow">
        <div>
          <button className="btn btn-accent">Browse Questions</button>
        </div>
        <div>
          <button className="btn btn-info">Browse Articles</button>
        </div>
      </div>
    </div>
  );
}
