"use server";

import { DEFAULT_SITE } from "@/defaults/site";
import { authSchema } from "@/schemas/auth-login.schema";
import { MessageObject } from "@/types/message.route";
import Supabase from "@/utils/supabase/server-action";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signIn(
  prev: any,
  formData: FormData,
): Promise<MessageObject> {
  const validate = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!validate.success) {
    return {
      message: "Log in unsuccessful, please check you email or password",
      ok: false,
    };
  }
  const { error } = await Supabase().auth.signInWithPassword({
    email: validate.data.email,
    password: validate.data.password,
  });
  if (error) {
    console.log(error);

    return { message: error.message, ok: false };
  }
  return { message: "Log in successful", ok: true };
}

export async function signOut() {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });
  await supabase.auth.signOut();
  return redirect("/");
}
export async function signUp(
  prev: any,
  formData: FormData,
): Promise<MessageObject> {
  const validate = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!validate.success) {
    return {
      message: "Log in unsuccessful, please check you email or password",
      ok: false,
    };
  }
  const { error } = await Supabase().auth.signUp({
    email: validate.data.email,
    password: validate.data.password,
    options: {
      emailRedirectTo: `${DEFAULT_SITE}/auth/callback`,
    },
  });
  if (error) return { message: error.message, ok: false };
  return { message: "Signup success! Please check your email!", ok: true };
}
