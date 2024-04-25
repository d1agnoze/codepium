import { PAGINATION_SETTINGS as PA_SET } from "@/defaults/browsing_paginatioin";
import { AuthError } from "@/helpers/error/AuthError";
import { BadRequestError } from "@/helpers/error/BadRequestError";
import { paginationSchema } from "@/schemas/pagination.schema";
import { Pagination } from "@/types/pagination.interface";
import { post_seo } from "@/types/post.seo";
import {
  BadRequest,
  OK,
  ServerError,
  Unauthorized,
} from "@/utils/httpStatus/utils";
import { getPagination } from "@/utils/pagination.utils";
import Supabase from "@/utils/supabase/route-handler";
import { getUser } from "@/utils/supabase/user";
import { formatZodError } from "@/utils/zodErrorHandler";

export async function GET(request: Request) {
  try {
    const supabase = Supabase();
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || PA_SET.page.toString();
    const limit = searchParams.get("limit") || PA_SET.limit.toString();
    const user = await getUser(supabase);

    const { data: user_exp, error: exp_err } = await supabase
      .from("ExpertiseTracker")
      .select("expertise_id")
      .eq("user_id", user.id)
      .returns<{ expertise_id: number }[]>();

    /* INFO: IF user has no expertise or error*/
    if (exp_err || !user_exp || user_exp.length === 0)
      return OK({ data: [], total: 0, page: 1, limit: 10 });

    const tags = user_exp.map((exp) => exp.expertise_id);

    const params = paginationSchema.safeParse({
      page: parseInt(page),
      limit: parseInt(limit),
    });

    if (!params.success)
      throw new BadRequestError(formatZodError(params.error));

    const valid = params.data;
    const { from, to } = getPagination(valid.page, valid.limit);

    console.log("heer");

    /* NOTE : query */
    const { data, error, count } = await supabase
      .from("get_post_seo")
      .select("*", { count: "exact" })
      .overlaps("tag", tags)
      .range(from, to)
      .returns<post_seo[]>();

    if (count == null || data == null || error) {
      throw new Error(error?.message);
    }

    /* INFO: return result */
    const result: Pagination<post_seo> = {
      data: data || [],
      total: Math.ceil(count / valid.limit) || 0,
      page: valid.page,
      limit: valid.limit,
    };

    return OK(result);
  } catch (err: any) {
    const msg = { message: err.message };
    if (err instanceof AuthError) return Unauthorized(msg);
    if (err instanceof BadRequestError) return BadRequest(msg);
    return ServerError();
  }
}
