"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { MDHelper } from "@/helpers/markdown/MDhelper";
import { INITIAL_MESSAGE_OBJECT } from "@/types/message.route";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { EditThread2 } from "@/app/profile/edit/actions";
import nProgress from "nprogress";
import { editThreadSchema } from "@/schemas/edit-thread-2.schema";
import { hideLoading } from "@/utils/loading.service";
import ExpertisePicker from "../general/ExpertisePicker";

export default function ThreadEditForm({ mode, id, data }: Prop) {
  const ref = useRef<MDXEditorMethods>(null);
  const router = useRouter();

  const [state, formAction] = useFormState(EditThread2, INITIAL_MESSAGE_OBJECT);

  const form = useForm<z.infer<typeof editThreadSchema>>({
    resolver: zodResolver(editThreadSchema),
    defaultValues: {
      title: data.title,
      content: data.content,
      expertises: data.expertises,
      mode: mode,
      id: id,
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
            //HANDLE WHAT TO DO WITH LEFT OVER IMAGES
          }
        }
      }
    };
  }, []);

  /** INFO: Handle server side response */
  useEffect(() => {
    if (state.message.trim() != "" && !state.ok) toast.error(state.message);

    if (state.message.trim() != "" && state.ok) {
      toast.success(state.message);
      router.replace(`/${mode}/${id}`);
    }
    nProgress.done();
  }, [state]);

  /* INFO submit function*/
  const submit = (values: z.infer<typeof editThreadSchema>) => {
    nProgress.start();
    const form = new FormData();

    form.append("id", id);
    form.append("mode", mode);
    form.append("title", values.title);
    form.append("content", values.content);
    form.append("expertises", JSON.stringify(values.expertises));

    formAction(form);
  };

  return (
    <div className="px-5 py-3">
      <h1 className="text-2xl font-semibold mb-5">Edit thread</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input className="max-w-md" placeholder="" {...field} />
                </FormControl>
                <FormDescription>
                  Set new content for your title
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
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <ForwardRefEditor
                    type={mode}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={ref}
                    markdown={data.content}
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
                  <ExpertisePicker
                    defaultValues={data.expertises}
                    value={(arg) => {
                      field.value = arg;
                      field.onChange(arg);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <SubmitButton text="Submit" />
        </form>
      </Form>
    </div>
  );
}

export interface Prop {
  mode: "post" | "question";
  id: string;
  data: {
    title: string;
    content: string;
    expertises: { id: string; display_name: string }[];
  };
}
