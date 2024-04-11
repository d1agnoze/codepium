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
import moment from "moment";
import { expertise_admin } from "@/types/expertise-admin.type";
import ExpertiseDisableDialog from "@/components/dialogs/exp_disable.dialog";
import ExpertiseActiveDialog from "@/components/dialogs/exp_active.dialog";
import UpdateExpertiseDialog from "@/components/dialogs/update_exp.dialog";

export const columns: ColumnDef<expertise_admin>[] = [
  { id: "No", header: "No", cell: ({ row }) => row.index + 1 },
  {
    accessorKey: "id",
    header: "uid",
    enableSorting: false,
    cell: ({ row }) => <div className="truncate w-14">{row.original.id}</div>,
  },
  { accessorKey: "display_name", header: "Title" },
  {
    accessorKey: "question_count",
    header: ({ column }) => (
      <Button
        variant={"ghost"}
        className="px-2 text-info"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Question Count
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-info">{row.original.question_count}</div>
    ),
  },
  {
    accessorKey: "post_count",
    header: ({ column }) => (
      <Button
        variant={"ghost"}
        className="px-2 text-orange-400"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Post Count
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-orange-400">{row.original.post_count}</div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    enableSorting: true,
    cell: ({ row }) => (
      <div>
        {moment(new Date(row.original.created_at))
          .format("DD-MM-YYYY")
          .toString()}
      </div>
    ),
  },
  {
    accessorKey: "isDisabled",
    header: ({ column }) => (
      <Button
        variant={"ghost"}
        className="px-2 "
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Article State
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className={`${row.original.isDisabled ? "text-error" : ""}`}>
        {row.original.isDisabled ? "Disabled" : "Active"}
      </div>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const exp = row.original;
      const [open, setOpen] = useState(false);
      const router = useRouter();

      const onSuccess = () => {
        toast.success("Action Success");
        router.refresh();
        sessionStorage.clear();
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
            <UpdateExpertiseDialog
              id={exp.id}
              onSuccess={onSuccess}
              oldName={exp.display_name}
            >
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Update expertise
              </DropdownMenuItem>
            </UpdateExpertiseDialog>
            {!exp.isDisabled && (
              <ExpertiseDisableDialog id={exp.id} onSuccess={onSuccess}>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="focus:bg-destructive"
                  disabled={exp.isDisabled}
                >
                  Deactivate expertise
                </DropdownMenuItem>
              </ExpertiseDisableDialog>
            )}
            {exp.isDisabled && (
              <ExpertiseActiveDialog id={exp.id} onSuccess={onSuccess}>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  disabled={!exp.isDisabled}
                >
                  Activate expertise
                </DropdownMenuItem>
              </ExpertiseActiveDialog>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
