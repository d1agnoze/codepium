"use server";

import Pick from "@/components/create/Pick";
import PostForm from "@/components/create/Post";
import QuestionForm from "@/components/create/Question";

export default async function Page(
  { searchParams }: {
    searchParams: { [key: string]: string | string[] | undefined };
  },
) {
  const step: string | string[] | undefined = searchParams.mode;
  return (
    <div className="mx-auto ">
      {step
        ? (step === "post" || step === "question")
          ? (step === "post" ? <PostForm /> : <QuestionForm />)
          : <Pick />
        : <Pick />}
    </div>
  );
}
