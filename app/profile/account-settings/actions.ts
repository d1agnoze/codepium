"use server";

import { accountSettingsSchema as schema } from "@/schemas/account-settins.schema";
import { MessageObject } from "@/types/message.route";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function UpdateUser(
  _: any,
  formData: FormData,
): Promise<MessageObject> {
  const sb = createServerComponentClient({ cookies: () => cookies() });
  const {
    data: { user },
  } = await sb.auth.getUser();

  const valid = schema.safeParse({
    username: formData.get("username")?.toString().trim(),
    displayName: formData.get("displayName")?.toString().trim(),
    about: formData.get("about")?.toString().trim(),
    expertises: JSON.parse(formData.getAll("expertises").toString()),
  });

  /* ERR: error handling*/
  if (!user) return { message: "Unauthorized access!", ok: false, code: 401 };

  /* ERR: error handling*/
  if (!valid.success || valid.data.expertises.length === 0) {
    return { message: "Bad Request", ok: false };
  }

  const { error } = await sb.rpc("update_user", {
    new_about: valid.data.about,
    new_dn: valid.data.displayName,
    new_exp: valid.data.expertises.map((e) => e.id),
    new_un: valid.data.username,
  });

  /* ERR: error handling*/
  if (error) {
    console.log(error.message);
    return { message: error.message, ok: false };
  }

  return { message: "success", ok: true };
}
