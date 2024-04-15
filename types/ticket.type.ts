export type ticket = {
  id: number;
  created_at: string;
  sender: string;
  title: string;
  message: string;
  relatedId: string;
  status: ticket_status;
};

export enum ticket_status {
  open = "open",
  close = "closed",
}
