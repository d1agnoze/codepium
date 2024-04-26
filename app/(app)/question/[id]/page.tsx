"use server";

import CommentComponent from "@/components/CommentComponent";
import VotingComponent from "@/components/VotingComponent";
import MDRenderer from "@/components/react-markdown/Markdown";
import AnswerDisplay from "@/components/question/AnswerDisplay";
import { VoteMode } from "@/enums/vote-mode.enum";
import { notFound } from "next/navigation";
import {
  getAnswerVotes,
  getAnswers,
  getExpertises,
  getQuestion,
  getQuestionVote,
  getReputation,
  getUser,
} from "./actions";
import { NotFoundError } from "@/helpers/error/NotFoundError";
import { FetchError } from "@/helpers/error/FetchError";
import BadgeList from "@/components/question/BadgeList";
import AvatarInfo from "@/components/question/AvatarInfo";
import AnswerButton from "@/components/question/AnswerButton";
import NoAnswerComponent from "@/components/question/NoAnswerComponent";
import { Answer } from "@/types/answer.type";
import { ResourceDeletedError } from "@/helpers/error/ResourceDeletedError";
import Archived from "./archievedComponent";

export default async function Page({ params }: { params: { id: string } }) {
  try {
    //fetch question from supabase
    const question = await getQuestion(params.id);

    if (question.isArchieved)
      throw new ResourceDeletedError(question.archieveReason ?? "Unspecified");

    //fetch user data
    const user = await getUser();

    // check if the thread is from the current user
    const fromUser = user != null && user.id === question.user_id;

    //get expertises tags of the thread
    const tags = await getExpertises(question.tag);

    //get answers from supabase
    const answers = await getAnswers(params.id);

    // INFO: get previous user data action
    const answer_ids = answers.map((ans) => ans.thread_ref);
    const questionVote = await getQuestionVote(question.id);
    const reputation = await getReputation();
    const answerVotes = await getAnswerVotes(question.id, answer_ids);

    return (
      <div className="w-full box-border px-3 lg:px-10 flex flex-col gap-1">
        <div className="w-full bg-hslvar px-4 py-5 rounded-lg">
          <div className="w-full flex max-sm:flex-col-reverse gap-2">
            <aside className="flex md:flex-col max-sm:flex-row-reverse gap-2 mx-3 pt-3 justify-start items-center">
              <VotingComponent
                fromUser={!!fromUser}
                thread_id={null}
                current_stars={question!.stars}
                mode={VoteMode.question}
                user_id={user?.id}
                source_id={question!.id}
                current_direction={questionVote}
              />
            </aside>
            <article className="flex-grow min-w-0">
              <div className="flex flex-col gap-3">
                <AvatarInfo fromUser={fromUser} question={question} />
                {tags && <BadgeList tags={tags} />}
                <h1 className="font-semibold text-xl">{question!.title}</h1>
                <main className="mt-1">
                  <MDRenderer
                    className={"text-md leading-relaxed"}
                    content={question!.content}
                  />
                </main>
              </div>
              <CommentComponent
                mode="question"
                user_id={user?.id}
                source_ref={question!.id}
                thread_id={question!.id}
                source_user_id={question!.user_id!}
                rep={reputation}
              />
            </article>
          </div>
        </div>

        {user != null && (
          <AnswerButton point={reputation} user={user} question={question} />
        )}

        <div>{answers?.length === 0 && <NoAnswerComponent />}</div>

        <div className="flex flex-col gap-3">
          {answers.sort(sortSetting).map((ans) => (
            <AnswerDisplay
              rep={reputation}
              current_user_id={user?.id ?? ""}
              key={ans.thread_ref}
              ans={ans}
              vote={answerVotes.get(ans.thread_ref)!}
            />
          ))}
        </div>
      </div>
    );
  } catch (err: any) {
    console.log(err.message);
    if (err instanceof NotFoundError) notFound();
    if (err instanceof FetchError) throw err;

    if (err instanceof ResourceDeletedError)
      return <Archived msg={err.message} />;
  }
}

const sortSetting = (a: Answer, b: Answer) =>
  a.status === b.status ? a.stars - b.stars : +b.status - +a.status;
