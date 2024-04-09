"use client";

import { hideLoading, showLoading } from "@/utils/loading.service";
import { useEffect, useRef } from "react";
import { ForwardRefEditor } from "../md-editor/ForwardRefEditor";
import "@mdxeditor/editor/style.css";
import { MDXEditorMethods } from "@mdxeditor/editor";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { SubmitButton } from "../SubmitButton";
import { z } from "zod";
import { questionSchema } from "@/schemas/question-submit.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import ExpertiseSelector from "../ExpertiseSelector";
import { MDHelper } from "@/helpers/markdown/MDhelper";
import { ThreadMode } from "@/enums/thread-modes.enum";
import { createQuestion } from "./actions";
import { INITIAL_MESSAGE_OBJECT } from "@/types/message.route";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ReputationNotifierService as RNS } from "@/services/reputation-notifier.services";

export default function QuestionForm() {
  const ref = useRef<MDXEditorMethods>(null);
  const router = useRouter();
  const [state, formAction] = useFormState(
    createQuestion,
    INITIAL_MESSAGE_OBJECT,
  );
  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: "",
      content: "",
      expertises: [],
    },
  });
  useEffect(() => {
    hideLoading();
    return () => {
      if (!form.formState.isSubmitted && form.formState.dirtyFields.content) {
        if (window.confirm("Do you really want to leave?")) {
          const unsaved: string[] = MDHelper.extractImageLinks(
            form.getValues("content"),
          );
          if (unsaved.length > 0) {
            const formData = new FormData();
            formData.append("type", ThreadMode.question.toString());
            formData.append("images", JSON.stringify(unsaved));

            fetch("/api/general/upload", {
              method: "DELETE",
              body: formData,
            })
              .then((res) => {
                if (!res.ok) throw new Error(res.statusText);
              })
              .catch((err) => console.log(err));
          }
        }
      }
    };
  }, []);

  /** INFO: Handle server side response */
  useEffect(() => {
    if (state.message.trim() != "" && !state.ok) {
      toast.error(state.message);
      router.replace("/");
    }
    if (state.message.trim() != "" && state.ok) {
      router.replace("/question/" + state.message);
      RNS.adder_notify("question");
      hideLoading();
    }
  }, [state]);

  const submit = (values: z.infer<typeof questionSchema>) => {
    const form = new FormData();
    form.append("title", values.title);
    form.append("content", values.content);
    form.append("expertises", JSON.stringify(values.expertises));
    formAction(form);
    showLoading();
  };

  return (
    <div className="mx-4 flex-grow">
      <h1 className="text-2xl font-semibold mb-5">Create a question thread</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Title</FormLabel>
                <FormControl>
                  <Input className="max-w-md" placeholder="" {...field} />
                </FormControl>
                <FormDescription>
                  Short description of a problem that you are having
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormDescription>
                  Detailed description of your question
                </FormDescription>
                <FormControl>
                  <ForwardRefEditor
                    type="question"
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={ref}
                    markdown=""
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expertises"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Related expertises</FormLabel>
                <FormDescription>
                  Select expertises that related to your question
                </FormDescription>
                <FormMessage />
                <FormControl>
                  <ExpertiseSelector
                    value={(arg) => {
                      field.value = arg;
                      field.onChange(arg);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="divider divider-success"></div>
          <SubmitButton text="Submit" />
        </form>
      </Form>
    </div>
  );
}
