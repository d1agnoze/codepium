import { deleteTicket } from "@/app/admin/ticket/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PropsWithChildren } from "@/types/props_with_children";
import { TicketAdmin } from "@/types/ticket_admin.type";
import nProgress from "nprogress";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export function CloseTicketDialogAdmin(props: PropsWithChildren<Props>) {
  const [isSubmiting, setSubmiting] = useState(false);

  useEffect(() => {
    isSubmiting ? nProgress.start() : nProgress.done();
  }, [isSubmiting]);

  const onSelect = async () => {
    try {
      setSubmiting(true);
      await deleteTicket(props.ticket);
      toast.success("Ticket closed");
      props.onSuccess();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmiting(false);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{props.children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your mark
            your ticket as done.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(_) => onSelect()}
            disabled={isSubmiting}
            aria-disabled={isSubmiting}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface Props {
  ticket: TicketAdmin;
  onSuccess: () => void;
}
