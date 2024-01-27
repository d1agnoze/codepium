"use client";
import { Auth } from "@supabase/auth-ui-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { z } from "zod";
import { authSchema } from "@/schemas/auth-login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/SubmitButton";
import { useFormState } from "react-dom";
import { signIn, signUp } from "./actions";
import { useEffect, useState } from "react";
import useLoading from "@/hooks/loading";
import { DEFAULT_SITE } from "@/defaults/site";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthChoice } from "@/enums/login-or-signup.choices";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { MessageObject } from "@/types/message.route";

export default function Login() {
  const supabase = createClientComponentClient();
  const [state, formAction] = useFormState(signIn, initMessage);
  const [signUpState, formSignUpAction] = useFormState(signUp, initMessage);
  const [mode, setMode] = useState<AuthChoice>(AuthChoice.LogIn);
  const { set_loading } = useLoading();
  const router = useRouter();
  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof authSchema>) => {
    const payload = new FormData();
    form.reset();
    payload.append("email", values.email);
    payload.append("password", values.password);
    set_loading(true);
    mode === AuthChoice.LogIn ? formAction(payload) : formSignUpAction(payload);
  };

  useEffect(() => {
    if (state.message !== "") {
      set_loading(false);
      state.ok ? toast.success(state.message) : toast.error(state.message);
      router.replace("/");
    }
    if (signUpState.message !== "") {
      set_loading(false);
      signUpState.ok
        ? toast.success(signUpState.message)
        : toast.error(signUpState.message);
      router.replace("/");
    }
  }, [state, signUpState]);
  return (
    <div className="h-screen min-w-0 md:mt-10 flex justify-center max-sm">
      <div className="flex flex-col gap-3">
        <Tabs
          defaultValue={mode}
          className=" md:w-[400px] max-sm:w-[200px]"
          onValueChange={(value: string) => setMode(value as AuthChoice)}
        >
          <TabsList>
            <TabsTrigger value={AuthChoice.LogIn}>Sign in</TabsTrigger>
            <TabsTrigger value={AuthChoice.SignUp}>Sign up</TabsTrigger>
          </TabsList>
          <TabsContent value={AuthChoice.LogIn}>
            Sign in to Codepium
          </TabsContent>
          <TabsContent value={AuthChoice.SignUp}>
            Register to ask questions and post awesome stuffs
          </TabsContent>
        </Tabs>
        <div>
          <Card>
            <CardContent className="space-y-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email:</FormLabel>
                        <FormControl>
                          <Input placeholder="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="*******" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-3 items-center">
                    <SubmitButton text={mode} />
                    <Link
                      className="text-sm italic underline"
                      href={"/auth/forgot"}
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="divider">OR</div>
        <Auth.UserContextProvider supabaseClient={supabase}>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={["facebook", "github"]}
            theme="dark"
            onlyThirdPartyProviders
            redirectTo={`${DEFAULT_SITE}/auth/callback`}
          />
        </Auth.UserContextProvider>
      </div>
    </div>
  );
}
const initMessage: MessageObject = {
  message: "",
  ok: false,
};
