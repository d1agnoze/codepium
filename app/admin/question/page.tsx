"use server";

import { DataTable } from "@/components/ui/data-table";
import { FetchError } from "@/helpers/error/FetchError";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { columns } from "./columns";
import { question_admin } from "@/types/question.admin";

export default async function Page() {
  try {
    const question_admin = await getData();
    return (
      <div className="container mx-auto">
        <DataTable
          columns={columns}
          data={question_admin}
          filter_col={[
            { key: "id", label: "Question's id" },
            { key: "title", label: "Title" },
            { key: "user_id", label: "User's id" },
            { key: "stars", label: "Votes" },
          ]}
        />
      </div>
    );
  } catch (err: any) {
    throw err;
  }
}

async function getData(): Promise<question_admin[]> {
  const supabase = createServerActionClient({ cookies: () => cookies() });
  const { data, error } = await supabase
    .from("get_question_admin")
    .select()
    .returns<question_admin[]>();
  if (!data || error) throw new FetchError(error.message);
  return data;
}
// async function
