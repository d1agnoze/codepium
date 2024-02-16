"use client";

import { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { forwardRef } from "react";
// ForwardRefEditor.tsx

// This is the only place InitializedMDXEditor is imported directly.
const Editor = dynamic(() => import("./InitializedMDXEditor"), {
  // Make sure we turn SSR off
  ssr: false,
});

// This is what is imported by other components. Pre-initialized with plugins, and ready
// to accept other props, including a ref.
interface CustomMDXEditorProps extends MDXEditorProps {
  type: "question" | "post";
  id: string;
}
export const ForwardRefEditor = forwardRef<MDXEditorMethods, CustomMDXEditorProps>((
  props,
  ref,
) => <Editor {...props} editorRef={ref} type={props.type} id={props.id} />);
// TS complains without the following line
ForwardRefEditor.displayName = "ForwardRefEditor ";
