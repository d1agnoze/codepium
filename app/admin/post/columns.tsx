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
import { toast } from "react-toastify";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { copyToClipboard } from "@/utils/data-table.utils";
import PostDeleteDialog from "@/components/dialogs/post-delete.dialog";
import PostRestoreDialog from "@/components/dialogs/post_restore.dialog";
import { post_admin } from "@/types/post_admin.type";
import moment from "moment";

export const columns: ColumnDef<post_admin>[] = [
  { id: "No", header: "No", cell: ({ row }) => row.index + 1 },
  {
    accessorKey: "id",
    header: "uid",
    enableSorting: false,
    cell: ({ row }) => <div className="truncate w-14">{row.original.id}</div>,
  },
  { accessorKey: "title", header: "Title" },
  { accessorKey: "likes", header: "Likes" },
  {
    accessorKey: "user_id",
    header: "User's uid",
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
    accessorKey: "isDeleted",
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
      <div className={`${row.original.isDeleted ? "text-error" : ""}`}>
        {row.original.isDeleted ? "Deleted" : "Active"}
      </div>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const post = row.original;
      const [open, setOpen] = useState(false);
      const router = useRouter();

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
              onClick={() => copyToClipboard(post.id, "Copied!")}
            >
              Copy article's id
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => copyToClipboard(post.user_id, "Copied!")}
            >
              Copy user's id
            </DropdownMenuItem>

            {!post.isDeleted && (
              <PostDeleteDialog id={post.id} onSuccess={onSuccess}>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="focus:bg-destructive"
                  disabled={post.isDeleted}
                >
                  Delete article
                </DropdownMenuItem>
              </PostDeleteDialog>
            )}
            {post.isDeleted && (
              <PostRestoreDialog id={post.id} onSuccess={onSuccess}>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  disabled={!post.isDeleted}
                >
                  Restore article
                </DropdownMenuItem>
              </PostRestoreDialog>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Navigate</DropdownMenuLabel>
            <DropdownMenuItem disabled={post.isDeleted}>
              <Link href={`/question/${post.id}`}>View post</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
