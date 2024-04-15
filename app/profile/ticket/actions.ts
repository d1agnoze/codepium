"use server";

import { ticket_schema } from "@/schemas/ticket.schema";
import { ticket_update_schema } from "@/schemas/ticket_update.schema";
import { MessageObject } from "@/types/message.route";
import { ticket, ticket_status } from "@/types/ticket.type";
import Supabase from "@/utils/supabase/server-action";
import { getUser } from "@/utils/supabase/user";
import { formatZodError } from "@/utils/zodErrorHandler";

export const createTicket = async (
  _: any,
  formData: FormData,
): Promise<MessageObject> => {
  try {
    const sb = Supabase();
    const user = await getUser(sb);
    const status = ticket_status.open;
    const valid = ticket_schema.safeParse({
      title: formData.get("title"),
      message: formData.get("message"),
      relatedId: formData.get("relatedId"),
    });

    if (!valid.success) throw new Error(formatZodError(valid.error));

    const { error } = await sb.from("Ticket").insert({
      title: valid.data.title,
      message: valid.data.message,
      relatedId: valid.data.relatedId,
      sender: user.id,
      status,
    });

    if (error) throw new Error(error.message);

    return { message: "Ticket created successfully", ok: true };
  } catch (err: any) {
    return { message: err.message, ok: false };
  }
};

export const updateTicket = async (_: any, formData: FormData) => {
  try {
    const sb = Supabase();
    const valid = ticket_update_schema.safeParse({
      id: formData.get("id"),
      title: formData.get("title"),
      message: formData.get("message"),
      relatedId: formData.get("relatedId"),
    });

    if (!valid.success) throw new Error(formatZodError(valid.error));

    const releated = valid.data.relatedId
      ? { relatedId: valid.data.relatedId }
      : { relatedId: null };

    const { error } = await sb
      .from("Ticket")
      .update({
        title: valid.data.title,
        message: valid.data.message,
        ...releated,
      })
      .eq("id", valid.data.id);

    if (error) throw new Error(error.message);

    return { message: "Ticket update successfully", ok: true };
  } catch (err: any) {
    return { message: err.message, ok: false };
  }
};

export const deleteTicket = async (id: number) => {
  try {
    const sb = Supabase();
    const { error } = await sb
      .from("Ticket")
      .update({ status: ticket_status.close })
      .eq("id", id);

    if (error) throw new Error(error.message);

    return;
  } catch (err: any) {
    throw err;
  }
};

export const getTicketById = async (id: number) => {
  try {
    const sb = Supabase();
    const { data, error } = await sb
      .from("Ticket")
      .select()
      .eq("id", id)
      .single<ticket>();

    if (error || !data) throw new Error(error.message);

    return data;
  } catch (err: any) {
    throw err;
  }
};

export const getTickets = async () => {
  try {
    const sb = Supabase();
    const user = await getUser(sb);

    const { data, error } = await sb
      .from("Ticket")
      .select()
      .eq("sender", user.id)
      .returns<ticket[]>();

    if (error || !data) throw new Error(error.message);

    return data;
  } catch (err: any) {
    throw err;
  }
};
