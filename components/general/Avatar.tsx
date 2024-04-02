import { showLoading } from "@/utils/loading.service";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import { sha256 } from "js-sha256";
import { DEFAULT_AVATAR, DEFAULT_BACKGROUND } from "@/defaults/profile";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CircleUserRound, Mail } from "lucide-react";

const Profile = ({
  display_name,
  background_img,
  email,
  size,
  border,
  username,
  id,
}: Prop) => {
  const router = useRouter();
  const link = sha256(email.trim().toLowerCase());
  const def: string = encodeURIComponent(DEFAULT_AVATAR);
  const clickHandler = () => {
    showLoading();
    router.push("/user/" + id);
  };
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Avatar
          className={`${size ? `w-${size} h-${size}` : "w-10 h-10"} ${border && "border-white border-2"} cursor-pointer`}
        >
          <AvatarImage
            onClick={() => clickHandler()}
            src={`https://gravatar.com/avatar/${link}?d=${def}&s=100`}
          />
          <AvatarFallback>{email.charAt(0)}</AvatarFallback>
        </Avatar>
      </HoverCardTrigger>
      <HoverCardContent className="pt-0 px-0 rounded-md">
        <div className="relative flex flex-col gap-10">
          <div className="w-full h-14 overflow-hidden rounded-md">
            <img src={`${background_img ?? DEFAULT_BACKGROUND}`} />
          </div>
          <div className="absolute top-1/4 left-3 flex gap-2 items-center ">
            <Avatar className={`w-10 h-10 cursor-pointer`}>
              <AvatarImage
                onClick={() => clickHandler()}
                src={`https://gravatar.com/avatar/${link}?d=${def}&s=100`}
              />
              <AvatarFallback>{email.charAt(0)}</AvatarFallback>
            </Avatar>

            {username && (
              <p className="text-primary px-3 py-1 bg-hslvar rounded-lg">
                @{username}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1 px-3 text-sm">
            {display_name && (
              <div className="flex gap-2">
                <span>
                  <CircleUserRound size={20} />
                </span>
                <p>{display_name}</p>
              </div>
            )}
            <div className="flex gap-2">
              <span>
                <Mail size={20} />
              </span>
              <p>{email}</p>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
export default Profile;

interface Prop {
  id: string;
  email: string;
  display_name?: string;
  background_img?: string;
  size?: string;
  border?: string;
  username?: string;
}
