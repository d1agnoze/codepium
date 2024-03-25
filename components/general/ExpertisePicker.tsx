import useFetchCurrent from "@/hooks/fetch";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MultiSelect from "../external/MultiSelect";
import { Skeleton } from "../ui/skeleton";

export default function ExpertisePicker({ value, defaultValues }: {
  value: (arg: Expertise[]) => void;
  defaultValues?: Expertise[];
}) {
  const { data, error, loading } = useFetchCurrent("general/expertises");
  const [selected, setSelected] = useState<Expertise[]>(defaultValues ?? []);
  const router = useRouter();

  useEffect(() => {
    if (data) {
    }
    if (error) router.push("/error");
  }, [data, error]);

  useEffect(() => {
    value(selected);
  }, [selected]);

  const valueHandler = (items: Expertise[]) => {
    // INFO ; handler here
    setSelected(items);
  };

  return (
    <>
      {loading ? <Skeleton className="w-full h-10" /> : (
        <MultiSelect
          defaultValues={defaultValues}
          value={valueHandler}
          data={data}
        />
      )}
    </>
  );
}
