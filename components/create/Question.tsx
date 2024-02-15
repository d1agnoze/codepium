'use client';

import { hideLoading } from "@/utils/loading.service";
import { useEffect } from "react";
import { ForwardRefEditor } from "../md-editor/ForwardRefEditor";
import "@mdxeditor/editor/style.css";

export default function QuestionForm() {
  useEffect(() => {
    hideLoading();
  }, []);
  return (
    <div>
      <p>shee</p>
      <ForwardRefEditor markdown="hellodsf" />
    </div>
  );
}
