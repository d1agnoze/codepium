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
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "react-toastify";
import { UpdateExpertise } from "@/app/admin/expertise/actions";

type PropsWithChildren<P> = P & { children?: ReactNode };
interface Props {
  id: string;
  oldName: string;
  onSuccess: () => void;
}

const UpdateExpertiseDialog = ({
  id,
  oldName,
  children,
  onSuccess,
}: PropsWithChildren<Props>) => {
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(oldName);
  const [open, setOpen] = useState(false);

  const onSubmit = async () => {
    try {
      setIsSubmiting(true);
      await UpdateExpertise(id, inputValue.trim());
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
          <DialogTitle>Change Expertise</DialogTitle>
          <DialogDescription>Change expertise display name</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reason" className="text-right">
              New name
            </Label>
            <Input
              id="reason"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            aria-disabled={isSubmiting}
            disabled={isSubmiting}
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
export default UpdateExpertiseDialog;
