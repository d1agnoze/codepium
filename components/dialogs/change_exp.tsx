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
import { toast } from "react-toastify";
import ExpertisePicker from "../general/ExpertisePicker";
import { ChangeExpertise } from "@/app/admin/question/actions";

type PropsWithChildren<P> = P & { children?: ReactNode };
interface Props {
  id: string;
  expertise: Expertise[];
  onSuccess: () => void;
}

const ChangeExpertises = ({
  id,
  children,
  expertise,
  onSuccess,
}: PropsWithChildren<Props>) => {
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [selected, setSelected] = useState<Expertise[]>(expertise);
  const [open, setOpen] = useState(false);

  const onSubmit = async () => {
    try {
      setIsSubmiting(true);
      /* INFO: Change exps*/
      ChangeExpertise(
        id,
        selected.map((x) => x.id),
      );
      onSuccess();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmiting(false);
      setOpen(false);
    }
  };
  const onChange = (values: Expertise[]) => setSelected(values);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Expertise</DialogTitle>
          <DialogDescription>
            Change the thread's expertise set, so that it is easier to find.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-1 py-4">
          <div className="grid grid-cols-1 items-center gap-4">
            <Label htmlFor="reason" className="text-left">
              Selected Expertises
            </Label>
            <ExpertisePicker value={onChange} defaultValues={expertise} />
          </div>
        </div>
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
export default ChangeExpertises;
