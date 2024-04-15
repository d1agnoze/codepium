"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateForm from "./create_form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCirclePlus } from "lucide-react";

const CreateTicketDialog = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const onSuccess = () => {
    setOpen(false);
    router.refresh();
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="btn btn-sm btn-primary">
            <MessageCirclePlus size={20} />
            <span>Create Ticket</span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new Ticket</DialogTitle>
            <DialogDescription>
              <CreateForm onSuccess={onSuccess} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default CreateTicketDialog;
