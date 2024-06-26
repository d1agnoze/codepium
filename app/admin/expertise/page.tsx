import { DataTable } from "@/components/ui/data-table";
import { expertise_admin } from "@/types/expertise-admin.type";
import { createServerActionClient as initClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { columns } from "./columns";
import CreateExpertiseDialog from "@/components/dialogs/create_exp.dialog";

export default async function Page() {
  try {
    const data = await getData();
    return (
      <div className="container mx-auto">
        <CreateExpertiseDialog/>
        <DataTable
          columns={columns}
          data={data}
          filter_col={[
            { key: "id", label: "Expertise's id" },
            { key: "display_name", label: "Display name" },
          ]}
        />
      </div>
    );
  } catch (err: any) {
    throw err;
  }
}

async function getData(): Promise<expertise_admin[]> {
  try {
    const sb = initClient({ cookies: () => cookies() });
    const { data, error } = await sb
      .from("get_expertise_stat")
      .select()
      .returns<expertise_admin[]>();
    if (!data || error) throw new Error(error.message);

    return data;
  } catch (err: any) {
    throw err;
  }
}
