"use client";

import CommentsDisplay, { SelectedHandler } from "./CommentDisplay";
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
import { INITIAL_COMMENT_OPTIMISTIC } from "@/types/comment.optimistic";
import { toast } from "react-toastify";
import Link from "next/link";
import { modes } from "@/types/modes.type";
import { comment } from "@/types/comment.type";
import { isAfterEditWins } from "@/utils/checkdate";

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

  const [newComment, setNewComment] = useState<comment[]>([]);
  const [openComment, setOpenComment] = useState<boolean>(mode === "post");
  const [isSubmitting, setIsSubmiting] = useState<boolean>(false);

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
        mode: mode,
        receviver: source_user_id, //comment is aimed at the post, or the question owner default
        content: "",
        thread_id: thread_id,
        parent_id: source_ref,
        user_id: user_id,
      },
    },
  );

  //INFO: handle data when submit completed
  useEffect(() => {
    if (isMessage(state)) {
      setIsSubmiting(false);
      toast.error(state.message);
      return;
    }

    if (isComment(state) && state.id != "") {
      console.log(isAfterEditWins(state.created_at));
      setIsSubmiting(false);
      setNewComment((prev) => [...prev, state]);
      setOpenComment(false);
    }
  }, [state]);

  //INFO: open comment when clicked on a comment
  useEffect(() => {
    if (commentMode.mode === "comment") setOpenComment(true);
  }, [commentMode]);

  const submit = (values: z.infer<typeof commentSchema>) => {
    const payload = new FormData();
    payload.append("content", values.content);
    payload.append("thread_ref", values.thread_id);
    payload.append("parent_ref", values.parent_id);
    payload.append("mode", commentMode.mode);
    payload.append("user_id", values.user_id);
    payload.append("receviver", commentMode.reply_to);

    formAction(payload);
    setIsSubmiting(true);
    form.reset();
  };

  const replyHandler = (data: SelectedHandler) => {
    // console.log("replyHandler", data.id != source_user_id);
    if (!data.isDefault) {
      setCommentMode({
        reply_to: data.data.comment_user_id,
        mode: "comment",
        reply_name: data.data.comment_user_name,
      });
    } else {
      setCommentMode({
        reply_to: source_user_id,
        mode: mode,
        reply_name: "",
      });
    }
  };

  return (
    <div
      className={`h-full flex ${
        mode === "post" ? "flex-col-reverse" : "flex-col text-xs"
      } gap-1 px-4 text-right`}
    >
      <div className="">
        <CommentsDisplay
          thread_ref={thread_id}
          parent_ref={source_ref}
          mode={mode}
          source_user_id={source_user_id}
          handler={replyHandler}
          user_id={user_id}
          new_cmt={newComment}
        />
      </div>
      <div>
        <Collapsible
          className="w-full space-y-2"
          onOpenChange={setOpenComment}
          open={openComment}
        >
          <div
            className={`flex ${
              mode !== "post" && "flex-row-reverse"
            } items-center space-x-4 justify-start`}
          >
            <CollapsibleTrigger asChild>
              <span
                className={`text-gray-400 ${
                  isSubmitting ? "cursor-wait" : "cursor-pointer"
                } hover:text-secondary-foreground py-2`}
              >
                {isSubmitting
                  ? (
                    <div className="flex gap-1">
                      <span className="loading loading-dots loading-xs">
                      </span>
                      <span>Submitting comment</span>
                    </div>
                  )
                  : "Add a comment"}
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
                          placeholder={` Your though of to this ${commentMode.mode} ${
                            commentMode.reply_name
                              ? "- owner: @" + commentMode.reply_name
                              : ""
                          }- Press <Enter> to submit `}
                          className="text-xs"
                          {...field}
                          disabled={!user_id}
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
  x: comment | MessageObject,
): x is comment => {
  const res = (x as comment).id != undefined;
  return res;
};

/**
 * Check if given variable is MessageObject type
 * @param x comment | MessageObject
 * @returns boolean
 */
const isMessage = (
  x: comment | MessageObject,
): x is MessageObject => {
  return (x as MessageObject).ok != undefined;
};
