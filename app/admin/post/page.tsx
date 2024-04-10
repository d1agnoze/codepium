"use server";

import { DataTable } from "@/components/ui/data-table";
import { FetchError } from "@/helpers/error/FetchError";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { columns } from "./columns";
import { post_admin } from "@/types/post_admin.type";

export default async function Page() {
  try {
    const post_admin = await getData();
    return (
      <div className="container mx-auto">
        <DataTable
          columns={columns}
          data={post_admin}
          filter_col={[
            { key: "id", label: "Article's id" },
            { key: "title", label: "Title" },
            { key: "user_id", label: "User's id" },
          ]}
        />
      </div>
    );
  } catch (err: any) {
    throw err;
  }
}

async function getData(): Promise<post_admin[]> {
  const supabase = createServerActionClient({ cookies: () => cookies() });
  const { data, error } = await supabase
    .from("get_post_admin")
    .select()
    .returns<post_admin[]>();
  if (!data || error) throw new FetchError(error.message);
  return data;
}
