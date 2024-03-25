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
import { DeleteThread, EditThread } from "@/app/profile/edit/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { MessageObject } from "@/types/message.route";
import { hideLoading, showLoading } from "@/utils/loading.service";
import { Input } from "../ui/input";
import { SubmitButton } from "../SubmitButton";
import { useState } from "react";

const UserAction = (prop: Prop) => {
  const router = useRouter();
  const [edit_content, set_edit_content] = useState(prop.prevContent);

  /** Handler for edit action
   * @function editHandler
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} _
   * @todo add edit handler, clear sessionStorage after success
   */
  const editHandler = (_: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!prop.editSite && !prop.prevContent) {
      throw new Error("no previous content setted");
    }
  };

  /** Handler for edit action
   * @function deleteHandler
   * @todo add delete handler, clear sessionStorage after success
   */
  const deleteHandler = (
    _: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
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

  /**
   * Handler for edit action
   * @function submitEdit
   * @param {FormData} payload
   * Pass server action here
   * @returns void
   */
  const submitEdit = async (payload: FormData) => {
    payload.append("id", prop.id);
    payload.append("mode", prop.mode);

    // Edit thread is used on other pages which using useFormState so it need to have first parameter
    // We dont need that here so an anything should be fine
    try {
      const res: MessageObject = await EditThread(payload);

      if (!res.ok) throw new Error(res.message);

      toast.success(res.message);
      location.reload();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  /**
   * Handler for redirect
   * Used to redirect user to edit page if prop.editSite is set
   * @function redirectHandler
   * @returns void
   */
  const redirectHandler = () => {
    if (!prop.editSite) throw new Error("no edit site setted");
    showLoading();
    router.push(prop.editSite);
  };

  return (
    <div className={`${!prop.visible && "hidden"} ${prop.className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <CircleEllipsis
            className="text-gray-400 hover:scale-105 transition-all"
            size={prop.iconSize ?? 20}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="">
          <DropdownMenuLabel>Thread actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Dialog>
            <DialogTrigger className="w-full">
              <DropdownMenuItem
                onClick={editHandler}
                onSelect={(e) => e.preventDefault()}
                disabled={prop.allowEdit?.allow === false}
                className="w-full"
              >
                <TooltipProvider>
                  <Tooltip open={prop.allowEdit?.allow === false && undefined}>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex gap-1 flex-start">
                        <Pencil size={20} />
                        <p className="ml-3">Edit</p>
                      </div>
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
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Thread</DialogTitle>
                <DialogDescription>
                  {prop.prevContent
                    ? (
                      <div className="flex flex-col gap-2">
                        <p>
                          This action cannot be undone. You will not get
                          reputation for updating content of this thread
                        </p>
                        <form action={submitEdit}>
                          <Input
                            type="text"
                            name="content"
                            value={edit_content}
                            onChange={(e) => set_edit_content(e.target.value)}
                          />
                          <SubmitButton className="mt-3" />
                        </form>
                      </div>
                    )
                    : <p>Navigate to edit page?</p>}
                </DialogDescription>
              </DialogHeader>
              {!prop.prevContent && prop.editSite &&
                (
                  <DialogFooter>
                    <Button variant="outline" onClick={() => redirectHandler()}>
                      Yes
                    </Button>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                  </DialogFooter>
                )}
            </DialogContent>
          </Dialog>
          {/* DELETE BUTTON */}

          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            disabled={prop.allowDelete?.allow === false}
          >
            <Dialog>
              <DialogTrigger disabled={prop.allowDelete?.allow === false}>
                <TooltipProvider>
                  <Tooltip
                    open={prop.allowDelete?.allow === false && undefined}
                  >
                    <TooltipTrigger className="w-full flex gap-1">
                      {prop.mode === "question"
                        ? <ArchiveX size={20} />
                        : <Trash2 size={20} />}
                      <p className="ml-3">
                        {`${
                          prop.mode === "question" ? "Archieve" : "Delete"
                        } this thread`}
                      </p>
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
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
type Prop = {
  visible: boolean;
  mode: modes;
  id: string;
  editSite?: string;
  prevContent?: string;

  className?: React.HTMLAttributes<HTMLDivElement>["className"];
  iconSize?: number;
  allowDelete?: { allow: boolean | undefined; message: string };
  allowEdit?: { allow: boolean | undefined; message: string };
};
