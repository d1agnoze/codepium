import React from "react";
import { BehaviorSubject } from "rxjs";
interface editorRefs {
  open: boolean;
  content: JSX.Element;
  submit: () => void;
}

const default_element: JSX.Element = React.createElement("div", null);

const emptyEditorRefs: editorRefs = {
  open: false,
  content: default_element,
  submit: () => {},
};

export const editorDrawerService = new BehaviorSubject<editorRefs>(
  emptyEditorRefs,
);
