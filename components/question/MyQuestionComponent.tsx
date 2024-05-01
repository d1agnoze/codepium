import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { BadgeCheck } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { Question } from "@/types/question.type";
import { copyToClipboard } from "@/utils/data-table.utils";

const MyQuestion = ({ question }: { question: Question }) => {
  return (
    <div className="px-3 py-4 bg-hslvar rounded-md">
      <div className="flex max-sm:flex-col-reverse">
        <div className="h-auto grid place-items-center px-5">
          <span className="text-2xl font-bold">{question.stars}</span>
          <span className="text-muted-foreground text-sm italic">Votes</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="italic text-muted-foreground text-sm">
              {moment(new Date(question.created_at)).toDate().toDateString()}
            </span>
            <span>
              {question.status && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <BadgeCheck size={20} fill="green" color="white" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This question has a verified best answer</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </span>
          </div>
          <Link
            prefetch={false}
            className="text-lg font-semibold"
            href={`/question/${question.id}`}
          >
            <span className="text-red-400">
              {question.isArchieved && "Archived: "}
            </span>
            <span>{question.title}</span>
          </Link>
          <div className="flex gap-3">
            <button
              className="btn btn-xs btn-ghost"
              onClick={() => copyToClipboard(question.id, "Copied")}
            >
              Copy id
            </button>
            <Link
              className="btn btn-xs btn-ghost"
              href={`/question/${question.id}`}
            >
              Navigate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MyQuestion;
