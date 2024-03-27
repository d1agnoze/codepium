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
import { zodResolver } from "@hookform/resolvers/zod";
import ExpertiseSelector from "../ExpertiseSelector";
import { MDHelper } from "@/helpers/markdown/MDhelper";
import { ThreadMode } from "@/enums/thread-modes.enum";
import { createPost } from "./actions";
import { INITIAL_MESSAGE_OBJECT } from "@/types/message.route";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { postSchema } from "@/schemas/post-submit.schema";

export default function PostForm() {
  useEffect(() => {
    hideLoading();
  }, []);
  const ref = useRef<MDXEditorMethods>(null);
  const router = useRouter();
  const [state, formAction] = useFormState(
    createPost,
    INITIAL_MESSAGE_OBJECT,
  );
  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
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
            }).then((res) => {
              if (!res.ok) throw new Error(res.statusText);
            }).catch((err) => console.log(err));
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
      router.replace("/post/" + state.message);
      toast.success("Article posted");
    }
    hideLoading();
  }, [state]);

  const submit = (values: z.infer<typeof postSchema>) => {
    const form = new FormData();
    form.append("title", values.title);
    form.append("content", values.content);
    form.append("expertises", JSON.stringify(values.expertises));
    formAction(form);
    showLoading();
  };

  return (
    <div className="mx-4">
      <h1 className="text-2xl font-semibold mb-5">Create an article</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Article title</FormLabel>
                <FormControl>
                  <Input className="max-w-md" placeholder="" {...field} />
                </FormControl>
                <FormDescription>
                  Short description of what you want to share
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
                <FormLabel>Article</FormLabel>
                <FormDescription>
                  Content of your article
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
                  Select expertises that related to your article
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
