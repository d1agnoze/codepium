import { Separator } from "@/components/ui/separator";
import {
  MessageCircleQuestion,
  MessageCircleReply,
  Newspaper,
  Vote,
} from "lucide-react";

const Statistic = ({ statistic }: { statistic: Statistic }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold">📈 User statistic</h1>
      <Separator className="my-2" />
      <div className="mx-3 grid grid-cols-3 gap-4">
        <div className="bg-hslvar rounded-lg px-4 py-5 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 opacity-25">
            <Vote size={90} />
          </div>
          <div>
            <p className="text-lg">Verified Answers</p>
            <p className="text-xl">{statistic.answer_verified_count}</p>
          </div>
        </div>

        <div className="bg-hslvar rounded-lg px-4 py-5 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 opacity-25">
            <MessageCircleReply size={90} />
          </div>
          <div>
            <p className="text-lg">Answer given</p>
            <p className="text-xl font-bold">{statistic.answer_count}</p>
          </div>
        </div>

        <div className="bg-hslvar rounded-lg px-4 py-5 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 opacity-25">
            <MessageCircleQuestion size={90} />
          </div>
          <div>
            <p className="text-lg">Questions</p>
            <p className="text-xl">{statistic.question_count}</p>
          </div>
        </div>

        <div className="bg-hslvar rounded-lg px-4 py-5 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 opacity-25">
            <Newspaper size={90} />
          </div>
          <div>
            <p className="text-lg">Articles</p>
            <p className="text-xl">{statistic.post_count}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Statistic;
