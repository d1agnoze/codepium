"use server";

import { DataTable } from "@/components/ui/data-table";
import { FetchError } from "@/helpers/error/FetchError";
import { question_seo } from "@/types/question.seo";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { columns } from "./columns";

export default async function Page() {
  try {
    const question_seo = await getData();

    /*TODO: finish question admin page*/
    return (
      <div className="container mx-auto">
        <DataTable columns={columns} data={question_seo} />
      </div>
    );
  } catch (err: any) {
    throw err;
  }
}

async function getData(): Promise<question_seo[]> {
  const supabase = createServerActionClient({ cookies: () => cookies() });
  const { data, error } = await supabase
    .from("get_question_seo")
    .select()
    .returns<question_seo[]>();
  if (!data || error) throw new FetchError(error.message);
  return data;
}
