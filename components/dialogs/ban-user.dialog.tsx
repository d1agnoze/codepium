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
import { BanUser } from "@/app/admin/user/actions";
import { Textarea } from "../ui/textarea";

type PropsWithChildren<P> = P & { children?: ReactNode };
interface Props {
  id: string;
  onSuccess: () => void;
}

const BanUserDialog = ({
  id,
  children,
  onSuccess,
}: PropsWithChildren<Props>) => {
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<number>(0);
  const [reasonInput, setReasonInput] = useState<string>("");
  const [open, setOpen] = useState(false);

  const onSubmit = async () => {
    try {
      setIsSubmiting(true);
      await BanUser(id, inputValue, reasonInput);
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
          <DialogTitle>Ban user</DialogTitle>
          <DialogDescription>
            Ban an user for a duration of time, an email will be sent to said
            user
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Ban duration (days)
            </Label>
            <Input
              id="duration"
              type="number"
              value={inputValue}
              min={0}
              max={999}
              onChange={(e) => setInputValue(+e.target.value)}
              className="col-span-3"
            />
            <Label htmlFor="reason" className="text-right">
              Ban reason (days)
            </Label>
            <Textarea
              id="reason"
              className="col-span-3"
              value={reasonInput}
              onChange={(e) => setReasonInput(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            aria-disabled={isSubmiting}
            disabled={isSubmiting}
            variant={"destructive"}
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
export default BanUserDialog;
