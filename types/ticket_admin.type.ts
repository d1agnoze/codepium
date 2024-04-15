import { ticket } from "./ticket.type";

export type TicketAdmin = {
  sender_id: string;
  user_name: string;
} & ticket;
