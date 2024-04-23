"use client";

import { Answer } from "@/types/answer.type";
import { BadgeCheck } from "lucide-react";
import moment from "moment";
import Markdown from "react-markdown";
import { VoteMode } from "@/enums/vote-mode.enum";
import VotingComponent from "../VotingComponent";
import { useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CommentComponent from "../CommentComponent";
import { VoteEnum } from "@/enums/vote.enum";
import UserAction from "../edit/UserActionComponent";
import { Badge } from "@/components/ui/badge";
import {
  UnverifyAnswer,
  VerifyAnswer,
} from "@/app/(app)/question/[id]/actions";
import { toast } from "react-toastify";
import nProgress from "nprogress";
import Profile from "../general/Avatar";
import AdminAction from "../edit/AdminActionComponent";
import { INITIAL_MESSAGE_OBJECT } from "@/types/message.route";
import { createClientComponentClient as InitClient } from "@supabase/auth-helpers-nextjs";

export default function AnswerDisplay({
  ans,
  current_user_id,
  vote,
  rep,
}: Props) {
  const fromUser = useRef(ans.user_id === current_user_id);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    fetchAuthorization(current_user_id);
  }, []);

  const fetchAuthorization = async (id?: string) => {
    if (!id) setIsAdmin(false);
    const sb = InitClient();
    const { data } = await sb
      .from("User")
      .select("role")
      .eq("id", id)
      .single<{ role: string }>();
    if (data?.role === "admin") setIsAdmin(true);
  };

  const vertify = async (id: string, verifyMode: "unverify" | "verify") => {
    try {
      nProgress.start();
      let res = INITIAL_MESSAGE_OBJECT;
      if (verifyMode === "verify") {
        res = await VerifyAnswer(id);
      }
      if (verifyMode === "unverify") {
        res = await UnverifyAnswer(id);
      }
      toast.success(res.message);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      nProgress.done();
    }
  };

  return (
    <div className="w-full bg-hslvar rounded-lg p-5 flex gap-3">
      <div className="w-[30px] items-center flex flex-col justify-start">
        {ans.status && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <BadgeCheck size={30} fill="green" color="white" />
              </TooltipTrigger>
              <TooltipContent>
                <p>The question owner accepted this as the best answer</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <VotingComponent
          current_direction={vote}
          fromUser={fromUser.current}
          mode={VoteMode.answer}
          thread_id={ans.thread_ref}
          current_stars={ans.stars - vote}
          user_id={current_user_id}
          source_id={ans.source_ref}
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex gap-3 items-center">
          <Profile
            email={ans.user_email}
            id={ans.user_id}
            size="7"
            username={ans.user_name}
            rep={ans.point}
          />
          <p className="text-xs text-gray-400">
            {fromUser.current ? "You" : "@" + ans.user_name} -{" "}
            {moment(new Date(ans.created_at)).fromNow()}
            <span className={"text-info font-semibold"}>
              {ans.point && ` ${ans.point} RP`}
            </span>
          </p>
          {ans.isEdited && <p className="text-xs text-gray-400">(Edited)</p>}
          {!ans.status && fromUser.current && (
            <Badge
              className="text-xs hover:bg-accent cursor-pointer"
              onClick={() => vertify(ans.thread_ref, "verify")}
            >
              Mark as best answer
            </Badge>
          )}
          {ans.status && fromUser.current && (
            <Badge
              className="text-xs bg-accent hover:bg-primary cursor-pointer"
              onClick={() => vertify(ans.thread_ref, "unverify")}
            >
              Unmark this answer
            </Badge>
          )}
          <UserAction
            className={"ml-auto"}
            mode="answer"
            visible={ans.user_id === current_user_id}
            id={ans!.thread_ref}
            prevContent={ans.content}
          />
          {isAdmin && (
            <AdminAction
              thread_ref={ans.thread_ref}
              action={ans.status ? "unverify" : "verify"}
            />
          )}
        </div>
        <div className="pt-3 flex-grow">
          <Markdown>{ans.content}</Markdown>
        </div>
        <div>
          <CommentComponent
            mode="answer"
            rep={rep}
            user_id={current_user_id}
            source_ref={ans.source_ref}
            thread_id={ans.thread_ref}
            source_user_id={ans.source_user_id}
          />
        </div>
      </div>
    </div>
  );
}

interface Props {
  ans: Answer;
  current_user_id: string;
  vote: VoteEnum;
  rep: number;
}
