"use client";

import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { VoteEnum } from "@/enums/vote.enum";
import { VoteMode } from "@/enums/vote-mode.enum";

interface VotingProps {
  fromUser: boolean;
  thread_id: string;
  current_stars: number;
  mode: VoteMode;
  user_id: string | undefined;
}

export default function VotingComponent(
  { fromUser, thread_id, current_stars, user_id, mode }: VotingProps,
) {
  const [vote, setVote] = useState<VoteEnum>(VoteEnum.neutral);
  const [star, setStar] = useState<number>(current_stars);
  const upStyle = vote === VoteEnum.up ? voteUpStyle : neutralStyle;
  const downStyle = vote === VoteEnum.down ? votedownstyle : neutralStyle;
  const buttonDisabled = fromUser || !user_id;

  /**
   * click Handler: handler voting process client side
   * @param direction either up or down
   */
  const onClickHandler = (direction: "up" | "down") => {
    if (!fromUser) {
      setVote((prev) => {
        if (prev === VoteEnum.up && direction === "up") return VoteEnum.neutral;
        if (prev === VoteEnum.down && direction === "down") {
          return VoteEnum.neutral;
        }

        return direction === "up" ? VoteEnum.up : VoteEnum.down;
      });
      direction === "up"
        ? setStar((prev) => prev + 1)
        : setStar((prev) => prev - 1);
      VoteHandler(vote, thread_id);
    }
  };

  /**
   * TODO: Work on voting handler
   * Vote Hanlder: handler voting process to the server
   * @param direction VoteEnum
   * @thread_id id of the thread
   */ const VoteHandler = (direction: VoteEnum, thread_id: string) => {
    console.log(
      `User ${user_id} voted ${direction.toString()} on ${mode} with id ${thread_id}`,
    );
  };

  return (
    <>
      <Button
        onClick={() => onClickHandler("up")}
        className={buttonClassName}
        disabled={buttonDisabled}
      >
        <ArrowBigUp {...upStyle} />
      </Button>
      <p className="text-lg">{star}</p>
      <Button
        onClick={() => onClickHandler("down")}
        className={buttonClassName}
        disabled={buttonDisabled}
      >
        <ArrowBigDown {...downStyle} />
      </Button>
    </>
  );
}

const buttonClassName =
  "p-0 bg-transparent hover:bg-transparent hover:scale-125 transition-all disabled:cursor-not-allowed";
const neutralStyle = {
  fill: "transparent",
  color: "hsl(var(--foreground))",
  size: 34,
};
const voteUpStyle = { ...neutralStyle, fill: "green", color: "green" };
const votedownstyle = { ...neutralStyle, fill: "red", color: "red" };
