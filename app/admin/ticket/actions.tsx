"use server";
import { sendNotification } from "@/helpers/supabase/notification.server";
import { ticket_status } from "@/types/ticket.type";
import { TicketAdmin } from "@/types/ticket_admin.type";
import Supabase from "@/utils/supabase/server-action";
import { getUser } from "@/utils/supabase/user";

export const getTickets = async () => {
  try {
    const sb = Supabase();

    const { data, error } = await sb
      .from("get_ticket_admin")
      .select()
      .returns<TicketAdmin[]>();

    if (error || !data) throw new Error(error.message);

    return data;
  } catch (err: any) {
    throw err;
  }
};

export const deleteTicket = async (ticket: TicketAdmin) => {
  try {
    const sb = Supabase();
    const { error } = await sb
      .from("Ticket")
      .update({ status: ticket_status.close })
      .eq("id", ticket.id);

    if (error) throw new Error(error.message);

    sendFeedback(
      ticket,
      "ADMIN: Your ticket has been closed, id: " + ticket.id,
    );

    return;
  } catch (err: any) {
    throw err;
  }
};

export const sendFeedback = async (ticket: TicketAdmin, message: string) => {
  try {
    const sb = Supabase();
    const user = await getUser(sb);
    const url =
      ticket.relatedId == null || ticket.relatedId === ""
        ? null
        : ticket.relatedId;
    sendNotification(sb, {
      message,
      sender: user.id,
      receiver: ticket.sender_id,
      source_ref: ticket.relatedId,
      thread_ref: url,
    });
  } catch (err: any) {
    throw err;
  }
};
