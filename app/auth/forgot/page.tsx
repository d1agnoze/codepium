"use client";
import { SubmitButton } from "@/components/SubmitButton";
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
import { formSchema } from "@/schemas/password-recovery.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { confirmPasswordRecovery } from "./actions";
import { INITIAL_MESSAGE_OBJECT } from "@/types/message.route";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import useLoading from "@/hooks/loading";

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const [state, formAction] = useFormState(
    confirmPasswordRecovery,
    INITIAL_MESSAGE_OBJECT,
  );
  const router = useRouter()
  const {set_loading} = useLoading()
  function onSubmit(values: z.infer<typeof formSchema>) {
    set_loading(true)
    const formData = new FormData();
    formData.append("email", values.email);
    formAction(formData);
  }
  useEffect(() => {
    if (state.message !== "") {
      set_loading(false)
      if (state.ok) {
        toast.success(state.message);
        router.replace("/");
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);
  return (
    <div className="w-full h-screen flex justify-center max-sm:pt-5 md:pt-24">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="someemail@email.com" {...field} />
                    
                  </FormControl>
                  <FormDescription>
                    We will send an email to you to confirm your password change
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton />
          </form>
        </Form>
      </div>
    </div>
  );
}
