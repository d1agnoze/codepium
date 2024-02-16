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

// Only import this to the next file
export default function InitializedMDXEditor({
  editorRef,
  id,
  type,
  ...props
}: {
  editorRef: ForwardedRef<MDXEditorMethods> | null;
  imageUploadHandler?: (file: File) => string;
  id: string;
  type: "question" | "post";
} & MDXEditorProps) {
  const { theme } = useTheme();

  useEffect(() => {
    console.log(theme);
  }, []);
  async function imageUploadHandler(image: File) {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("thread_id", id);
    formData.append("type", type);
    // send the file to your server and return
    // the URL of the uploaded image in the response
    const response = await fetch("/api/general/upload", {
      method: "POST",
      body: formData,
    });
    const json = (await response.json()) as { url: string };
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
