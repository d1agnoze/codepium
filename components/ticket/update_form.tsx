"use client";

import { updateTicket } from "@/app/profile/ticket/actions";
import { INITIAL_MESSAGE_OBJECT } from "@/types/message.route";
import { stateHandler } from "@/utils/handleMessageObj";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import nProgress from "nprogress";
import { ticket } from "@/types/ticket.type";
import { ticket_update_schema } from "@/schemas/ticket_update.schema";

const UpdateForm = (props: Props) => {
  const [state, formAction] = useFormState(
    updateTicket,
    INITIAL_MESSAGE_OBJECT,
  );

  const form = useForm<z.infer<typeof ticket_update_schema>>({
    resolver: zodResolver(ticket_update_schema),
    defaultValues: {
      id: props.ticket.id,
      title: props.ticket.title,
      message: props.ticket.message,
      relatedId: props.ticket.relatedId,
    },
  });

  const onSubmit = (values: z.infer<typeof ticket_update_schema>) => {
    nProgress.start();
    const payload = new FormData();
    payload.append("id", values.id.toString());
    payload.append("title", values.title);
    payload.append("message", values.message);
    payload.append("relatedId", values.relatedId ?? "");
    formAction(payload);
  };

  useEffect(() => {
    stateHandler(
      state,
      () => {
        props.onSuccess();
        toast.success(state.message);
      },
      () => {
        console.log(state);
        toast.error(state.message);
      },
    );
    nProgress.done();
  }, [state]);
  return (
    <div className="my-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ticket title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Short description of your message
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Details</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormDescription>description of your message</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="relatedId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Related Id (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  The id of the related thread that you having issue with
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};
export default UpdateForm;

interface Props {
  ticket: ticket;
  onSuccess: () => void;
}
