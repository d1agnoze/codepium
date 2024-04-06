// InitializedMDXEditor.tsx
import { type ForwardedRef } from "react";
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
import SUPPORTED_LANG from "@/defaults/supported-langs.parser";
import { ReputationService } from "@/services/reputation.service";
import { toast } from "react-toastify";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ReputationNotifierService as RNS } from "@/services/reputation-notifier.services";
import { ReputationError } from "@/helpers/error/ReputationError";
import nProgress from "nprogress";

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
    try {
      nProgress.start();
      const allowedFileTypes = ["image/png", "image/jpeg", "image/gif"];
      /* NOTE: CHECK user repupation  */
      const rep = new ReputationService(createClientComponentClient());
      const allow = await rep.guardAction("upload");
      if (!allow) {
        throw new ReputationError("Insufficient reputation");
      }
      if (!allowedFileTypes.includes(image.type)) {
        throw new Error("Invalid image type");
      }

      const formData = new FormData();
      formData.append("file", image);
      formData.append("type", type);

      const response = await fetch("/api/general/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");

      const json = (await response.json()) as UploadResponse;
      return json.url;
    } catch (err: any) {
      if (err instanceof ReputationError) {
        RNS.guard_notify("upload");
      } else {
        toast.error(err.message);
      }
      return "";
    } finally {
      nProgress.done();
    }
  }
  return (
    <MDXEditor
      className={`${theme !== "dark" ? "" : "dark-theme"}`}
      contentEditableClassName="custom-style"
      plugins={[
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <BoldItalicUnderlineToggles />
              <CreateLink />
              <InsertImage />
              <ConditionalContents
                options={[
                  {
                    when: (editor) => editor?.editorType === "codeblock",
                    contents: () => <ChangeCodeMirrorLanguage />,
                  },
                  {
                    fallback: () => (
                      <>
                        <InsertCodeBlock />
                      </>
                    ),
                  },
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
        imagePlugin({ imageUploadHandler }),
        thematicBreakPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
        codeMirrorPlugin({ codeBlockLanguages: SUPPORTED_LANG }),
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
