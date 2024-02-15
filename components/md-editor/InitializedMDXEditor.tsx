"use client";
// InitializedMDXEditor.tsx
import { type ForwardedRef, useEffect } from "react";
import {
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  codeBlockPlugin,
  codeMirrorPlugin,
  ConditionalContents,
  CreateLink,
  diffSourcePlugin,
  headingsPlugin,
  imagePlugin,
  InsertCodeBlock,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
  DiffSourceToggleWrapper,
} from "@mdxeditor/editor";
import { useTheme } from "next-themes";

// Only import this to the next file
export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  const { theme } = useTheme();

  useEffect(() => {
    console.log(theme);
  }, []);
  return (
    <MDXEditor
      className={`${theme !== "dark" ? "" : "dark-theme custom-style"}`}
      plugins={[
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <BoldItalicUnderlineToggles />
              <CreateLink />
              <ConditionalContents
                options={[ {
                    when: (editor) => editor?.editorType === "codeblock",
                    contents: () => <ChangeCodeMirrorLanguage />,
                  },
                  { fallback: () => ( <> <InsertCodeBlock /> </>), },
                ]}
              />
              <DiffSourceToggleWrapper>
                <UndoRedo />
              </DiffSourceToggleWrapper>
            </>
          ),
        }),
        listsPlugin(),
        quotePlugin(),
        headingsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin({imageUploadHandler}),
        thematicBreakPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
        codeMirrorPlugin({
          codeBlockLanguages: { js: "JavaScript", css: "CSS" },
        }),
        markdownShortcutPlugin(),
        diffSourcePlugin({
          diffMarkdown: "An older version",
          viewMode: "rich-text",
        }),
      ]}
      {...props}
      ref={editorRef}
    />
  );
}
async function imageUploadHandler(image: File) {
  const formData = new FormData()
  formData.append('image', image)
  // send the file to your server and return
  // the URL of the uploaded image in the response
  const response = await fetch('/uploads/new', {
    method: 'POST',
    body: formData
  })
  const json = (await response.json()) as { url: string }
  return json.url
}
