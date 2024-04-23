"use server";
import { AuthError } from "@/helpers/error/AuthError";
import { ReputationError } from "@/helpers/error/ReputationError";
import { SupabaseError } from "@/helpers/error/SupabaseError";
import { ValidationError } from "@/helpers/error/ValidationError";
import { answerSchema } from "@/schemas/answer-submit.schema";
import { ReputationService } from "@/services/reputation.service";
import { MessageObject } from "@/types/message.route";
import { Question } from "@/types/question.type";
import Supabase from "@/utils/supabase/server-action";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestSingleResponse, User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NotFoundError } from "@/helpers/error/NotFoundError";
import { FetchError } from "@/helpers/error/FetchError";
import { Answer } from "@/types/answer.type";
import { VoteEnum } from "@/enums/vote.enum";
import { calculateVotes_remade } from "@/utils/vote.utils";

export async function AnswerQuestion(
  _: any,
  formData: FormData,
): Promise<MessageObject> {
  try {
    const {
      data: { user },
    } = await Supabase().auth.getUser();

    const validated = answerSchema.safeParse({
      content: formData.get("content"),
      userValidated: JSON.parse(
        formData.get("userValidated")?.toString() ?? "false",
      ),
      user_id: formData.get("user_id"),
      thread_id: formData.get("thread_id"),
    });

    if (!validated.success) throw new ValidationError(validated.error.message);

    if (validated.data.user_id !== user?.id)
      throw new AuthError("User id does not match");

    const { data: question, error } = await Supabase()
      .from("questions")
      .select()
      .eq("id", validated.data.thread_id)
      .single<Question>();

    if (question == null || error)
      throw new Error("Bad request: Question not found");
    if (question.isArchieved)
      throw new Error(
        "Question is archieved due to:" + question.archieveReason,
      );

    // INFO: Fetch data from supabse using reputation system
    const rep = new ReputationService(Supabase(), user);
    const { data: ans_id } = await rep.doAction("verified_answer", async () => {
      const res: PostgrestSingleResponse<string> = await Supabase().rpc(
        "insert_answer",
        {
          answer_text: validated.data.content,
          question_id: validated.data.thread_id,
          valid: validated.data.userValidated,
        },
      );
      if (res.error) throw new SupabaseError(res.error.message);
      return res;
    });
    return { message: ans_id, ok: true };
  } catch (err: any) {
    if (err instanceof SupabaseError)
      return { message: err.message, ok: false };
    if (err instanceof ValidationError)
      return { message: err.message, ok: false };
    if (err instanceof AuthError) return { message: err.message, ok: false };
    if (err instanceof ReputationError)
      return { message: err.message, ok: false };
    return { message: err.message, ok: false };
  }
}

export async function VerifyAnswer(id: string): Promise<MessageObject> {
  const supabase = createServerActionClient({ cookies: () => cookies() });
  const { error } = await supabase.rpc("verify_answer", { ans_id: id });
  if (error) throw new Error(error.message);

  return { message: "answer verified", ok: true };
}
export async function UnverifyAnswer(id: string): Promise<MessageObject> {
  const supabase = createServerActionClient({ cookies: () => cookies() });
  const { error } = await supabase.rpc("unverify_answer", { ans_id: id });
  if (error) throw new Error(error.message);
  return { message: "answer unverified", ok: true };
}

export async function getUser(): Promise<User | null> {
  const supabase = Supabase();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getQuestion(id: string): Promise<Question> {
  const sb = Supabase();
  const { data: question, error } = await sb
    .from("get_question_full")
    .select()
    .eq("id", id)
    .limit(1)
    .maybeSingle<Question>();

  if (error || question == null)
    throw new NotFoundError("Fail to fetch question");

  return question;
}

export async function getAnswers(id: string): Promise<Answer[]> {
  const sb = Supabase();
  const { data: answers, error: ans_err } = await sb
    .from("get_answer_full")
    .select()
    .eq("source_ref", id)
    .returns<Answer[]>();

  if (ans_err || answers == null)
    throw new FetchError("Error fetching answers");

  return answers;
}

export async function getExpertises(ids: string[]): Promise<Expertise[]> {
  const sb = Supabase();
  const { data: tags, error: tag_err } = await sb
    .rpc("get_expertises_set", { uuids: ids })
    .returns<Expertise[]>();

  //another error handling
  if (tag_err || tags == null) throw new FetchError(tag_err.message);

  return tags;
}

export async function getUserData(
  q_id: string,
  a_ids: string[],
): Promise<UserVoteData> {
  try {
    const sb = Supabase();
    const user = await getUser();

    const res: UserVoteData = {
      answerVotes: [],
      rootVote: VoteEnum.neutral,
      reputation: 0,
    };

    // IMP: if there is no user, return
    if (user == null) return res;

    // INFO: Fetch data from supabase using reputation system
    const reputation = await new ReputationService(sb, user).getReputation();
    const point = reputation?.point ?? 0;

    // INFO: Fetch last vote for question
    const { data: question_vote, error: question_error } = await sb
      .from("get_vote_ques_post")
      .select("direction")
      .eq("source_ref", q_id)
      .eq("sender", user.id)
      .eq("thread_ref", q_id)
      .limit(1)
      .returns<{ direction: VoteEnum }[]>();

    if (question_error || !question_vote)
      throw new FetchError("Failed to fetch votes");

    const hasPreviousVote = question_vote != null && question_vote.length > 0;
    const root_vote = hasPreviousVote
      ? question_vote[0].direction
      : VoteEnum.neutral;

    // IMP: if there is no previous answer vote, return
    if (a_ids.length == 0) {
      return { ...res, rootVote: root_vote, reputation: point };
    }

    const { data: vote_ans, error: vote_ans_err } = await sb
      .from("get_vote_answer")
      .select("thread_ref, user_status")
      .eq("source_ref", q_id)
      .eq("sender", user.id)
      .in("thread_ref", a_ids)
      .returns<{ thread_ref: string; user_status: VoteEnum }[]>();

    if (vote_ans_err || !vote_ans)
      throw new FetchError("Failed to fetch votes");

    const prev_answer_vote = calculateVotes_remade(vote_ans, a_ids);

    return {
      reputation: point,
      answerVotes: prev_answer_vote,
      rootVote: root_vote,
    };
  } catch (err: any) {
    throw err;
  }
}

interface AnswerVoteData {
  thread_ref: string;
  direction: VoteEnum;
}
interface UserVoteData {
  answerVotes: AnswerVoteData[];
  rootVote: VoteEnum;
  reputation: number;
}
