"use client";

import { Answer } from "@/types/answer.type";
import { BadgeCheck } from "lucide-react";
import moment from "moment";
import Markdown from "react-markdown";
import { VoteMode } from "@/enums/vote-mode.enum";
import VotingComponent from "../VotingComponent";
import { useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import CommentComponent from "../CommentComponent";
import { VoteEnum } from "@/enums/vote.enum";
import UserAction from "../edit/UserActionComponent";
import { Badge } from "./badge";
import {
  UnverifyAnswer,
  VerifyAnswer,
} from "@/app/(app)/question/[id]/actions";
import { toast } from "react-toastify";
import nProgress from "nprogress";
import Profile from "../general/Avatar";

export default function AnswerDisplay({
  ans,
  current_user_id,
  user_prev_vote,
}: {
  ans: Answer;
  current_user_id: string;
  user_prev_vote: { thread_ref: string; direction: VoteEnum }[];
}): JSX.Element {
  const fromUser = useRef(ans.user_id === current_user_id);

  const vertify = async (id: string, verifyMode: "unverify" | "verify") => {
    nProgress.start();
    if (verifyMode === "verify") {
      VerifyAnswer(id)
        .then((res) => {
          toast.success(res.message);
          location.reload();
        })
        .catch((err) => toast.error(err.message))
        .finally(() => nProgress.done());
    }
    if (verifyMode === "unverify") {
      UnverifyAnswer(id)
        .then((res) => {
          toast.success(res.message);
          location.reload();
        })
        .catch((err) => toast.error(err.message))
        .finally(() => nProgress.done());
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
          current_direction={
            user_prev_vote.filter((x) => x.thread_ref === ans.thread_ref)[0]
              .direction
          }
          fromUser={fromUser.current}
          mode={VoteMode.answer}
          thread_id={ans.thread_ref}
          current_stars={
            ans.stars -
            user_prev_vote.filter((x) => x.thread_ref === ans.thread_ref)[0]
              .direction
          }
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
          />
          <p className="text-xs text-gray-400">
            {fromUser.current ? "You" : "@" + ans.user_name} -{" "}
            {moment(new Date(ans.created_at)).fromNow()}
          </p>
          {ans.isEdited && <p className="text-xs text-gray-400">(Edited)</p>}
          {!ans.status && fromUser && (
            <Badge
              className="text-xs hover:bg-accent cursor-pointer"
              onClick={() => vertify(ans.thread_ref, "verify")}
            >
              Mark as best answer
            </Badge>
          )}
          {ans.status && fromUser && (
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
        </div>
        <div className="pt-3 flex-grow">
          <Markdown>{ans.content}</Markdown>
        </div>
        <div>
          <CommentComponent
            mode="answer"
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
