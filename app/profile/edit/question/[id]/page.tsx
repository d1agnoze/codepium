"use server";

import ThreadEditForm, {
  Prop,
} from "@/components/edit/Question_Post_Edit_Component";
import { Question } from "@/types/question.type";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies: () => cookies() });
  /* INFO fetch data from supabase, throw any Error encounterd */
  try {
    /** @description fetch data */
    const { data, error } = await supabase.from("get_question_full")
      .select()
      .eq("id", params.id)
      .returns<Question>()
      .limit(1)
      .maybeSingle<Question>();

    /** @description fetch user data */
    const { data: { user } } = await supabase.auth.getUser();

    /**
     * @description Get user authorization
     */
    const fromUser = data?.user_id && user?.id && user?.id === data?.user_id;
    console.log(error, data == null, !fromUser);
    if (error || data == null || !fromUser) notFound();

    /**
     * @description Get Expertise tags
     */
    const { data: tags, error: tag_err } = await supabase
      .rpc("get_expertises_set", { uuids: data!.tag }).returns<Expertise[]>();
    if (tag_err || !tags) throw new Error("Error fetching expertise tags");

    const prop: Prop = {
      mode: "question",
      id: params.id,
      data: {
        title: data?.title ?? "",
        content: data?.content ?? "",
        expertises: tags!.map((item) => {
          return { id: item.id, display_name: item.display_name };
        }) ?? [],
      },
    };

    return (
      <div>
        <div>
          {/* add form here */}
          <ThreadEditForm {...prop} />
        </div>
      </div>
    );
  } catch (err: any) {
    throw new Error(err.message);
  }
}
