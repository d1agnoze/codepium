import Recommend from "@/components/question/Recommend";
import { DEFAULT_SITE } from "@/defaults/site";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const url_base = DEFAULT_SITE;
  const supabase = createServerComponentClient({ cookies: () => cookies() });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="w-full flex flex-col px-8 mt-5 gap-3">
      <div className="w-full mb-5">
        <h1 className="text-2xl font-bold">Recommended Question</h1>
        <p>
          List of recommended questions tailored to your selected expertises
        </p>
      </div>
      <div>
        <Recommend url_base={url_base} />
      </div>
    </div>
  );
}
