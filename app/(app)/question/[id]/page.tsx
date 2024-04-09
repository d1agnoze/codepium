"use server";

import AnswerComponent from "@/components/AnswerComponent";
import CommentComponent from "@/components/CommentComponent";
import VotingComponent from "@/components/VotingComponent";
import UserAction from "@/components/edit/UserActionComponent";
import MDRenderer from "@/components/react-markdown/Markdown";
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
import { VoteEnum } from "@/enums/vote.enum";
import { ReputationService } from "@/services/reputation.service";
import { Answer } from "@/types/answer.type";
import { Question } from "@/types/question.type";
import { calculateVotes } from "@/utils/vote.utils";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { sha256 } from "js-sha256";
import { ChevronsUpDown } from "lucide-react";
import moment from "moment";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies: () => cookies() });
  //fetch question from supabase
  const { data, error } = await supabase
    .from("get_question_full")
    .select()
    .eq("id", params.id)
    .returns<Question>()
    .limit(1)
    .maybeSingle<Question>();

  //fetch user data
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // check if the thread is from the current user
  const fromUser =
    data?.user_id != null && user?.id != null && user?.id === data?.user_id;

  //error handling
  if (error || data == null) {
    console.error(error);
    notFound();
  }

  //get expertises tags of the thread
  const { data: tags, error: tag_err } = await supabase
    .rpc("get_expertises_set", {
      uuids: data!.tag,
    })
    .returns<Expertise[]>();

  //another error handling
  if (tag_err) console.error(tag_err);

  //get answers from supabase
  const { data: answers, error: ans_err } = await supabase
    .from("get_answer_full")
    .select()
    .eq("source_ref", params.id)
    .returns<Answer[]>();

  if (ans_err) console.error(ans_err);

  let default_prev_vote_ans: { thread_ref: string; direction: VoteEnum }[] = [];
  let default_prev_vote_ques: VoteEnum = VoteEnum.neutral;
  let point = 0;

  if (user != null && answers && answers.length > 0) {
    const { data: vote_ans, error: vote_ans_err } = await supabase
      .from("get_vote_answer")
      .select("thread_ref, user_status")
      .eq("source_ref", params.id)
      .eq("sender", user?.id ?? "")
      .in("thread_ref", [...answers!.map((ans) => ans.thread_ref.toString())])
      .returns<{ thread_ref: string; user_status: VoteEnum }[]>();

    const { data: vote_ques, error: vote_ques_err } = await supabase
      .from("get_vote_answer")
      .select("direction")
      .eq("source_ref", params.id)
      .eq("sender", user?.id ?? "")
      .eq("thread_ref", params.id)
      .limit(1)
      .returns<{ direction: VoteEnum }[]>();

    if (vote_ans_err || vote_ques_err || !vote_ques || !vote_ans) {
      throw new Error("Failed to fetch votes");
    }

    default_prev_vote_ans = calculateVotes(vote_ans, answers);

    if (vote_ques != null && vote_ques.length > 0) {
      default_prev_vote_ques = vote_ques[0].direction;
    }
    const repSrv = new ReputationService(supabase, user);
    const reputation = await repSrv.getReputation();
    point = reputation?.point ?? 0;
  }
  return (
    <div className="w-full box-border px-3 lg:px-10 flex flex-col gap-1">
      <div className="w-full bg-hslvar px-4 py-5 rounded-lg">
        <div className="w-full flex max-sm:flex-col-reverse gap-2">
          <aside className="flex md:flex-col max-sm:flex-row-reverse gap-2 mx-3 pt-3 justify-start items-center">
            <VotingComponent
              fromUser={!!fromUser}
              thread_id={null}
              current_stars={data!.stars}
              mode={VoteMode.question}
              user_id={user?.id}
              source_id={data!.id}
              current_direction={default_prev_vote_ques}
            />
          </aside>
          <article className="flex-grow min-w-0">
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-center">
                <Avatar className="w-6 h-6 border-white border-2">
                  <AvatarImage
                    src={`https://gravatar.com/avatar/${sha256(
                      data!.email!,
                    )}?d=${encodeURIComponent(DEFAULT_AVATAR)}&s=100`}
                    alt="@shadcn"
                  />
                  <AvatarFallback>{data!.user_name!.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="text-xs text-gray-400">
                  {fromUser ? "You" : "@" + data!.user_name} -{" "}
                  {moment(data!.created_at).fromNow()}
                </p>
                {data?.isEdited && (
                  <p className="text-xs text-gray-400">(Edited)</p>
                )}
                <UserAction
                  className={"ml-auto"}
                  mode="question"
                  visible={fromUser}
                  id={data!.id}
                  editSite={"/profile/edit/question/" + data!.id}
                />
              </div>
              <section
                className="w-full flex gap-1 flex-wrap"
                title={tags?.map((tag) => tag.display_name).join(", ")}
              >
                {tags?.map((tag) => (
                  <Badge
                    className="bg-accent text-primary-foreground cursor-pointer"
                    variant={"small"}
                    key={tag.id}
                  >
                    <Link href={`/question?filter=${tag.id}`}>
                      {tag.display_name}
                    </Link>
                  </Badge>
                ))}
              </section>
              <h1 className="font-semibold text-xl">{data!.title}</h1>
              <main className="mt-1">
                <MDRenderer
                  className={"text-md leading-relaxed"}
                  content={data!.content}
                />
              </main>
            </div>
            <div>
              <CommentComponent
                mode="question"
                user_id={user?.id}
                source_ref={data!.id}
                thread_id={data!.id}
                source_user_id={data!.user_id!}
                rep={point}
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
                rep={point}
                thread_id={data!.id}
                user={user ? { id: user.id, email: user.email! } : null}
                owner_id={data!.user_id!}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      <div>
        {answers?.length === 0 && (
          <p className="w-full text-center bg-hslvar p-4 rounded-md">
            This question has no answers [yet😉]
          </p>
        )}
      </div>
      <div>
        {ans_err && (
          <p className="w-full text-center bg-hslvar p-4 rounded-md">
            There was an error...
          </p>
        )}
      </div>
      <div className="">
        <div className="flex flex-col gap-3">
          {answers
            ?.sort((a, b) => {
              return a.status === b.status
                ? a.stars - b.stars
                : +b.status - +a.status;
            })
            .map((ans) => (
              <AnswerDisplay
                rep={ans?.point ?? 0}
                current_user_id={user?.id ?? ""}
                key={ans.thread_ref}
                ans={ans}
                user_prev_vote={default_prev_vote_ans}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
