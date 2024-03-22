"use server";

import CommentComponent from "@/components/CommentComponent";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DEFAULT_AVATAR } from "@/defaults/profile";
import { VoteEnum } from "@/enums/vote.enum";
import { Post } from "@/types/post.type";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { sha256 } from "js-sha256";
import { Cross, Info, MessageCircleMore, X } from "lucide-react";
import moment from "moment";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies: () => cookies() });
  const { data: { user } } = await supabase.auth.getUser();

  // INFO: fetch post data
  const { data: post, error } = await supabase
    .from("get_post_full")
    .select()
    .eq("id", params.id).returns<Post>()
    .limit(1)
    .single<Post>();
  if (error || !post) notFound();

  // INFO:fetching related expertises
  const { data: tags, error: tag_err } = await supabase
    .rpc("get_expertises_set", { uuids: post!.tag }).returns<Expertise[]>();
  if (tag_err) throw new Error("Error fetching expertises: " + tag_err.message);

  // INFO: fetch post likes
  const { data: cmt_likes, error: err_likes } = await supabase
    .from("get_vote_ques_post")
    .select("user_status")
    .eq("source_ref", params.id)
    .eq("sender", user?.id ?? "")
    .eq("source_ref", params.id)
    .order("created_at", { ascending: false })
    .limit(1).maybeSingle<{ user_status: VoteEnum }>();
  console.log("Error fetching post likes: " + cmt_likes);
  if (err_likes) notFound();

  return (
    <div className="max-md:w-full w-[70%] border-box px-10">
      {user &&
        (
          <div className="flex gap-1 w-full items-center justify-center bg-accent mb-7 py-2 rounded-md">
            <Info size={20} />
            <span>
              You are not logged in, comment and like features are disabled
            </span>
          </div>
        )}

      <div className="flex flex-col gap-4">
        <article>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3 items-center">
              <Avatar className="w-10 h-10 border-white border-2">
                <AvatarImage
                  src={`https://gravatar.com/avatar/${sha256(post!.email!)}?d=${
                    encodeURIComponent(DEFAULT_AVATAR)
                  }&s=100`}
                  alt="@shadcn"
                />
                <AvatarFallback>{post.user_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <p className="text-xs text-gray-400">
                {post.user_id == user?.id ? "You" : "@" + post.user_name} -{" "}
                {moment(post!.created_at).fromNow()}
              </p>
            </div>
            <section className="w-full flex gap-1 pl-10">
              {tags?.slice(0, 4).map((tag) => (
                <Badge className="bg-accent text-xs rounded-md" key={tag.id}>
                  {tag.display_name}
                </Badge>
              ))}
              {(tags && tags.length > 3) &&
                <pre className="text-md">...</pre>}
            </section>
            <h1 className="font-semibold text-2xl text-center">{post.title}</h1>
            <main className="mt-1">
              <Markdown className={"text-md"}>{post.content}</Markdown>
            </main>
          </div>
        </article>
        <section className="mt-3">
          <Separator />
          <h1 className="font-bold text-xl my-3 flex gap-1">
            <MessageCircleMore /> <span>Comments</span>
          </h1>
          <CommentComponent
            mode="post"
            source_ref={post.id}
            user_id={user?.id}
            thread_id={post.id}
            source_user_id={post.user_id}
          />
        </section>
      </div>
    </div>
  );
}
