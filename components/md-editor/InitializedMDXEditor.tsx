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
  DiffSourceToggleWrapper,
  headingsPlugin,
  imagePlugin,
  InsertCodeBlock,
  InsertImage,
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
} from "@mdxeditor/editor";
import { useTheme } from "next-themes";
import { UploadResponse } from "@/types/upload.route";

// Only import this to the next file
export default function InitializedMDXEditor({
  editorRef,
  type,
  ...props
}: {
  editorRef: ForwardedRef<MDXEditorMethods> | null;
  imageUploadHandler?: (file: File) => string;
  type: "question" | "post";
} & MDXEditorProps) {
  const { theme } = useTheme();
  async function imageUploadHandler(image: File) {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("type", type);
    // send the file to your server and return
    // the URL of the uploaded image in the response
    const response = await fetch("/api/general/upload", {
      method: "POST",
      body: formData,
    });
    const json = (await response.json()) as UploadResponse;
    return json.url;
  }
  return (
    <MDXEditor
      className={`${theme !== "dark" ? "" : "dark-theme custom-style"}`}
      plugins={[
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <BoldItalicUnderlineToggles />
              <CreateLink />
              <InsertImage />
              <ConditionalContents
                options={[{
                  when: (editor) => editor?.editorType === "codeblock",
                  contents: () => <ChangeCodeMirrorLanguage />,
                }, {
                  fallback: () => (
                    <>
                      <InsertCodeBlock />
                    </>
                  ),
                }]}
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
        imagePlugin({ imageUploadHandler }),
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
