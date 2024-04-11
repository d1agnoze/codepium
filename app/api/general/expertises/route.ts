import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const { data, error } = await supabase
    .from("Expertise")
    .select(`id, display_name`)
    .eq("isDisabled", false);
  if (error) return NextResponse.error();
  return Response.json(data);
}

