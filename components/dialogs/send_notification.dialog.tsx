import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PropsWithChildren } from "@/types/props_with_children";
import { TicketAdmin } from "@/types/ticket_admin.type";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { schema } from "@/schemas/send_notification.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "../ui/textarea";
import nProgress from "nprogress";
import { sendFeedback } from "@/app/admin/ticket/actions";
import { toast } from "react-toastify";

export function SendFeedbackDialog(props: PropsWithChildren<Props>) {
  const [open, setOpen] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { message: "" },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      setIsSubmiting(true);
      await sendFeedback(props.ticket, "ADMIN:" + values.message);
      setOpen(false);
      props.onSuccess();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmiting(false);
    }
  }

  useEffect(() => {
    isSubmiting ? nProgress.start() : nProgress.done();
  }, [isSubmiting]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send message to user</DialogTitle>
          <DialogDescription>
            Send a message to the user, this will go to the user's notification
            center
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>
                    this message will automatic with have ADMIN marked at the
                    start
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
interface Props {
  ticket: TicketAdmin;
  onSuccess: () => void;
}
