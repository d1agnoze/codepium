"use client";

import "@mdxeditor/editor/style.css";
import { useEffect, useRef, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { ForwardRefEditor } from "./md-editor/ForwardRefAnswerEditor";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { z } from "zod";
import { answerSchema } from "@/schemas/answer-submit.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "./ui/checkbox";
import { SubmitButton } from "./SubmitButton";
import { AnswerQuestion } from "@/app/(app)/question/[id]/actions";
import { INITIAL_MESSAGE_OBJECT } from "@/types/message.route";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { hideLoading, showLoading } from "@/utils/loading.service";
import { useRouter } from "next/navigation";

interface Props {
  thread_id: string;
  user: { id: string; email: string } | null;
  owner_id: string;
}
export default function AnswerComponent(props: Props) {
  const [state, formAction] = useFormState(
    AnswerQuestion,
    INITIAL_MESSAGE_OBJECT,
  );

  const form = useForm<z.infer<typeof answerSchema>>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      content: "",
      userValidated: false,
      user_id: props.user?.id,
      thread_id: props.thread_id,
    },
  });

  const ref = useRef<MDXEditorMethods>(null);
  const router = useRouter();

  const [fromUser] = useState(
    (props.user != null) &&
      (props.owner_id != null) &&
      (props.owner_id === props.user.id),
  );

  const onSubmitHandler = (values: z.infer<typeof answerSchema>) => {
    const payload = new FormData();

    payload.append("content", values.content);
    payload.append("userValidated", JSON.stringify(values.userValidated));
    payload.append("user_id", values.user_id);
    payload.append("thread_id", values.thread_id);

    formAction(payload);
    showLoading();
  };

  useEffect(() => {
    if (state.message !== "") {
      if (state.ok) {
        toast.success(state.message);
        router.refresh();
      } else {
        toast.error(state.message);
      }
      hideLoading();
    }
  }, [state]);

  return (
    <div className="w-full bg-hslvar rounded-lg px-5 py-6 flex flex-col">
      <h1 className="text-xl">
        {`${fromUser ? "Self Answer" : "YourAnswer"}`}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitHandler)}>
          <FormField
            control={form.control}
            name={"content"}
            render={({ field }) => (
              <FormItem>
                <FormLabel />
                <FormControl>
                  <ForwardRefEditor
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={ref}
                    markdown=""
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          {fromUser &&
            (
              <FormField
                control={form.control}
                name={"userValidated"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel />
                    <FormControl>
                      <div className="items-top flex space-x-2">
                        <Checkbox
                          id="checkbox"
                          onBlur={field.onBlur}
                          onCheckedChange={field.onChange}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="checkbox"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Mark as correct answer
                          </label>
                          <p className="text-sm text-muted-foreground">
                            This action will automaticly close this thread,
                            further comments and answer will not be allowed
                          </p>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          <SubmitButton text="Submit Answer" />
        </form>
      </Form>
    </div>
  );
}
