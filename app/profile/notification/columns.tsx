"use client";
import { ColumnDef } from "@tanstack/react-table";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { toast } from "react-toastify";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { copyToClipboard } from "@/utils/data-table.utils";
import moment from "moment";
import { notification } from "@/types/notification.type";
import nProgress from "nprogress";
import { checkForNotiType } from "../actions";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const columns: ColumnDef<notification>[] = [
  { id: "No", header: "No", cell: ({ row }) => row.index + 1 },
  {
    accessorKey: "sender",
    header: "Sender",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="truncate max-w-[100px]">{row.original.sender}</div>
    ),
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => (
      <Popover>
        <PopoverTrigger>
          <div className="truncate">{row.original.message}</div>
        </PopoverTrigger>
        <PopoverContent>{row.original.message}</PopoverContent>
      </Popover>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant={"ghost"}
        className="px-2 "
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created at
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        {moment(new Date(row.original.created_at))
          .format("DD-MM-YYYY")
          .toString()}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const noti = row.original;
      const [open, setOpen] = useState(false);
      const router = useRouter();
      return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => copyToClipboard(noti.sender, "Copied!")}
            >
              Copy sender's id
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Navigate</DropdownMenuLabel>
            <DropdownMenuItem
              onSelect={() => navigateTo(noti.source_ref, router)}
            >
              Go to thread
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const navigateTo = async (id: string | null, router: AppRouterInstance) => {
  try {
    if (id == null) throw new Error("Cant find notification destination");
    nProgress.start();
    const type = await checkForNotiType(id);
    if (type == null) throw new Error("Cant find notification destination");
    router.push(`/${type}/${id}`);
  } catch (err: any) {
    toast.error(err.message);
  } finally {
    nProgress.done();
  }
};
