"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { pickModeSchema } from "@/schemas/create-pick-mod.schema";
import { zodResolver } from "@hookform/resolvers/zod";
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
} from "../ui/form";
import { useRouter } from "next/navigation";
import { SubmitButton } from "../SubmitButton";
import { hideLoading, showLoading } from "@/utils/loading.service";
import { useEffect } from "react";
import { ReputationNotifierService as RNS } from "@/services/reputation-notifier.services";
import { POINT_SYS_GUARD } from "@/defaults/points.system";

export default function Pick({ reputation }: { reputation: number }) {
  useEffect(() => {
    hideLoading();
  }, []);
  const router = useRouter();
  const form = useForm<z.infer<typeof pickModeSchema>>({
    resolver: zodResolver(pickModeSchema),
    defaultValues: {
      mode: "question",
    },
  });
  function onSubmit(values: z.infer<typeof pickModeSchema>) {
    showLoading();
    const allow = guard();
    if (!allow && values.mode === "post") {
      RNS.guard_notify("post");
      return;
    }
    router.push(`/profile/create?mode=${values.mode}`);
  }
  function guard() {
    return reputation >= POINT_SYS_GUARD["post"];
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="mode"
          render={({ field }) => (
            <FormItem>
              <FormLabel />
              <FormControl>
                <Card className="w-[350px]">
                  <CardHeader>
                    <CardTitle>Create</CardTitle>
                    <CardDescription>
                      What are you planning to do?
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="type">Thread type:</Label>
                        <Select
                          value={field.value}
                          onValueChange={(event) => {
                            console.log(event);
                            field.onChange(event);
                          }}
                        >
                          <SelectTrigger id="type">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="question">Question</SelectItem>
                            <SelectItem value="post" disabled={!guard()}>
                              Post
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <SubmitButton text="Next"></SubmitButton>
                  </CardFooter>
                </Card>
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
