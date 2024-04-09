import {
  UnverifyAnswer,
  VerifyAnswer,
} from "@/app/(app)/question/[id]/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShieldEllipsis } from "lucide-react";
import nProgress from "nprogress";
import { toast } from "react-toastify";

interface Props {
  thread_ref: string;
  action: "verify" | "unverify";
}
const AdminAction = ({ thread_ref, action }: Props) => {
  const onAction = async () => {
    try {
      nProgress.start();
      const res = action
        ? await VerifyAnswer(thread_ref)
        : await UnverifyAnswer(thread_ref);
      if (!res.ok) throw new Error("Action failed");
      toast.success(res.message);
      location.reload()
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      nProgress.done();
    }
  };
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger title="Admin action">
          <ShieldEllipsis size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Verify Action</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {action === "verify" ? (
            <DropdownMenuItem onSelect={() => onAction()}>
              Verify this answer
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className="focus:bg-error"
              onSelect={() => onAction}
            >
              Unverify this answer
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default AdminAction;
