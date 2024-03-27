import { question_seo } from "@/types/question.seo";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { BadgeCheck } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { Badge } from "../ui/badge";

const Question = ({ question }: { question: question_seo }) => {
  return (
    <div className="px-3 py-4 bg-hslvar rounded-md">
      <div className="flex max-sm:flex-col-reverse">
        <div className="h-auto grid place-items-center px-5">
          <span className="text-2xl font-bold">{question.stars}</span>
          <span className="text-muted-foreground text-sm italic">Upvotes</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex">
            <span className="">
              🕐{" "}
              <span className="italic text-muted-foreground text-sm">
                {moment(new Date(question.created_at)).toDate().toDateString()}
              </span>
            </span>
          </div>
          <Link
            prefetch={false}
            className="text-lg font-semibold"
            href={`/question/${question.id}`}
          >
            {question.title}
          </Link>
          <div className="flex gap-1">
            {question.tags.map((tag) => (
              <Badge variant="small" key={tag.id}>
                {tag.name}
              </Badge>
            ))}
          </div>
          <div className="flex gap-3">
            {question.status &&
              (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <BadgeCheck size={20} fill="green" color="white" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This question has a best answer verified</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            <span className="text-muted-foreground">
              {question.answer_count} Answer(s)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Question;
