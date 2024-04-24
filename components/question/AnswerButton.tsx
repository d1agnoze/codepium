import { User } from "@supabase/supabase-js";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import AnswerComponent from "../AnswerComponent";
import { Question } from "@/types/question.type";

export default async function AnswerButton({ point, user, question }: Props) {
  const user_prop = user ? { id: user.id, email: user.email! } : null;
  return (
    <Collapsible>
      <CollapsibleTrigger>
        <span className="flex items-center gap-1 p-4 transition-all rounded-md hover:bg-hslvar">
          <span>Answer Editor</span>
          <ChevronsUpDown color="hsl(var(--primary))" />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-3">
          <AnswerComponent
            rep={point}
            thread_id={question.id}
            user={user_prop}
            owner_id={question.user_id}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

interface Props {
  point: number;
  user: User | null;
  question: Question;
}
