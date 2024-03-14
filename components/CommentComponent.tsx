"use client";

import CommentsDisplay from "./CommentDisplay";
import { SubmitButton } from "./SubmitButton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Input } from "./ui/input";
import { MessageObject } from "@/types/message.route";
import { CreateComment } from "@/app/(app)/actions";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { commentSchema } from "@/schemas/comment.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "./ui/form";
import { useEffect, useState } from "react";
import {
  Comment_Optimistic,
  INITIAL_COMMENT_OPTIMISTIC,
} from "@/types/comment.optimistic";
import { toast } from "react-toastify";
import Link from "next/link";
import { modes } from "@/types/modes.type";

interface Prop {
  thread_id: string;
  source_ref: string;
  user_id: string | undefined;
  source_user_id: string;
  mode: "question" | "answer" | "post";
}

export default function CommentComponent(
  { thread_id, source_ref, user_id, source_user_id, mode }: Prop,
) {
  const [commentMode, setCommentMode] = useState<
    { reply_to: string; mode: modes; reply_name: string }
  >({ reply_to: source_user_id, mode: mode, reply_name: "" });

  const [state, formAction] = useFormState(
    CreateComment,
    INITIAL_COMMENT_OPTIMISTIC,
  );

  if (user_id == null) {
    return (
      <div className="">
        <Link href="/login">
          <span className="link">Login</span>
          {`  to leave a comment`}
        </Link>
      </div>
    );
  }

  const form = useForm<z.infer<typeof commentSchema>>(
    {
      resolver: zodResolver(commentSchema),
      defaultValues: {
        mode: commentMode.mode,
        receviver: source_user_id, //comment is aimed at the post, or the question owner default
        content: "",
        thread_id: thread_id,
        parent_id: source_ref,
        user_id: user_id,
      },
    },
  );

  useEffect(() => {
    if (isMessage(state)) {
      // upload failed
      toast.error(state.message);
    }
    if (isComment(state) && state.id != "") {
      // upload success
    }
  }, [state]);

  const submit = (values: z.infer<typeof commentSchema>) => {
    const payload = new FormData();
    payload.append("content", values.content);
    payload.append("thread_ref", values.thread_id);
    payload.append("parent_ref", values.parent_id);
    payload.append("mode", commentMode.mode);
    payload.append("user_id", values.user_id);
    payload.append("receviver", commentMode.reply_to);

    formAction(payload);
    form.reset();
  };

  const replyHandler = (data: { id: string; name: string }) => {
    if (data.id != source_user_id) {
      setCommentMode({
        reply_to: data.id,
        mode: "comment",
        reply_name: data.name,
      });
    } else {
      setCommentMode({
        reply_to: data.id,
        mode: mode,
        reply_name: data.name,
      });
    }
    console.log(commentMode);
  };

  return (
    <div className="h-full flex flex-col gap-1 px-4 text-xs text-right">
      <div className="">
        <CommentsDisplay
          thread_ref={thread_id}
          parent_ref={source_ref}
          mode={mode}
          source_user_id={source_user_id}
          handler={replyHandler}
        />
      </div>
      <div>
        <Collapsible className="w-full space-y-2" open={true}>
          <div className="flex flex-row-reverse items-center space-x-4 justify-start">
            <CollapsibleTrigger asChild>
              <span className="text-gray-400 cursor-pointer hover:text-secondary-foreground py-1">
                Add a comment
              </span>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(submit)}
                className=""
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={commentMode.reply_name
                            ? `Reply to ${commentMode.reply_name}`
                            : "Your thought of this thread - Press <Enter> to submit"}
                          className="text-xs"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SubmitButton className="text-xs py-0 h-8 hidden" />
              </form>
            </Form>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}

/**
 * Check if given variable is Comment_Optimistic type
 * @param x Comment_Optimistic | MessageObject
 * @returns boolean
 */
const isComment = (
  x: Comment_Optimistic | MessageObject,
): x is Comment_Optimistic => {
  return (x as MessageObject).ok != undefined;
};

/**
 * Check if given variable is MessageObject type
 * @param x Comment_Optimistic | MessageObject
 * @returns boolean
 */
const isMessage = (
  x: Comment_Optimistic | MessageObject,
): x is MessageObject => {
  return (x as Comment_Optimistic).id != undefined;
};
