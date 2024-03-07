"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

/**
 * Submit button component - update text upon form submition
 * NOTE: This submit button only works with server action placed inside action property of the form
 * @param text text to be displayed
 */
export function SubmitButton({ text }: { text?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending} disabled={pending}>
      {(text ? text : "Submit") + (pending ? " ..." : "")}
    </Button>
  );
}
