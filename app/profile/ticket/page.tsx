"use server";

import CreateTicketDialog from "@/components/ticket/create_dialog";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { columns } from "./columns";
import { getTickets } from "./actions";

export default async function Page() {
  const data = await getTickets();
  return (
    <div className="mx-5 flex flex-col gap-3">
      <h1 className="text-3xl font-bold">Tickets</h1>
      <CreateTicketDialog />
      <Separator className="mt-5" />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
