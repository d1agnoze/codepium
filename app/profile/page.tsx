"use server";

import Personalization from "@/components/dialogs/change-user-images.dialog";
import BadgeList from "@/components/question/BadgeList";
import ProfileShowCase from "@/components/server/profile/ProfileShowcase";
import Statistic from "@/components/server/profile/Statistic";
import StopLoading from "@/components/stoploading";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { get_user_seo } from "@/types/get_user_seo.dto";
import { Supabase } from "@/utils/supabase/serverCom";
import { getUser } from "@/utils/supabase/user";
import { PencilLine } from "lucide-react";

export default async function Page() {
  try {
    const supabase = Supabase();
    const auth = await getUser(supabase);

    const { data: user, error } = await supabase
      .from("get_user_full")
      .select()
      .eq("id", auth.id)
      .single<get_user_seo>();

    if (error) throw new Error("Error fetching user data");

    const { data: stats } = await supabase
      .from("get_statistic")
      .select()
      .eq("id", user.id)
      .single<Statistic>();

    const profile_prop = {
      background_image: user.background_image,
      display_name: user.display_name,
      user_name: user.user_name,
      email: user.email,
    };

    const { data, error: expertise_error } = await supabase
      .from("ExpertiseTracker")
      .select(`Expertise(id, display_name)`)
      .eq("user_id", user.id)
      .returns<{ Expertise: Expertise }[]>();
    if (expertise_error) throw new Error(expertise_error.message);
    const expertises = data.map((e) => e.Expertise);

    return (
      <div className="flex flex-col justify-center box-border px-2 relative">
        <ProfileShowCase {...profile_prop} />
        <StopLoading />
        <div className="absolute top-1 right-3">
          <Personalization user={user} />
        </div>
        <div className="container mb-10">
          <div className="w-full flex flex-col gap-2 bg-hslvar rounded-md px-5 py-3 mb-3">
            <div className="flex gap-1">
              <PencilLine />
              <p>About</p>
            </div>
            <Textarea disabled value={user.about} className="bg-hslvar" />
          </div>
          {stats ? (
            <Statistic statistic={stats} />
          ) : (
            <div className="mt-3 text-center p-5 bg-hslvar rounded-md">
              Statistic records not found
            </div>
          )}
          <div className="w-full my-5">
            <h1 className="text-2xl font-bold my-3">🎓Expertises:</h1>
            <Separator className="my-2" />
            <BadgeList tags={expertises} />
          </div>
        </div>
      </div>
    );
  } catch (err: any) {
    console.log(err.message);
    throw err;
  }
}
