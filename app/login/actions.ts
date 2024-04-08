"use server";

import { DEFAULT_SITE } from "@/defaults/site";
import { authSchema } from "@/schemas/auth-login.schema";
import { MessageObject } from "@/types/message.route";
import Supabase from "@/utils/supabase/server-action";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signIn(
  _: any,
  formData: FormData,
): Promise<MessageObject> {
  try {
    const validate = authSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    /* INFO: Validation failed*/
    if (!validate.success) {
      const msg = "Log in unsuccessful, please check you email or password";
      throw new Error(msg);
    }
    const { error } = await Supabase().auth.signInWithPassword({
      email: validate.data.email,
      password: validate.data.password,
    });
    /* INFO: Sign in failed*/
    if (error) throw error;
    return { message: "Log in successful", ok: true };
  } catch (err: any) {
    return { message: err.message, ok: false };
  }
}

export async function signOut() {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });
  await supabase.auth.signOut();
  return redirect("/");
}

export async function signUp(
  _: any,
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
