"use server";
import { DataTable } from "@/components/ui/data-table";
import { createServerActionClient as initClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { columns } from "./columns";
import { user_admin as User } from "@/types/user.admin";
import { AuthError } from "@/helpers/error/AuthError";

export default async function Page() {
  try {
    const data = await getData();
    console.log(data);
    return (
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold">Member list</h1>
        <DataTable
          columns={columns}
          data={data}
          filter_col={[
            { key: "id", label: "user's id" },
            { key: "display_name", label: "Display name" },
            { key: "user_name", label: "Username" },
          ]}
        />
      </div>
    );
  } catch (err: any) {
    throw err;
  }
}

async function getData(): Promise<User[]> {
  try {
    const sb = initClient({ cookies: () => cookies() });
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) throw new AuthError("Unauthorized access");

    const { data, error } = await sb
      .from("get_user_admin")
      .select()
      .neq("id", user.id)
      .returns<User[]>();
    if (!data || error) throw new Error(error.message);

    return data;
  } catch (err: any) {
    throw err;
  }
}
