"use client";

import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useLayoutEffect, useState } from "react";
import { VoteEnum } from "@/enums/vote.enum";
import { VoteMode } from "@/enums/vote-mode.enum";
import { toast } from "react-toastify";
import { useFormState } from "react-dom";
import { INITIAL_MESSAGE_OBJECT } from "@/types/message.route";
import { createVote } from "@/app/(app)/actions";
import { handler } from "tailwindcss-animate";

interface VotingProps {
  fromUser: boolean;
  thread_id: string | null;
  current_stars: number;
  mode: VoteMode;
  user_id: string | undefined;
  source_id: string;
  current_direction: VoteEnum;
}

export default function VotingComponent(
  {
    fromUser,
    thread_id,
    current_stars,
    user_id,
    mode,
    source_id,
    current_direction,
  }: VotingProps,
) {
  const [vote, setVote] = useState<VoteEnum>(current_direction);
  const [star, setStar] = useState<number>(current_stars);
  const [isDirty, setIsDirty] = useState(false);
  const [dir, setDir] = useState<boolean | null>(null);

  const [state, formAction] = useFormState(createVote, INITIAL_MESSAGE_OBJECT);

  const upStyle = vote === VoteEnum.up ? voteUpStyle : neutralStyle;
  const downStyle = vote === VoteEnum.down ? votedownstyle : neutralStyle;
  const buttonDisabled = fromUser || !user_id;

  useLayoutEffect(() => {
    const handle = () => {
      if (isDirty) VoteHandler();
    };
    
    window.addEventListener("beforeunload", handle);
    return () => {
      window.removeEventListener("beforeunload", handle);
    };
  });

  useEffect(() => {
    if (vote !== current_direction) setIsDirty(true);

    if (vote === VoteEnum.up) setStar(current_stars + 1);
    if (vote === VoteEnum.down) setStar(current_stars - 1);
    if (vote === VoteEnum.neutral) setStar(current_stars);
  }, [vote]);

  useEffect(() => {
    if (state.message !== "" && !state.ok) toast.error(state.message);
  }, [state]);

  /**
   * click Handler: handler voting process client side
   * @param direction either up or down
   */
  const onClickHandler = (direction: "up" | "down") => {
    setDir(direction === "up");

    if (!fromUser) {
      setVote((prev) => {
        if (prev === VoteEnum.up && direction === "up") return VoteEnum.neutral;
        if (prev === VoteEnum.down && direction === "down") {
          return VoteEnum.neutral;
        }
        return direction === "up" ? VoteEnum.up : VoteEnum.down;
      });
    }
  };

  /**
   * Vote Hanlder: handler voting process to the server
   * @param direction VoteEnum
   * @thread_id id of the thread
   */
  const VoteHandler = async () => {
    const payload = new FormData();

    if (!user_id || !dir) return;

    payload.append("user_id", user_id);
    payload.append("thread_id", thread_id ?? "");
    payload.append("source_id", source_id);
    payload.append("mode", mode.toString());
    payload.append("impact", vote.toString());
    payload.append("direction", dir.toString());

    formAction(payload);
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
const voteUpStyle = { ...neutralStyle, fill: "#87A922", color: "#87A922" };
const votedownstyle = { ...neutralStyle, fill: "#FF204E", color: "#FF204E" };
