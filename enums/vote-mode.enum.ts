import { isValueInStringEnum } from "@/utils/enum.utils";

export enum VoteMode {
  question = "question",
  answer = "answer",
  post = "post",
}
export const isStringInVoteMode = isValueInStringEnum(VoteMode);
