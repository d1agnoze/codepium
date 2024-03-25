"use client";

import { Answer } from "@/types/answer.type";
import { BadgeCheck } from "lucide-react";
import moment from "moment";
import Markdown from "react-markdown";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { DEFAULT_AVATAR } from "@/defaults/profile";
import { sha256 } from "js-sha256";
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

export default function AnswerDisplay(
  { ans, current_user_id, user_prev_vote }: {
    ans: Answer;
    current_user_id: string;
    user_prev_vote: { thread_ref: string; direction: VoteEnum }[];
  },
): JSX.Element {
  const fromUser = useRef(ans.user_id === current_user_id);
  return (
    <div className="w-full bg-hslvar rounded-lg p-5 flex gap-3">
      <div className="w-[30px] items-center flex flex-col justify-start">
        {ans.status &&
          (
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
          current_direction={user_prev_vote.filter((x) =>
            x.thread_ref === ans.thread_ref
          )[0].direction}
          fromUser={fromUser.current}
          mode={VoteMode.answer}
          thread_id={ans.thread_ref}
          current_stars={ans.stars -
            user_prev_vote.filter((x) => x.thread_ref === ans.thread_ref)[0]
              .direction}
          user_id={current_user_id}
          source_id={ans.source_ref}
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex gap-3 items-center">
          <Avatar className="w-5 h-5 border-white border-2">
            <AvatarImage
              src={`https://gravatar.com/avatar/${sha256(ans.user_email)}?d=${
                encodeURIComponent(DEFAULT_AVATAR)
              }&s=100`}
              alt="@shadcn"
            />
            <AvatarFallback>{ans.user_name!.charAt(0)}</AvatarFallback>
          </Avatar>
          <p className="text-xs text-gray-400">
            {fromUser.current ? "You" : "@" + ans.user_name} -{" "}
            {moment(new Date(ans.created_at)).fromNow()}
          </p>
          {ans.isEdited && <p className="text-xs text-gray-400">(Edited)</p>}
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
