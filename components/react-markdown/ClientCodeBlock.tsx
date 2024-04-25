"use client";

import { useEffect } from "react";

const CodeBlock = ({ lang, children }: Props) => {
  return (
    <div className="Code">
      <pre>
        <code className={`language-${lang}`}>{children}</code>
      </pre>
    </div>
  );
};
export default CodeBlock;

interface Props {
  lang: string;
  children: any;
  rest: any;
}
