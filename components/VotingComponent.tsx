"use client";

import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { VoteEnum } from "@/enums/vote.enum";
import { VoteMode } from "@/enums/vote-mode.enum";
import { toast } from "react-toastify";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { voteSchema } from "@/schemas/vote.schema";
import { createVote } from "@/app/(app)/actions";

interface VotingProps {
  fromUser: boolean;
  thread_id: string | null;
  current_stars: number;
  mode: VoteMode;
  user_id: string | undefined;
  source_id: string;
  current_direction: VoteEnum;
}

export default function VotingComponent({
  fromUser,
  thread_id,
  current_stars,
  user_id,
  mode,
  source_id,
  current_direction,
}: VotingProps) {
  const [vote, setVote] = useState<VoteEnum>(current_direction);

  const [star, setStar] = useState<number>(current_stars);

  const upStyle = vote === VoteEnum.up ? voteUpStyle : neutralStyle;
  const downStyle = vote === VoteEnum.down ? votedownstyle : neutralStyle;
  const buttonDisabled = fromUser || !user_id;

  useEffect(() => {
    if (vote === VoteEnum.up) setStar(current_stars + 1);
    if (vote === VoteEnum.down) setStar(current_stars - 1);
    if (vote === VoteEnum.neutral) setStar(current_stars);
  }, [vote]);

  /**
   * click Handler: handler voting process client side
   * @param direction either up or down
   */
  const onClickHandler = async (direction: "up" | "down") => {
    const new_dir = direction === "up";
    //vote data to reflect on UI
    const newVote = () => {
      if (vote === VoteEnum.up && direction === "up") return VoteEnum.neutral;
      if (vote === VoteEnum.down && direction === "down") {
        return VoteEnum.neutral;
      }
      return new_dir ? VoteEnum.up : VoteEnum.down;
    };

    //vote data to reflect on server
    const newImpact = () => {
      if (vote === VoteEnum.up && direction === "up") return VoteEnum.down;
      if (vote === VoteEnum.down && direction === "down") return VoteEnum.up;
      return new_dir ? VoteEnum.up : VoteEnum.down;
    };

    if (!fromUser) {
      setVote(newVote());

      await VoteHandler(new_dir, newImpact(), newVote());
    }
  };

  /**
   * Vote Hanlder: handler voting process to the server
   */
  const VoteHandler = async (
    new_dir: boolean,
    impact: VoteEnum,
    new_vote: VoteEnum,
  ) => {
    if (!user_id) return;

    const payload = new FormData();
    payload.append("mode", mode);
    payload.append("user_id", user_id);
    payload.append("thread_id", thread_id ?? source_id);
    payload.append("impact", impact.toString());
    payload.append("direction", new_dir.toString());
    payload.append("source_id", source_id);
    payload.append("final_stat", new_vote.toString());

    createVote(payload).then((res) => {
      if (!res.ok) {
        toast.error("Something went wrong");
        console.log(res.message);
      }
    });
  };

  return (
    <>
      <Button
        onClick={async () => await onClickHandler("up")}
        className={buttonClassName}
        disabled={buttonDisabled}
      >
        <ArrowBigUp {...upStyle} />
      </Button>
      <p className="text-lg">{star}</p>
      <Button
        onClick={async () => await onClickHandler("down")}
        className={buttonClassName}
        disabled={buttonDisabled}
      >
        <ArrowBigDown {...downStyle} />
      </Button>
    </>
  );
}

// INFO:------CUSTOM STYLING------
const buttonClassName =
  "p-0 bg-transparent hover:bg-transparent hover:scale-125 transition-all disabled:cursor-not-allowed";
const neutralStyle = {
  fill: "transparent",
  color: "hsl(var(--foreground))",
  size: 34,
};
const voteUpStyle = { ...neutralStyle, fill: "#87A922", color: "#87A922" };
const votedownstyle = { ...neutralStyle, fill: "#FF204E", color: "#FF204E" };
