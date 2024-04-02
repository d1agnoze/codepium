import { PAGINATION_SETTINGS as PAG_SET } from "@/defaults/browsing_paginatioin";
import { paginationSchema } from "@/schemas/pagination.schema";
import { Result } from "@/types/get_seo.route";
import { post_seo } from "@/types/post.seo";
import { BadRequest, OK, ServerError } from "@/utils/httpStatus/utils";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies: () => cookies() });
  let query = supabase.from("get_post_seo").select();
  let count_query = supabase
    .from("get_post_seo")
    .select("*", { count: "exact", head: true });
  const { searchParams } = new URL(request.url);
  const filter_str = searchParams.get("tag");
  const search = searchParams.get("search");
  const from_date = new Date(
    searchParams.get("from") ?? "1900-1-1",
  ).toISOString();
  const to_date = new Date(searchParams.get("to") ?? new Date()).toISOString();
  const filter = filter_str ? filter_str.split(",") : [];

  const params = paginationSchema.safeParse({
    page: parseInt(searchParams.get("page") || PAG_SET.page.toString()),
    limit: parseInt(searchParams.get("limit") || PAG_SET.limit.toString()),
  });

  /* INFO: error handling*/

  if (!params.success) return BadRequest();

  /* INFO : query */
  if (filter && filter.length > 0) {
    query = query.overlaps("tag", [...filter]);
    count_query = count_query.overlaps("tag", [...filter]);
  }
  if (search) {
    query = query.ilike("title", `%${search}%`);
    count_query = count_query.ilike("title", `%${search}%`);
  }
  if (from_date != null || to_date != null) {
    query = query.lt("created_at", to_date).gt("created_at", from_date);
    count_query = count_query
      .lt("created_at", to_date)
      .gt("created_at", from_date);
  }

  const { count, error: c_err } = await count_query;
  if (c_err || count == null) {
    console.log(count);
    return BadRequest();
  }

  const { data, error } = await query
    .range(
      (params.data.page - 1) * params.data.limit,
      params.data.page * params.data.limit - 1,
    )
    .returns<post_seo[]>();

  if (data == null || error) return ServerError();

  /* INFO: return result */
  const result: Result<any> = {
    data: data || [],
    total: Math.ceil(count / params.data.limit) || 0,
    page: params.data.page,
    limit: params.data.limit,
  };

  return OK(result);
}
