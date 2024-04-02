import Browse from "@/components/question/Browse";
import { DEFAULT_SITE } from "@/defaults/site";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function Page({
  searchParams: search,
}: {
  searchParams: { filter?: string };
}) {
  const url_base = DEFAULT_SITE;
  let filter;
  if (search.filter != null || search.filter === "") {
    const supabase = createServerComponentClient({ cookies: () => cookies() });
    const { data, error } = await supabase
      .from("Expertise")
      .select()
      .eq("id", search.filter)
      .single<Expertise>();
    if (error || data == null) {
      console.error(error);
      notFound();
    }
    filter = data;
    console.log('dsudsdu',data);
  }
  return (
    <div className="w-full flex flex-col px-8 mt-5 gap-3">
      <div className="w-full mb-5">
        <h1 className="text-2xl font-bold">Question</h1>
        <p>Explore lastest questions and help other programmers</p>
      </div>
      {/* QUESTIONS */}
      <div>
        <Browse url_base={url_base} pre_sel_exp={filter} />
      </div>
    </div>
  );
}
