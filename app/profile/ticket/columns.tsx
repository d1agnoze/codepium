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
import { ticket, ticket_status } from "@/types/ticket.type";
import UpdateTicketDialog from "@/components/ticket/update_dialog";
import TicketDetailDialog from "@/components/ticket/TicketDetailDialog";
import { CloseTicketDialog } from "@/components/ticket/alert_close_ticket";

export const columns: ColumnDef<ticket>[] = [
  { id: "No", header: "No", cell: ({ row }) => row.index + 1 },
  {
    accessorKey: "title",
    header: "Title",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="truncate max-w-[100px]">{row.original.title}</div>
    ),
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => (
      <div className="truncate max-w-[100px]">{row.original.message}</div>
    ),
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
    accessorKey: "relatedId",
    header: "Related Id",
    cell: ({ row }) => {
      const content = row.original.relatedId;
      const isEmtpy = content === "" || content == null;
      return <div className="w-28 truncate"> {isEmtpy ? "-" : content} </div>;
    },
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

            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <UpdateTicketDialog ticket={ticket} onSuccess={onSuccess}>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                disabled={ticket.status === ticket_status.close}
              >
                Update the ticket
              </DropdownMenuItem>
            </UpdateTicketDialog>

            <CloseTicketDialog id={ticket.id} onSuccess={onSuccess}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Close the ticket
              </DropdownMenuItem>
            </CloseTicketDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const sort = (col: Column<ticket, unknown>) =>
  col.toggleSorting(col.getIsSorted() === "asc");
const format = (date: string) =>
  moment(new Date(date)).format("DD-MM-YYYY").toString();
