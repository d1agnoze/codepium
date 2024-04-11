"use client";
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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "../SubmitButton";
import { CreateExpertise } from "@/app/admin/expertise/actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const CreateExpertiseDialog = ({ className = "" }: { className?: string }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onSubmit = (formData: FormData) => {
    CreateExpertise(formData)
      .then(() => {
        toast.success("Expertise Created");
        sessionStorage.clear();
        router.refresh();
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setOpen(false));
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={`${className}`}>
          Create Expertise
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Expertise</DialogTitle>
          <DialogDescription>
            Create a new Expertise for the community to use
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="displayname" className="text-right">
                Expertise title
              </Label>
              <Input id="displayname" name="name" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <SubmitButton />
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default CreateExpertiseDialog;
