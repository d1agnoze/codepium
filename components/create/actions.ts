"use server";

import { AuthError } from "@/helpers/error/AuthError";
import { ReputationError } from "@/helpers/error/ReputationError";
import { SupabaseError } from "@/helpers/error/SupabaseError";
import { ValidationError } from "@/helpers/error/ValidationError";
import { postSchema } from "@/schemas/post-submit.schema";
import { questionSchema } from "@/schemas/question-submit.schema";
import { ReputationService } from "@/services/reputation.service";
import { MessageObject } from "@/types/message.route";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function createQuestion(
  _: any,
  formData: FormData,
): Promise<MessageObject> {
  try {
    const supabase = createServerActionClient({ cookies });
    // INFO: check if user exists
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new AuthError("Unauthorized request");

    // INFO: validate
    const validate = questionSchema.safeParse({
      title: formData.get("title"),
      content: formData.get("content"),
      expertises: JSON.parse(formData.getAll("expertises").toString()),
    });
    if (!validate.success)
      throw new ValidationError(
        "Bad request",
        validate.error.issues.map((x) => x.message),
      );

    // INFO: create question with reputation system
    const reputation = new ReputationService(supabase, user);

    const { data, error }: PostgrestSingleResponse<string> =
      await reputation.doAction("question", async () => {
        const res = await supabase.rpc("create_question", {
          content: validate.data.content,
          expertise: validate.data.expertises.map((item) => item.id),
          title: validate.data.title,
        });
        if (res.error) throw new SupabaseError(res.error.message);
        return res;
      });

    // const { data, error } = await supabase.rpc("create_question", {
    //   content: validate.data.content,
    //   expertise: validate.data.expertises.map((item) => item.id),
    //   title: validate.data.title,
    // });
    if (error) throw new Error(error.message);

    return { message: data, ok: true };
  } catch (err: any) {
    if (err instanceof ValidationError) {
      const msg = err.getDetails().join("\n\t");
      return { message: err.message + "\n" + msg, ok: false };
    }
    if (err instanceof AuthError) {
      return { message: err.message, ok: false };
    }
    if (err instanceof ReputationError) {
      console.log(err.getDetails());
      return { message: err.message, ok: false };
    }

    return { message: err.message, ok: false };
  }
}

/**
 * @function createPost: create new post
 * @param _: prev state, doesnt do anything
 * @param formData
 */
export async function createPost(
  _: any,
  formData: FormData,
): Promise<MessageObject> {
  try {
    const supabase = createServerActionClient({ cookies });
    // INFO: check if user exists
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new AuthError("Unauthorized request");

    /*INFO: Check for user reputation*/
    const rep = new ReputationService(supabase, user);
    const allow = await rep.guardAction("comment");
    if (!allow) throw new ReputationError("Error fetching reputation point");

    const validate = postSchema.safeParse({
      title: formData.get("title"),
      content: formData.get("content"),
      expertises: JSON.parse(formData.getAll("expertises").toString()),
    });
    if (!validate.success)
      throw new ValidationError(
        "Error validating request data",
        validate.error.issues.map((issue) => issue.message),
      );

    const { data, error } = await supabase.rpc("create_post", {
      content: validate.data.content,
      expertise: validate.data.expertises.map((item) => item.id),
      title: validate.data.title,
    });

    if (error) throw new Error(error.message);
    if (data) return { message: data, ok: true };
  } catch (err: any) {
    if (err instanceof ValidationError) {
      const msg = err.getDetails().join("\n\t");
      return { message: err.message + "\n" + msg, ok: false };
    }
    if (err instanceof AuthError) {
      return { message: err.message, ok: false };
    }
    return { message: err.message, ok: false };
  }
  return { message: "Internal Server Error", ok: false };
}
