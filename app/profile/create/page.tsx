"use server";

import Pick from "@/components/create/Pick";
import PostForm from "@/components/create/Post";
import QuestionForm from "@/components/create/Question";
import { AuthError } from "@/helpers/error/AuthError";
import { ReputationError } from "@/helpers/error/ReputationError";
import { ReputationService } from "@/services/reputation.service";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  try {
    const step: string | string[] | undefined = searchParams.mode;
    const sb = createServerComponentClient({ cookies: () => cookies() });
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) throw new AuthError("Unauthorized user");

    const repSrv = new ReputationService(sb, user);
    const reputation = await repSrv.getReputation();
    const point = reputation?.point ?? 0;

    if (step === "post") {
      const allow = await repSrv.guardAction("post");
      if (!allow) {
        throw new ReputationError("Insufficient reputation");
      }
    }
    return (
      <div className="mx-auto ">
        {step ? (
          step === "post" || step === "question" ? (
            step === "post" ? (
              <PostForm />
            ) : (
              <QuestionForm />
            )
          ) : (
            <Pick reputation={point} />
          )
        ) : (
          <Pick reputation={point} />
        )}
      </div>
    );
  } catch (err: any) {
    if (err instanceof AuthError) {
      redirect("/login");
    } else throw err;
  }
}
