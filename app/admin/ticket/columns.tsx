"use client";
import { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import { ticket_status } from "@/types/ticket.type";
import TicketDetailDialog from "@/components/ticket/TicketDetailDialog";
import { TicketAdmin } from "@/types/ticket_admin.type";
import { copyToClipboard } from "@/utils/data-table.utils";
import { CloseTicketDialogAdmin } from "@/components/dialogs/alert_close_ticket";
import { SendFeedbackDialog } from "@/components/dialogs/send_notification.dialog";

export const columns: ColumnDef<TicketAdmin>[] = [
  { id: "No", header: "No", cell: ({ row }) => row.index + 1 },
  { header: "Id", accessorKey: "id" },
  {
    accessorKey: "title",
    header: "Title",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="truncate max-w-[200px]">{row.original.title}</div>
    ),
  },
  {
    accessorKey: "user_name",
    header: "Sender",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="truncate max-w-[100px]">{row.original.user_name}</div>
    ),
  },
  {
    accessorKey: "sender_id",
    header: "Sender's id",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="truncate max-w-[100px]">{row.original.sender_id}</div>
    ),
  },
  {
    accessorKey: "relatedId",
    header: "Related Id",
    cell: ({ row }) => {
      const content = row.original.relatedId;
      const isEmtpy = content === "" || content == null;
      return <div className="w-28 truncate"> {isEmtpy ? "-" : content} </div>;
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button variant={"ghost"} className="px-2" onClick={() => sort(column)}>
        Created at
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{format(row.original.created_at)}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button variant={"ghost"} className="px-2" onClick={() => sort(column)}>
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div
        className={`${row.original.status === ticket_status.close ? "text-red-500" : "text-green-500"}`}
      >
        {row.original.status}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const ticket = row.original;
      const router = useRouter();
      const [open, setOpen] = useState(false);
      const onSuccess = () => {
        router.refresh();
        setOpen(false);
      };
      return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuLabel>View</DropdownMenuLabel>
            <TicketDetailDialog ticket={ticket}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                View ticket content
              </DropdownMenuItem>
            </TicketDetailDialog>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>Copy actions</DropdownMenuLabel>
            <DropdownMenuItem
              onSelect={(_) => copyToClipboard(ticket.id.toString(), "Copied")}
            >
              Copy ticket id
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(_) =>
                copyToClipboard(ticket.sender_id.toString(), "Copied")
              }
            >
              Copy sender id
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(_) =>
                copyToClipboard(ticket.relatedId.toString(), "Copied")
              }
            >
              Copy related id
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <SendFeedbackDialog ticket={ticket} onSuccess={onSuccess}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Send notification
              </DropdownMenuItem>
            </SendFeedbackDialog>
            <CloseTicketDialogAdmin ticket={ticket} onSuccess={onSuccess}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Close the ticket
              </DropdownMenuItem>
            </CloseTicketDialogAdmin>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const sort = (col: Column<TicketAdmin, unknown>) =>
  col.toggleSorting(col.getIsSorted() === "asc");
const format = (date: string) =>
  moment(new Date(date)).format("DD-MM-YYYY").toString();
