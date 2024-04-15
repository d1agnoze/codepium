"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { ticket, ticket_status } from "@/types/ticket.type";
import { PropsWithChildren } from "@/types/props_with_children";
import UpdateForm from "./update_form";

function UpdateTicketDialog(props: PropsWithChildren<Props>) {
  const [open, setOpen] = useState(false);
  const onSuccess = () => {
    setOpen(false);
    props.onSuccess();
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger disabled={props.ticket.status === ticket_status.close}>
        {props.children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Ticket</DialogTitle>
          <DialogDescription>
            <UpdateForm onSuccess={onSuccess} ticket={props.ticket} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
export default UpdateTicketDialog;

interface Props {
  ticket: ticket;
  onSuccess: () => void;
}
