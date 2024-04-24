import { PAGINATION_SETTINGS as P_S } from "@/defaults/browsing_paginatioin";
import { BadRequestError } from "@/helpers/error/BadRequestError";
import { InternalServerError } from "@/helpers/error/ServerError";
import { paginationSchema } from "@/schemas/pagination.schema";
import { Result } from "@/types/get_seo.route";
import { question_seo } from "@/types/question.seo";
import { BadRequest, OK, ServerError } from "@/utils/httpStatus/utils";
import { getPagination } from "@/utils/pagination.utils";
import Supabase from "@/utils/supabase/route-handler";
import { formatZodError } from "@/utils/zodErrorHandler";

export async function GET(request: Request) {
  try {
    const viewName = "get_question_seo";

    const supabase = Supabase();
    let query = supabase.from(viewName).select("*", { count: "exact" });

    const { searchParams } = new URL(request.url);
    const filter_str = searchParams.get("tag");
    const search = searchParams.get("search");

    const from_date = new Date(searchParams.get("from") ?? "1900-1-1");
    const to_date = new Date(searchParams.get("to") ?? new Date());

    const filter = filter_str ? filter_str.split(",") : [];

    const params = paginationSchema.safeParse({
      page: parseInt(searchParams.get("page") || P_S.page.toString()),
      limit: parseInt(searchParams.get("limit") || P_S.limit.toString()),
    });

    /* INFO: error handling*/
    if (!params.success)
      throw new BadRequestError(formatZodError(params.error));

    /* INFO : query */
    if (search) {
      query = query.textSearch("title", `${search}`, {
        type: "websearch",
        config: "english",
      });
    }

    if (filter && filter.length > 0) {
      query = query.overlaps("tag", [...filter]);
    }
    if (from_date != null || to_date != null) {
      query = query
        .lt("created_at", to_date.toISOString())
        .gt("created_at", from_date.toISOString());
    }

    const { from, to } = getPagination(params.data.page, params.data.limit);

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to)
      .returns<question_seo[]>();

    if (!data || error || count == null)
      throw new InternalServerError("Internal server error");

    /* INFO: return result */
    const result: Result<any> = {
      data: data,
      total: Math.ceil(count / params.data.limit) || 0,
      page: params.data.page,
      limit: params.data.limit,
    };

    return OK(result);
  } catch (err: any) {
    const msg = { message: err.message };

    console.log(err.message);

    if (err instanceof InternalServerError) return ServerError(msg);
    if (err instanceof BadRequestError) return BadRequest(msg);

    throw err;
  }
}
