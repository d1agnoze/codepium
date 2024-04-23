import { VoteEnum } from "@/enums/vote.enum";
import { Answer } from "@/types/answer.type";

interface vote_prev_returned {
  thread_ref: string;
  user_status: VoteEnum;
}
interface vote_prev {
  thread_ref: string;
  direction: VoteEnum;
}
export function calculateVotes(
  arr1: vote_prev_returned[],
  arr2: Answer[],
): vote_prev[] {
  const index = arr1.map((x) => x.thread_ref);
  const res: vote_prev[] = arr2.map((item) => {
    return {
      thread_ref: item.thread_ref,
      direction: !index.includes(item.thread_ref)
        ? VoteEnum.neutral
        : arr1.filter((e) => e.thread_ref === item.thread_ref)[0].user_status,
    };
  });

  return res;
}

export function calculateVotes_remade(
  arr1: vote_prev_returned[],
  arr2: string[],
): vote_prev[] {
  const index = arr1.map((x) => x.thread_ref);
  const res: vote_prev[] = arr2.map((item) => {
    return {
      thread_ref: item,
      direction: !index.includes(item)
        ? VoteEnum.neutral
        : arr1.filter((e) => e.thread_ref === item)[0].user_status,
    };
  });

  return res;
}
