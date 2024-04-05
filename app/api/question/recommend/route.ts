import { PAGINATION_SETTINGS as PA_SET } from "@/defaults/browsing_paginatioin";
import { paginationSchema } from "@/schemas/pagination.schema";
import { Pagination } from "@/types/pagination.interface";
import { question_seo } from "@/types/question.seo";
import { BadRequest, OK, ServerError } from "@/utils/httpStatus/utils";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies: () => cookies() });
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || PA_SET.page.toString();
  const limit = searchParams.get("limit") || PA_SET.limit.toString();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return BadRequest("User not Authenticated");

  const { data: user_exp, error: exp_err } = await supabase
    .from("ExpertiseTracker")
    .select("expertise_id")
    .eq("user_id", user.id)
    .returns<{ expertise_id: number }[]>();

  /* ERR: IF user has no expertise or error*/
  if (exp_err || user_exp == null || user_exp.length == 0)
    return { data: [], total: 0, page: 1, limit: 10 };
  const tags = user_exp.map((exp) => exp.expertise_id);

  const params = paginationSchema.safeParse({
    page: parseInt(page),
    limit: parseInt(limit),
  });

  /* ERR: error handling*/
  if (!params.success) return BadRequest();
  const valid = params.data;

  /* NOTE : query */
  const { count, error: c_err } = await supabase
    .from("get_question_seo")
    .select("*", { count: "exact", head: true });

  const { data, error } = await supabase
    .from("get_question_seo")
    .select()
    .overlaps("tag", tags)
    .range((valid.page - 1) * valid.limit, valid.page * valid.limit - 1)
    .returns<question_seo[]>();

  if (c_err || count == null || data == null || error) {
    return ServerError();
  }

  /* INFO: return result */
  const result: Pagination<question_seo> = {
    data: data || [],
    total: Math.ceil(count / valid.limit) || 0,
    page: valid.page,
    limit: valid.limit,
  };

  return OK(result);
}
