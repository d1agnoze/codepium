import { DEFAULT_AVATAR } from "@/defaults/profile";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import UserAction from "../edit/UserActionComponent";
import { Question } from "@/types/question.type";
import moment from "moment";
import { sha256 } from "js-sha256";

export default async function AvatarInfo({ fromUser, question }: Props) {
  const link = `https://gravatar.com/avatar/${sha256(question.email!)}?d=${encodeURIComponent(DEFAULT_AVATAR)}&s=100`;
  const shortName = question.user_name!.charAt(0);
  const dateFromNow = moment(question.created_at).fromNow();
  const userName = fromUser ? "You" : "@" + question!.user_name;
  const editSite = "/profile/edit/question/" + question.id;
  const mode = "question";

  return (
    <div className="flex gap-3 items-center">
      <Avatar className="w-6 h-6 border-white border-2">
        <AvatarImage src={link} alt="@codepium" />
        <AvatarFallback>{shortName}</AvatarFallback>
      </Avatar>
      <p className="text-xs text-gray-400">
        {userName} - {dateFromNow}
      </p>
      {question.isEdited && <p className="text-xs text-gray-400">(Edited)</p>}
      <UserAction
        className={"ml-auto"}
        mode={mode}
        visible={fromUser}
        id={question.id}
        editSite={editSite}
      />
    </div>
  );
}

interface Props {
  fromUser: boolean;
  question: Question;
}
