import { isValueInStringEnum } from "@/utils/enum.utils";

export enum ThreadMode {
  post = "post",
  question = "question",
}
export const threadModeChecker = isValueInStringEnum(ThreadMode);
