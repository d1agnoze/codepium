import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { RestorePost } from "@/app/admin/post/actions";

type PropsWithChildren<P> = P & { children?: ReactNode };
interface Props {
  id: string;
  onSuccess: () => void;
}

const PostRestoreDialog = ({
  id,
  children,
  onSuccess,
}: PropsWithChildren<Props>) => {
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const onSubmit = async () => {
    try {
      setIsSubmiting(true);
      await RestorePost(id);
      onSuccess();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmiting(false);
      setOpen(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restore Article</DialogTitle>
          <DialogDescription>
            Are you sure you want to restore this article?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            aria-disabled={isSubmiting}
            disabled={isSubmiting}
            variant={"default"}
            onClick={() => onSubmit()}
          >
            Save changes
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default PostRestoreDialog;
