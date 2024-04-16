"use server";

import ThreadEditForm, {
  Prop,
} from "@/components/edit/Question_Post_Edit_Component";
import { Post } from "@/types/post.type";
import Supabase from "@/utils/supabase/server-action";
import { getUser } from "@/utils/supabase/user";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  try {
    /* INFO: fetch data from supabase, throw any Error encounterd */
    const sb = Supabase();
    /** @description fetch data */
    const { data, error } = await sb
      .from("get_post_full")
      .select()
      .eq("id", params.id)
      .returns<Post>()
      .limit(1)
      .maybeSingle<Post>();

    if (error || !data) throw new Error("Error fetching data");
    if (data.isDeleted) notFound();

    /** @description fetch user data */
    const user = await getUser(sb);

    /**
     * @description Get user authorization
     */
    const fromUser = user.id === data.user_id;
    if (!fromUser) notFound();

    /**
     * @description Get Expertise tags
     */
    const { data: tags, error: tag_err } = await sb
      .rpc("get_expertises_set", { uuids: data!.tag })
      .returns<Expertise[]>();

    if (tag_err || !tags) throw new Error("Error fetching expertise tags");

    const prop: Prop = {
      mode: "post",
      id: params.id,
      data: {
        title: data?.title ?? "",
        content: data?.content ?? "",
        expertises:
          tags?.map((x) => {
            return { id: x.id, display_name: x.display_name };
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
