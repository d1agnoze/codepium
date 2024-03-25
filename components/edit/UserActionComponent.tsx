"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArchiveX, CircleEllipsis, Pencil, Trash2 } from "lucide-react";
import { modes } from "@/types/modes.type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { DeleteThread } from "@/app/profile/edit/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { MessageObject } from "@/types/message.route";
import { hideLoading, showLoading } from "@/utils/loading.service";

const UserAction = (prop: Prop) => {
  const router = useRouter();
  /** Handler for edit action
   * @function editHandler
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} e
   * @todo add edit handler, clear sessionStorage after success
   */
  const editHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {};

  /** Handler for edit action
   * @function deleteHandler
   * @todo add delete handler, clear sessionStorage after success
   */
  const deleteHandler = () => {
    const payload = new FormData();
    payload.append("id", prop.id);
    payload.append("mode", prop.mode);

    DeleteThread(payload)
      .then((data: MessageObject) => {
        showLoading();
        sessionStorage.clear();
        toast.success(data.message);
        router.replace("/");
      })
      .catch((err) => toast.error(err.message))
      .finally(() => hideLoading());
  };

  return (
    <div className={`${!prop.visible && "hidden"} ${prop.className}`}>
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <CircleEllipsis
              className="text-gray-400 hover:scale-105 transition-all"
              size={prop.iconSize ?? 20}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col">
            <DropdownMenuLabel>Thread actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <TooltipProvider>
              <Tooltip open={prop.allowEdit?.allow === false && undefined}>
                <TooltipTrigger>
                  <DropdownMenuItem
                    onClick={editHandler}
                    disabled={prop.allowEdit?.allow === false}
                  >
                    <Pencil size={20} />
                    <p className="ml-3">Edit</p>
                  </DropdownMenuItem>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  sideOffset={10}
                  className="bg-accent text-secondary"
                >
                  <p>{prop.allowEdit?.message}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {/* DELETE BUTTON */}
            <DialogTrigger disabled={prop.allowDelete?.allow === false}>
              <TooltipProvider>
                <Tooltip open={prop.allowDelete?.allow === false && undefined}>
                  <TooltipTrigger>
                    <DropdownMenuItem
                      disabled={prop.allowDelete?.allow === false}
                    >
                      {prop.mode === "question"
                        ? <ArchiveX size={20} />
                        : <Trash2 size={20} />}
                      <p className="ml-3">
                        {`${
                          prop.mode === "question" ? "Archieve" : "Delete"
                        } this thread`}
                      </p>
                    </DropdownMenuItem>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    sideOffset={10}
                    className="bg-accent text-secondary"
                  >
                    <p>{prop.allowDelete?.message}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              {`This action cannot be undone. Are you sure you want to permanently delete this ${prop.mode}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" onClick={deleteHandler}>
                Confirm
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default UserAction;

/**
 * @interface User action component's prop
 * This prop is used to config user action
 * @property visible boolean - if component is visible
 * @property mode string - question or answer or post or comment
 * @property id string - stringified id of the thread, can be uuid id or increament number
 */
interface Prop {
  visible: boolean;
  mode: modes;
  id: string;

  className?: React.HTMLAttributes<HTMLDivElement>["className"];
  iconSize?: number;
  allowDelete?: { allow: boolean | undefined; message: string };
  allowEdit?: { allow: boolean | undefined; message: string };
}
