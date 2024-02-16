import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { v1 as uuidv1 } from "uuid";
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies: () => cookies() });
  const formData = await request.formData();
  const { data: { user } } = await supabase.auth.getUser();
  //Check if user is authenticated
  if (!user) {
    return Response.json({ message: "Upload failed: Unauthorized user" }, {
      status: 401,
      statusText: "Unauthorized uploading",
    });
  }

  const file = formData.get("file") as File;
  const thread_id = formData.get("thread_id");
  const type = formData.get("type");

  //check if thread_id is available
  if (!thread_id || (type !== "question" && type !== "post")) {
    return Response.json({ message: "Upload failed: field(s) invalid" }, {
      status: 400,
      statusText: "Bad Request",
    });
  }

  const filename = `${user.id}/question/${user.id}_${thread_id}_${uuidv1()}`;
  const { error } = await supabase
    .storage
    .from("question_images")
    .upload(filename, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    return Response.json({ message: "Upload failed:" + error.message }, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
  return Response.json({ message: "Success" }, {
    status: 200,
    statusText: "Upload Successfully",
  });
}
