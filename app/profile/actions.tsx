"use server";

import { USER_IMAGE_BUCKET } from "@/defaults/storages";
import { AuthError } from "@/helpers/error/AuthError";
import { notification } from "@/types/notification.type";
import { isFileImage } from "@/utils/file.utils";
import { createServerActionClient as initClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const UploadImage = async (formData: FormData): Promise<void> => {
  try {
    const file = formData.get("image") as File;

    if (!isFileImage(file)) throw new Error("Invalid file");

    const sb = initClient({ cookies: () => cookies() });
    /* INFO: get user */
    const {
      data: { user },
    } = await sb.auth.getUser();

    if (!user) throw new AuthError("Unauthorized access");

    /* INFO: Upload image to Supabase storage */
    const { data, error } = await sb.storage
      .from("users")
      .upload(`${user.id}/avatar.${file.type.split("/")[1]}`, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (!data || error) throw new Error(error.message);

    /* INFO: get public url */
    const {
      data: { publicUrl },
    } = sb.storage.from(USER_IMAGE_BUCKET).getPublicUrl(data.path);

    if (!publicUrl) throw new Error("Bad request: Invalid identity");

    /* INFO: update user profile */
    const { error: up_err } = await sb
      .from("Metadata")
      .update({ background_image: publicUrl })
      .eq("user_id", user.id);

    if (up_err) throw new Error(up_err.message);
  } catch (err: any) {
    throw err;
  }
};

export const getNotifications = async (): Promise<notification[]> => {
  try {
    const sb = initClient({ cookies: () => cookies() });
    const {
      data: { user },
    } = await sb.auth.getUser();

    if (!user) throw new AuthError("Unauthorized access");

    const { data, error } = await sb
      .from("Notification")
      .select()
      .eq("receiver", user.id)
      .order("created_at", { ascending: false })
      .returns<notification[]>();

    if (!data || error) throw new Error("Error fetching notifications");

    return data;
  } catch (err: any) {
    throw err;
  }
};

export const getNotificationsLastest = async (): Promise<notification[]> => {
  try {
    const sb = initClient({ cookies: () => cookies() });
    const {
      data: { user },
    } = await sb.auth.getUser();

    if (!user) throw new AuthError("Unauthorized access");

    const { data, error } = await sb
      .from("Notification")
      .select()
      .eq("receiver", user.id)
      .order("created_at", { ascending: false })
      .limit(3)
      .returns<notification[]>();

    if (!data || error) throw new Error("Error fetching notifications");

    return data;
  } catch (err: any) {
    throw err;
  }
};

export const checkForNotiType = async (
  id: string,
): Promise<"post" | "question" | null> => {
  try {
    const sb = initClient({ cookies: () => cookies() });
    const { count } = await sb
      .from("Question")
      .select("id", { count: "exact" })
      .eq("id", id);
    if (count == null) throw new Error("Error fetching notifications");
    if (count > 0) return "question";

    const { count: count2 } = await sb
      .from("Post")
      .select("id", { count: "exact" })
      .eq("id", id);
    if (count2 == null) throw new Error("Error fetching notifications");
    if (count2 > 0) return "post";

    return null;
  } catch (err: any) {
    throw err;
  }
};
