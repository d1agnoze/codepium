"use client";

import Prism from "prismjs";
import { useEffect } from "react";

const CodeBlock = ({
  lang,
  children,
  rest,
}: {
  lang: string;
  children: any;
  rest: any;
}) => {
  useEffect(() => {
    Prism.highlightAll();
  });
  return (
    <div className="Code">
      <pre>
        <code className={`language-${lang}`}>{children}</code>
      </pre>
    </div>
  );
};
export default CodeBlock;
