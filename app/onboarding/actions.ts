"use server";

import { formSchema } from "@/schemas/create-use.schema";
import { MessageObject } from "@/types/message.route";
import Supabase from "@/utils/supabase/route-handler";

export async function addMetadata(
  prevState: any,
  formData: FormData,
): Promise<MessageObject> {
  const validate = formSchema.safeParse({
    about: formData.get("about") ? formData.get("about") : "",
    username: formData.get("username"),
    displayName: formData.get("displayName"),
  });
  if (!validate.success) {
    const err = validate.error.errors.map((item) => item.message).toString();
    return { message: "Bad request: " + err, ok: false };
  }

  const supabase = Supabase();
  const user = (await supabase.auth.getUser()).data.user!;
  const res = await supabase.rpc("check_user_exists", { userid: user.id });
  const { data: email_col, error: email_err } = await supabase.from(
    "get_user_email",
  ).select("*");
  const email = email_col?.at(0)?.email ?? null;

  if (!(!!res.data)) {
    const { error } = await supabase.rpc("create_user_data", {
      username: validate.data.username,
      displayname: validate.data.displayName,
      about_param: validate.data.about,
      email: email,
    });
    return !error
      ? { message: "User data created", ok: true }
      : { message: "An Error has occured, please try again later", ok: false };
  }
  return { message: "User have already been created", ok: false };
}

export async function setExpertise(
  prevState: any,
  formData: FormData,
): Promise<MessageObject> {
  if (formData.get("data") == null) {
    return { message: "Bad request", ok: false };
  }
  const selected: string[] = JSON.parse(formData.get("data")?.toString()!);
  if (selected.length == 0) {
    return { message: "You cannot empty your expertise!", ok: false };
  }
  const { error } = await Supabase().rpc("update_expertise", {
    id_arr: selected,
  });
  if (error) return { message: "Update operation failed", ok: false };
  return { message: "Expertise confirmed", ok: true };
}
