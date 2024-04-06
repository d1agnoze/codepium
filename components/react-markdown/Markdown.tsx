import { MarkdownComponents } from "@/components/react-markdown/Component";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

const MDRenderer = ({
  content,
  className,
}: {
  content: string;
  className?: string;
}) => {
  return (
    <Markdown
      className={className ?? "text-lg leading-relaxed"}
      components={MarkdownComponents}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
      remarkPlugins={[[remarkGfm]]}
    >
      {content}
    </Markdown>
  );
};
export default MDRenderer;
