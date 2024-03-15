import { comment } from "@/types/comment.type";
import { modes } from "@/types/modes.type";
import { BadRequest, ServerError } from "@/utils/httpStatus/utils";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies: () => cookies() });
  const { searchParams } = new URL(request.url);

  const thread_ref = searchParams.get("thread_ref");
  const parent_ref = searchParams.get("parent_ref");
  const showAll = searchParams.get("showall");
  const mode = searchParams.get("mode");

  if (
    !thread_ref ||
    !parent_ref ||
    !showAll ||
    !mode ||
    mode.trim() === "comment"
  ) {
    return BadRequest();
  }

  const showAllBool = showAll.trim().toLowerCase() === "true";

  let baseQuery = supabase.from("get_comment_full").select()
    .order("created_at", { ascending: true }).eq("thread_ref", thread_ref);

  switch (mode) {
    case "question":
      if (!showAllBool) {
        baseQuery = baseQuery.eq("parent_ref", thread_ref).eq(
          "mode",
          "question",
        );
      } else {
        baseQuery = baseQuery.eq("parent_ref", parent_ref)
          .in("mode", ["question", "comment"]);
      }
      break;
    case "post":
      baseQuery = baseQuery.eq("parent_ref", thread_ref);
      if (!showAllBool) {
        baseQuery = baseQuery.eq("mode", "post");
      } else {
        baseQuery = baseQuery.in("mode", ["post", "comment"]);
      }
    case "answer":
      if (!showAllBool) {
        baseQuery = baseQuery.eq("parent_ref", parent_ref).eq("mode", "answer");
      } else {
        baseQuery = baseQuery.eq("parent_ref", parent_ref).in("mode", [
          "answer",
          "comment",
        ]);
      }
      break;
  }

  if (!showAllBool) {
    baseQuery = baseQuery.limit(3);
  }

  const { data, error } = await baseQuery.returns<comment[]>();
  console.log(data?.length);

  if (error) return ServerError();

  return Response.json(data);
}
