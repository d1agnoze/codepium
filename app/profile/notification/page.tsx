"use server";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { getNotifications } from "../actions";

export default async function Page() {
  try {
    const data = await getNotifications();
    return (
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold">Notification center</h1>
        <DataTable
          columns={columns}
          data={data}
          filter_col={[
            { key: "sender", label: "Sender" },
            { key: "message", label: "Message" },
          ]}
        />
      </div>
    );
  } catch (err: any) {
    throw err;
  }
}
