"use client";

import { hideLoading } from "@/utils/loading.service";
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

export default function QuestionForm() {
  const ref = useRef<MDXEditorMethods>(null);
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
  }, []);
  const submit = (values: z.infer<typeof questionSchema>) => {
    console.log(values);
  };
  return (
    <div>
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
                    id={"" /** TODO: create id later **/}
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
                <FormControl>
                  <ExpertiseSelector
                    value={(arg) => {
                      field.value = arg;
                      field.onChange(arg);
                    }}
                  />
                </FormControl>
                <FormMessage />
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
