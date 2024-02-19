import { QUESTION_IMAGE_BUCKET } from "@/defaults/storages";
import { UploadResponse } from "@/types/upload.route";
import {
  BadRequest,
  ServerError,
  Unauthorized,
} from "@/utils/httpStatus/utils";
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
    return Unauthorized({ message: "Upload failed: Unauthorized user" });
  }

  const file = formData.get("file") as File;
  const type = formData.get("type");

  //check if thread_id is available
  if (type !== "question" && type !== "post") {
    return BadRequest({ message: "Upload failed: field(s) invalid" });
  }

  const filename = `${user.id}/question/${user.id}_${uuidv1()}`;
  const { data, error } = await supabase
    .storage
    .from("question_images")
    .upload(filename, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) return ServerError({ message: "Upload failed:" + error.message });

  const { data: { publicUrl } } = supabase
    .storage
    .from(QUESTION_IMAGE_BUCKET)
    .getPublicUrl(data.path);

  return Response.json(
    { url: publicUrl, message: "Upload Successfully" } as UploadResponse,
    {
      status: 200,
      statusText: "OK",
    },
  );
}

// TODO: delete images if user leave the form unsubmitted
export async function DELETE(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies: () => cookies() });
  const formData = await request.formData();
  const { data: { user } } = await supabase.auth.getUser();

  //Check if user is authenticated
  if (!user) {
    return Unauthorized({ message: "Upload failed: Unauthorized user" });
  }


  return Response.json({}, { status: 200, statusText: "OK" });
}
