import { MessageObject } from "@/types/message.route";

export async function UpdateUser(
  _: any,
  formData: FormData,
): Promise<MessageObject> {

  return { message: "success", ok: true };
}
