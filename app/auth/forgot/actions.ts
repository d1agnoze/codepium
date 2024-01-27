"use server";
import { formSchema } from "@/schemas/password-recovery.schema";
import { MessageObject } from "@/types/message.route";
import Supabase from "@/utils/supabase/server-action";

export async function confirmPasswordRecovery(
  prevState: any,
  formData: FormData,
): Promise<MessageObject> {
  const validate = formSchema.safeParse({
    email: formData.get("email"),
  });
  if (!validate.success) return { message: "Invalid email!", ok: false };
  const { error } = await Supabase().auth.resetPasswordForEmail(
    validate.data.email,
  );
  if (error) {
    return { message: "An error has occured: " + error.message, ok: false };
  }

  return { message: "email sent!", ok: true };
}
