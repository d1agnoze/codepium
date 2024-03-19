import { VoteEnum } from "@/enums/vote.enum";
import { Answer } from "@/types/answer.type";

interface vote_prev_returned {
  thread_ref: string;
  direction: boolean;
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
        : (arr1.filter((e) => e.thread_ref === item.thread_ref)[0].direction
          ? VoteEnum.up
          : VoteEnum.down),
    };
  });

  return res;
}
