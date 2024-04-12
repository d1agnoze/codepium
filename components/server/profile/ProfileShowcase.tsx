import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { DEFAULT_AVATAR } from "@/defaults/profile";
import { sha256 } from "js-sha256";
import Image from "next/image";

const ProfileShowCase = (user: Props) => {
  const img_link = `https://gravatar.com/avatar/${sha256(user!.email)}?d=${encodeURIComponent(
    DEFAULT_AVATAR,
  )}&s=100`;
  return (
    <div>
      <div className="w-full md:h-[24vh] max-sm:h-[20dvh] max-sm:mb-6 md:mb-8 overflow-hidden relative">
        <Image
          src={user!.background_image}
          fill={true}
          className="object-cover z-0 rounded-lg"
          priority={true}
          alt="user's background image"
        />
        <div className="absolute bottom-3 left-5 z-10 flex gap-3 items-center">
          <Avatar className="w-28 h-28 border-white border-2">
            <AvatarImage src={img_link} alt="@shadcn" />
            <AvatarFallback>{user?.user_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <Card className="py-2 pl-5 pr-8 border-0 bg-hslvar transition cursor-default">
            <CardTitle>{user?.display_name}</CardTitle>
            <CardDescription>@{user?.user_name}</CardDescription>
          </Card>
        </div>
      </div>
    </div>
  );
};
interface Props {
  background_image: string;
  display_name: string;
  user_name: string;
  email: string;
}
export default ProfileShowCase;
