"use server";

import { ValidationError } from "@/helpers/error/ValidationError";
import { create_exp_schema } from "@/schemas/create-exp.schema";
import { update_exp_schema } from "@/schemas/update-exp.schemas";
import { createServerActionClient as initClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function ActiveExpertise(id: string) {
  try {
    const sb = initClient({ cookies: () => cookies() });
    const { error } = await sb
      .from("Expertise")
      .update({ isDisabled: false })
      .eq("id", id);
    if (error) throw new Error(error.message);
    return;
  } catch (err: any) {
    throw new Error(err.message);
  }
}
export async function DisableExpertise(id: string) {
  try {
    const sb = initClient({ cookies: () => cookies() });
    const { error } = await sb
      .from("Expertise")
      .update({ isDisabled: true })
      .eq("id", id);
    if (error) throw new Error(error.message);
    return;
  } catch (err: any) {
    throw new Error(err.message);
  }
}

export async function CreateExpertise(formData: FormData) {
  try {
    const valid = await create_exp_schema.safeParseAsync({
      name: formData.get("name"),
    });
    if (!valid.success) throw new ValidationError(valid.error.message);

    const sb = initClient({ cookies: () => cookies() });

    const { error } = await sb
      .from("Expertise")
      .insert({ display_name: valid.data.name });

    if (error) throw new Error(error.message);

    return;
  } catch (err: any) {
    throw err;
  }
}
export async function UpdateExpertise(id: string, name: string) {
  try {
    const valid = await update_exp_schema.safeParseAsync({ id, name });
    if (!valid.success) throw new ValidationError(valid.error.message);

    const sb = initClient({ cookies: () => cookies() });

    const { error } = await sb
      .from("Expertise")
      .update({ display_name: valid.data.name })
      .eq("id", valid.data.id);

    if (error) throw new Error(error.message);

    return;
  } catch (err: any) {
    throw err;
  }
}
