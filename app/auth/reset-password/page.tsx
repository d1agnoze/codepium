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
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { INITIAL_MESSAGE_OBJECT } from "@/types/message.route";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { formSchema } from "@/schemas/password-reset.schema";
import { resetPassword } from "./actions";
import useLoading from "@/hooks/loading";

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      password_confirm: "",
    },
  });
  const [state, formAction] = useFormState(
    resetPassword,
    INITIAL_MESSAGE_OBJECT,
  );
  const { set_loading } = useLoading();
  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("email", values.password);
    set_loading(true);
    formAction(formData);
  }
  const router = useRouter();
  useEffect(() => {
    if (state.message !== "") {
      set_loading(false);
      state.ok ? toast.success(state.message) : toast.error(state.message);
      router.push("/");
    }
  }, [state]);
  return (
    <div className="w-full h-screen flex justify-center max-sm:pt-5 md:pt-24">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete=""
                      placeholder="******"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your new password
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password_confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password confirmation</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete=""
                      type="password"
                      placeholder="******"
                      {...field}
                    />
                  </FormControl>
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
