import { DEF_SB_EXP_NO } from "@/defaults/sidebar";
import { question_seo } from "@/types/question.seo";
import { QuestionSidebar } from "@/types/question.sidebar";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const res: QuestionSidebar = { question: [], expertises: [] };
  const { data: expertise, error: exp_err } = await supabase
    .from("Expertise")
    .select()
    .order("created_at", { ascending: false })
    .limit(DEF_SB_EXP_NO)
    .returns<Expertise[]>();

  const { data: question, error: ques_err } = await supabase
    .from("get_question_seo")
    .select()
    .order("created_at", { ascending: false })
    .limit(DEF_SB_EXP_NO)
    .returns<question_seo[]>();

  if (exp_err || ques_err) return NextResponse.error();

  res.expertises = expertise;
  res.question = question;

  return Response.json(res);
}
