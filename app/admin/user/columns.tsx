"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { user_admin as User } from "@/types/user.admin";
import moment from "moment";
import BanUserDialog from "@/components/dialogs/ban-user.dialog";
import { UnbanUser } from "./actions";
import { copyToClipboard } from "@/utils/data-table.utils";

export const columns: ColumnDef<User>[] = [
  { id: "No", header: "No", cell: ({ row }) => row.index + 1 },
  {
    accessorKey: "id",
    header: "uid",
    enableSorting: false,
    cell: ({ row }) => <div className="truncate w-14">{row.original.id}</div>,
  },
  { accessorKey: "user_name", header: "Username" },
  { accessorKey: "display_name", header: "Display name" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant={"ghost"}
        className="px-2 "
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Joined date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        {moment(new Date(row.original.created_at)).format("YYYY-MM-DD")}
      </div>
    ),
  },
  {
    accessorKey: "banned_until",
    header: "Banned until",
    cell: ({ row }) => {
      const bandate = row.original.banned_until;
      return (
        <div className={`${bandate ? "text-red-500" : "text-success"}`}>
          {bandate ? moment(new Date(bandate)).format("YYYY-MM-DD") : "-"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const [open, setOpen] = useState(false);
      const router = useRouter();
      const isBanned = user.banned_until != null;

      const onSuccess = () => {
        toast.success("Action Success");
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
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onSelect={(_) => copyToClipboard(user.id, "Copied")}
            >
              Copy user id
            </DropdownMenuItem>
            {!isBanned && (
              <BanUserDialog id={user.id} onSuccess={onSuccess}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Ban user
                </DropdownMenuItem>
              </BanUserDialog>
            )}
            {isBanned && (
              <DropdownMenuItem onSelect={() => unban_user(user.id, onSuccess)}>
                Revoke user ban
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const unban_user = async (id: string, onSuccess: () => void) => {
  try {
    await UnbanUser(id);
    onSuccess();
    return;
  } catch (err: any) {
    throw err;
  }
};
