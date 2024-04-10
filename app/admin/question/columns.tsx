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
import moment from "moment";
import QuestionRestoreDialog from "@/components/dialogs/question_restore";

export const columns: ColumnDef<question_admin>[] = [
  { id: "No", header: "No", cell: ({ row }) => row.index + 1 },
  {
    accessorKey: "id",
    header: "uid",
    enableSorting: false,
    cell: ({ row }) => <div className="truncate w-14">{row.original.id}</div>,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="truncate w-80">{row.original.title}</div>
    ),
  },
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
        toast.success("Action success");
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

            {!question.isArchieved && (
              <QuestionArchiveDialog id={question.id} onSuccess={onSuccess}>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="focus:bg-destructive"
                  disabled={question.isArchieved}
                >
                  Archive question
                </DropdownMenuItem>
              </QuestionArchiveDialog>
            )}
            {question.isArchieved && (
              <QuestionRestoreDialog id={question.id} onSuccess={onSuccess}>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  disabled={!question.isArchieved}
                >
                  Restore question
                </DropdownMenuItem>
              </QuestionRestoreDialog>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Navigate</DropdownMenuLabel>
            {!question.isArchieved && (
              <DropdownMenuItem>
                <Link href={`/question/${question.id}`}>
                  View question details
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const copyToClipboard = (value: string, message: string) => {
  navigator.clipboard.writeText(value);
  toast.info(message);
};
