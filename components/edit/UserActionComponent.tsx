import { ArchiveX, Pencil, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { modes } from "@/types/modes.type";

const UserAction = (prop: Prop) => {
  const editHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {};
  const deleteHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {};
  return (
    <div className={`${!prop.visible && "hidden"}`}>
      <div className="flex gap-1">
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div onClick={editHandler}>
                  <Pencil className="hover:text-accent" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div onClick={deleteHandler}>
                  {prop.mode === "question"
                    ? <ArchiveX className="hover:text-red-500" />
                    : <Trash2 className="hover:text-red-500" />}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {`${
                    prop.mode === "question" ? "Archieve" : "Delete"
                  } this thread`}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};
export default UserAction;

/**
 * @interface User action component's prop
 * This prop is used to config user action
 * @property visible boolean - if component is visible
 * @property mode string - question or answer or post or comment
 * @property id string - stringified id of the thread, can be uuid id or increament number
 */
interface Prop {
  visible: boolean;
  mode: modes;
  id: string;
}
