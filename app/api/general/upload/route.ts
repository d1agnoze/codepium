import { QUESTION_IMAGE_BUCKET } from "@/defaults/storages";
import { ThreadMode, threadModeChecker } from "@/enums/thread-modes.enum";
import { SupabaseHelper } from "@/helpers/supabase/supabaseHelper";
import { ReputationService } from "@/services/reputation.service";
import { UploadResponse } from "@/types/upload.route";
import {
  BadRequest,
  OK,
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
  const rep = new ReputationService(supabase, user)
  const allow = await rep.guardAction("upload");

  if(!allow){
    return Unauthorized({ message: "Upload failed: Insufficient reputation" });
  }

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

export async function DELETE(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies: () => cookies() });
  const formData = await request.formData();
  const type = formData.get("type")?.toString().trim().toLowerCase();
  const { data: { user } } = await supabase.auth.getUser();
  const images = formData.get("images")?.toString();

  //Check if user is authenticated
  if (!user) {
    return Unauthorized({ message: "Upload failed: Unauthorized user" });
  }

  //Check if field are valid
  if (!images || images!.trim() === "" || !type || threadModeChecker(type)) {
    return BadRequest({ message: "Invalid delete request" });
  }

  const req: string[] = JSON.parse(images);
  const res: string[] = SupabaseHelper.getImagePath(req, "question_images");

  const bucket = `${
    type === ThreadMode.post as string
      ? ThreadMode.post.toString()
      : ThreadMode.question.toString()
  }_images`;

  const { error } = await supabase.storage.from(bucket).remove(res);

  //return error if unable to delete images
  if (error) return BadRequest({ message: "Invalid delete request" });

  return OK({});
}
