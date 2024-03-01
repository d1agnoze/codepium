"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Error from "next/error";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies: () => cookies() });
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase.from("Question").select().eq(
    "id",
    params.id,
  );
  if (error) {
    console.error(error);
    notFound();
  } else console.log(data);
  // let { data, error } = await supabase
  //   .rpc("get_expertises_set", {
  //     data.tag,
  //   });
  // if (error) console.error(error);
  // else console.log(data);
  return (
    <div className="w-full box-border px-5 lg:px-32 mt-3 flex flex-col gap-2">
      <div className="w-full bg-hslvar px-4 py-5 rounded-lg">
        {params.id}
      </div>
    </div>
  );
}
