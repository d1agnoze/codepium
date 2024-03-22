import { VoteEnum } from "@/enums/vote.enum";
import { z } from "zod";

export const voteSchema = z.object({
  thread_id: z.string().transform((val) => val === "" ? null : val),
  source_id: z.string().min(16),
  user_id: z.string().min(16),
  mode: z.enum(["question", "answer", "post"]),
  impact: z.enum([
    VoteEnum.up.toString(),
    VoteEnum.down.toString(),
    VoteEnum.neutral.toString(),
  ]).transform((arg, ctx) => {
    const convert = parseInt(arg);
    if (isNaN(convert)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid vote direction",
      });
      return z.NEVER;
    }
    return convert;
  }),
  direction: z.string().transform((val) => val === "true"),
  final_stat: z.enum([
    VoteEnum.up.toString(),
    VoteEnum.down.toString(),
    VoteEnum.neutral.toString(),
  ]).transform((arg, ctx) => {
    const convert = parseInt(arg);
    if (isNaN(convert)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid vote direction",
      });
      return z.NEVER;
    }
    return convert;
  }),
});
