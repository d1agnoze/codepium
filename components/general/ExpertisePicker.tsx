import useFetchCurrent from "@/hooks/fetch";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MultiSelect from "../external/MultiSelect";

export default function ExpertisePicker({
  value,
  defaultValues,
}: {
  value: (arg: Expertise[]) => void;
  defaultValues?: Expertise[];
}) {
  const { data, error, loading } = useFetchCurrent("general/expertises");
  const [exps, setExps] = useState<Expertise[]>([]);
  const [selected, setSelected] = useState<Expertise[]>(defaultValues ?? []);
  const hasCache = useRef<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    hasCache.current = sessionStorage.getItem("expertises") != null;
  }, []);
  useEffect(() => {
    if (hasCache.current) {
      setExps(JSON.parse(sessionStorage.getItem("expertises")!));
      return;
    }
    if (data && !hasCache.current) {
      sessionStorage.setItem("expertises", JSON.stringify(data));
      hasCache.current = true;
      setExps(data);
    }
    if (error) router.push("/error");
  }, [data, error]);

  useEffect(() => {
    value(selected);
  }, [selected]);

  const valueHandler = (items: Expertise[]) => {
    setSelected(items);
  };

  return (
    <>
      {hasCache.current.valueOf() ? (
        <MultiSelect
          value={valueHandler}
          data={exps}
          defaultValues={defaultValues}
        />
      ) : loading ? (
        <div className="px-3 py-2 rounded-md grid place-items-center bg-hslvar">
          Loading ...
        </div>
      ) : (
        <MultiSelect
          defaultValues={defaultValues}
          value={valueHandler}
          data={exps}
        />
      )}
    </>
  );
}
