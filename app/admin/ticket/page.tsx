import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { getTickets } from "./actions";

export default async function Page() {
  try {
    const data = await getTickets();
    return (
      <div className="container mx-auto">
        <DataTable
          columns={columns}
          data={data}
          filter_col={[
            { key: "id", label: "Ticket's id" },
            { key: "title", label: "Title" },
            { key: "sender_id", label: "User's id" },
          ]}
        />
      </div>
    );
  } catch (err: any) {
    throw err;
  }
}
