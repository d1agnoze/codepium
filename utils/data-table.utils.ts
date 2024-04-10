import { toast } from "react-toastify";

export const copyToClipboard = (value: string, message: string) => {
  navigator.clipboard.writeText(value);
  toast.info(message);
};
