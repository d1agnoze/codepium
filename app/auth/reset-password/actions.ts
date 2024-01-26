"use server"
import { serverScheme } from "@/schemas/password-reset.schema";
import { MessageObject } from "@/types/message.route";
import Supabase from "@/utils/supabase/server-action";

export async function resetPassword(
  prevState: any,
  formData: FormData,
): Promise<MessageObject> {
  const validate = serverScheme.safeParse({
    password: formData.get("password"),
  });
  if (!validate.success) {
    return { message: validate.error.message, ok: false };
  }
  const { error } = await Supabase().auth.updateUser({
    password: validate.data.password,
  });
  if (error) {
    return { message: "An error has occured: " + error.message, ok: false };
  }
  return { message: "Password reset successfully!", ok: true };
}
