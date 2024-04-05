"use client";
import { accountSettingsSchema as schema } from "@/schemas/account-settins.schema";
import { INITIAL_MESSAGE_OBJECT } from "@/types/message.route";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { User } from "@/types/user.type";
import { useEffect } from "react";
import { UpdateUser } from "@/app/profile/account-settings/actions";
import { useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { Button } from "@/components/ui/button";
import nProgress from "nprogress";
import ExpertisePicker from "../general/ExpertisePicker";
import { toast } from "react-toastify";

const AccountSettings = ({
  user,
  expertises,
}: {
  user: User;
  expertises: Expertise[];
}) => {
  const [state, formAction] = useFormState(UpdateUser, INITIAL_MESSAGE_OBJECT);
  const router = useRouter();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: user.user_name,
      displayName: user.display_name,
      about: user.about,
      expertises: expertises,
    },
  });
  const onSubmit = async (data: z.infer<typeof schema>) => {
    nProgress.start();

    const payload = new FormData();
    payload.append("username", data.username);
    payload.append("displayName", data.displayName);
    payload.append("about", data.about);
    payload.append("expertises", JSON.stringify(data.expertises));

    formAction(payload);
  };

  useEffect(() => {
    if (state.ok && state.message !== "") {
      router.push("/profile");
      form.reset();
    }
    if (!state.ok && state.message !== "") {
      toast.error(state.message);
    }
    nProgress.done();
  }, [state.message]);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your display name</FormLabel>
                <FormControl>
                  <Input placeholder="Display Name" {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tell use something about yourself</FormLabel>
                <FormControl>
                  <Textarea placeholder="You can leave this blank" {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expertises"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Changes Expertises</FormLabel>
                <FormControl>
                  <ExpertisePicker
                    value={(arg) => {
                      field.value = arg;
                      field.onChange(arg);
                    }}
                    defaultValues={expertises}
                  />
                </FormControl>
                <FormDescription>
                  Hey, we've all been there, something new things feel good!!!
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
export default AccountSettings;
