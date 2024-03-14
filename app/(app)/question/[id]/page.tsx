"use server";

import AnswerComponent from "@/components/AnswerComponent";
import CommentComponent from "@/components/CommentComponent";
import VotingComponent from "@/components/VotingComponent";
import AnswerDisplay from "@/components/ui/AnswerDisplayComponent";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DEFAULT_AVATAR } from "@/defaults/profile";
import { VoteMode } from "@/enums/vote-mode.enum";
import { Answer } from "@/types/answer.type";
import { Question } from "@/types/question.type";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { sha256 } from "js-sha256";
import { ChevronDown, ChevronsUpDown } from "lucide-react";
import moment from "moment";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies: () => cookies() });
  //fetch question from supabase
  const { data, error } = await supabase.from("get_question_full")
    .select()
    .eq("id", params.id)
    .returns<Question>()
    .limit(1)
    .maybeSingle<Question>();

  //fetch user data
  const { data: { user } } = await supabase.auth.getUser();

  // check if the thread is from the current user
  const fromUser = (data?.user_id != null && user?.id != null) &&
    user?.id === data?.user_id;

  //error handling
  if (error && data == null) {
    console.error(error);
    notFound();
  }

  //get expertises tags of the thread
  const { data: tags, error: tag_err } = await supabase
    .rpc("get_expertises_set", {
      uuids: data!.tag,
    }).returns<Expertise[]>();

  //another error handling
  if (tag_err) console.error(tag_err);

  //get answers from supabase
  const { data: answers, error: ans_err } = await supabase.from(
    "get_answer_full",
  ).select().returns<Answer[]>();

  if (ans_err) console.error(ans_err);
  return (
    <div className="w-full box-border px-3 lg:px-32 mt-3 flex flex-col gap-1">
      <div className="w-full bg-hslvar px-4 py-5 rounded-lg">
        <div className="w-full flex max-sm:flex-col-reverse gap-2">
          <aside className="flex md:flex-col max-sm:flex-row-reverse gap-2 mx-3 justify-center items-center">
            <VotingComponent
              fromUser={!!fromUser}
              thread_id={data!.id}
              current_stars={data!.stars}
              mode={VoteMode.question}
              user_id={user?.id}
            />
          </aside>
          <article className="flex-grow">
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-center">
                <Avatar className="w-6 h-6 border-white border-2">
                  <AvatarImage
                    src={`https://gravatar.com/avatar/${
                      sha256(data!.email!)
                    }?d=${encodeURIComponent(DEFAULT_AVATAR)}&s=100`}
                    alt="@shadcn"
                  />
                  <AvatarFallback>{data!.user_name!.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="text-xs text-gray-400">
                  {fromUser ? "You" : "@" + data!.user_name} -{" "}
                  {moment(data!.created_at).fromNow()}
                </p>
              </div>
              <section className="w-full flex gap-1">
                {tags?.slice(0, 2).map((tag) => (
                  <Badge className="bg-accent text-xs" key={tag.id}>
                    {tag.display_name}
                  </Badge>
                ))}
                {(tags && tags.length > 3) &&
                  <pre className="text-md">...</pre>}
              </section>
              <h1 className="font-semibold text-xl">{data!.title}</h1>
              <main className="mt-1">
                <Markdown className={"text-md"}>{data!.content}</Markdown>
              </main>
            </div>
            <div>
              <CommentComponent
                mode="question"
                user_id={user?.id}
                source_ref={data!.id}
                thread_id={data!.id}
                source_user_id={data!.user_id!}
              />
            </div>
          </article>
        </div>
      </div>
      <div>
        <Collapsible>
          <CollapsibleTrigger>
            <span className="flex items-center gap-1 p-4 transition-all rounded-md hover:bg-hslvar">
              <span>Answer Editor</span>{" "}
              <ChevronsUpDown color="hsl(var(--primary))" />
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-3">
              <AnswerComponent
                thread_id={data!.id}
                user={user ? { id: user.id, email: user.email! } : null}
                owner_id={data!.user_id!}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      <div>
        {answers?.length === 0 && <p>This question has no answers [yet😉]</p>}
      </div>
      <div>
        {ans_err && <p>There was an error...</p>}
      </div>
      <div className="">
        <div className="flex flex-col gap-3">
          {answers?.sort((a, b) => {
            if (a.status === b.status) {
              return new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime();
            } else {
              return +b.status - +a.status;
            }
          }).map((ans) => (
            <AnswerDisplay
              current_user_id={user?.id ?? ""}
              key={ans.id}
              ans={ans}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
