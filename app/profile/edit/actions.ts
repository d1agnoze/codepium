"use server";

import { INITIAL_MESSAGE_OBJECT, MessageObject } from "@/types/message.route";

export async function EditThread(
  _: any,
  formData: FormData,
): Promise<MessageObject> {
  throw new Error("Method not implemented.");
}
export async function DeleteThread(formData: FormData): Promise<MessageObject> {
  // throw new Error("Method not implemented.");
  return INITIAL_MESSAGE_OBJECT;
}
