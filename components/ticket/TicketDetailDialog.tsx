import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PropsWithChildren } from "@/types/props_with_children";
import { ticket, ticket_status } from "@/types/ticket.type";

function TicketDetailDialog (props: PropsWithChildren<Props>)  {
  const t = props.ticket;
  const isClosed = t.status === ticket_status.close;
  return (
    <Dialog>
      <DialogTrigger>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <p>
              <span className={`${isClosed ? "text-error" : "text-success"}`}>
                {props.ticket.status.toUpperCase()}:{" "}
              </span>
              {props.ticket.title}
            </p>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <h1 className="text-primary font-bold">Content:</h1>
          <p>{props.ticket.message}</p>
        </DialogDescription>
        <DialogFooter className="text-muted-foreground italic text-xs">
          Related Id: {props.ticket.relatedId}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default TicketDetailDialog;

interface Props {
  ticket: ticket;
}
