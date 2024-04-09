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
import Link from "next/link";
import { question_admin } from "@/types/question.admin";
import { toast } from "react-toastify";
import QuestionArchiveDialog from "@/components/dialogs/question_archive";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ChangeExpertise from "@/components/dialogs/change_exp";

export const columns: ColumnDef<question_admin>[] = [
  { id: "No", header: "No", cell: ({ row }) => row.index + 1 },
  {
    accessorKey: "id",
    header: "uid",
    enableSorting: false,
    cell: ({ row }) => <div className="truncate w-14">{row.original.id}</div>,
  },
  { accessorKey: "title", header: "Title" },
  { accessorKey: "stars", header: "Votes" },
  {
    accessorKey: "answer_count",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-2"
        >
          Answers
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-left px-2">
          {row.getValue<number>("answer_count")}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          className="px-2 "
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      const solved = row.getValue<boolean>("status");
      return (
        <div className={`${solved ? "text-accent" : ""} text-left px-2`}>
          {solved ? "Solved" : "Unsolved"}
        </div>
      );
    },
  },
  {
    accessorKey: "user_id",
    header: "Asker's uid",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="truncate max-w-[100px]">{row.original.user_id}</div>
    ),
  },
  {
    accessorKey: "isArchieved",
    header: ({ column }) => (
      <Button
        variant={"ghost"}
        className="px-2 "
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Archive state
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div
        className={`${row.original.isArchieved ? "text-error" : "text-accent"}`}
      >
        {row.original.isArchieved ? "Archived" : "Active"}
      </div>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const question = row.original;
      const [open, setOpen] = useState(false);
      const router = useRouter();

      const exps = question.tags.map<Expertise>((item) => {
        return { id: item.id, display_name: item.name };
      });

      const onSuccess = () => {
        toast.success("Question archived");
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
              onClick={() => copyToClipboard(question.id, "Copied!")}
            >
              Copy question's id
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => copyToClipboard(question.user_id, "Copied!")}
            >
              Copy user's id
            </DropdownMenuItem>
            <ChangeExpertise
              id={question.id}
              expertise={exps}
              onSuccess={onSuccess}
            >
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Question's Expertises
              </DropdownMenuItem>
            </ChangeExpertise>

            <QuestionArchiveDialog id={question.id} onSuccess={onSuccess}>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="focus:bg-destructive"
                disabled={question.isArchieved}
              >
                Archive question
              </DropdownMenuItem>
            </QuestionArchiveDialog>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Navigate</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link href={`/question/${question.id}`}>
                View question details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  /* {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }, */
];

const copyToClipboard = (value: string, message: string) => {
  navigator.clipboard.writeText(value);
  toast.info(message);
};
