"use client";
import { X } from "lucide-react";
import { useState } from "react";

const SimpleAlert = (prop: Prop) => {
  const [hide, setHide] = useState<boolean>(false);
  return (
    <>
      {!hide && (
        <div className={`flex px-3 py-2 bg-${prop.variant} ${prop.className}`}>
          <p>{prop.text}</p>
          <button className="ml-auto" onClick={() => setHide(true)}>
            <X size={20} />
          </button>
        </div>
      )}
    </>
  );
};
export default SimpleAlert;

interface Prop extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  variant: "success" | "error" | "warning" | "info";
}
