import { get_comment_schema } from "@/schemas/get_comment_schema";
import { paginationSchema } from "@/schemas/pagination.schema";
import { comment } from "@/types/comment.type";
import { BadRequest, ServerError } from "@/utils/httpStatus/utils";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies: () => cookies() });
  const { searchParams } = new URL(request.url);

  const validated = get_comment_schema.safeParse({
    thread_ref: searchParams.get("thread_ref"),
    parent_ref: searchParams.get("parent_ref"),
    mode: searchParams.get("mode"),
  });

  // convert the params to Number
  const params = paginationSchema.safeParse({
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "6"),
  });

  if (!validated.success || !params.success) return BadRequest();

  let baseQuery = supabase.from("get_comment_full").select()
    .order("created_at", { ascending: false }).eq(
      "thread_ref",
      validated.data.thread_ref,
    )
    .eq("parent_ref", validated.data.parent_ref)
    .in("mode", [validated.data.mode, "comment"]);

  const { count: count_data, error: count_err } = await supabase.from(
    "get_comment_full",
  ).select("*", { count: "exact", head: true }).eq(
    "thread_ref",
    validated.data.thread_ref,
  ).eq("parent_ref", validated.data.parent_ref)
    .in("mode", [validated.data.mode, "comment"]);

  if (count_err != null || count_data == null) {
    return ServerError();
  }
  if (count_data === 0) {
    return Response.json({ data: [], total: 0, page: 1, limit: 6 });
  }

  const { data, error } = await baseQuery.range(
    (params.data.page - 1) * params.data.limit,
    params.data.page * params.data.limit - 1,
  ).returns<comment[]>();

  if (error != null) {
    return ServerError();
  }

  const result: Result = {
    data: data || [],
    total: Math.ceil(count_data / params.data.limit) || 0,
    page: params.data.page,
    limit: params.data.limit,
  };

  return Response.json(result);
}

interface Result {
  data: comment[];
  total: number;
  page: number;
  limit: number;
}
