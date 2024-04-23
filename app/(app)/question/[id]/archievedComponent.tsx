import { Button } from "@/components/ui/button";

export default async function Archived({ msg }: { msg: string }) {
  return (
    <div className="rounded-md bg-hslvar p-10 mx-5">
      <h1 className="font-bold text-2xl">This question has been archived</h1>
      <p>Archived reason: {msg}</p>
      <Button size={"sm"} className="mt-5">Go back home</Button>
    </div>
  );
}
