import Browse from "@/components/question/Browse";
import { DEFAULT_SITE } from "@/defaults/site";
import { Supabase } from "@/utils/supabase/serverCom";

export default async function Page({ searchParams: search }: Props) {
  let filter;

  if (search.filter != null || search.filter === "") {
    const sb = Supabase();

    const { data, error } = await sb
      .from("Expertise")
      .select()
      .eq("id", search.filter)
      .single<Expertise>();

    if (error || data == null) throw new Error("Invalid filter");

    filter = data;
  }

  return (
    <div className="w-full flex flex-col px-8 mt-3 mb-10 gap-3">
      <div className="w-full mb-5">
        <h1 className="text-2xl font-bold">Question</h1>
        <p>Explore lastest questions and help other programmers</p>
      </div>
      {/* QUESTIONS */}
      <div>
        <Browse url_base={DEFAULT_SITE} pre_sel_exp={filter} />
      </div>
    </div>
  );
}

interface Props {
  searchParams: { filter?: string };
}
