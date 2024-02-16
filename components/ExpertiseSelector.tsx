import useFetchCurrent from "@/hooks/fetch";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

export default function ExpertiseSelector(
  { value }: { value: (arg: Expertise[]) => void },
) {
  const { data, error, loading } = useFetchCurrent("general/expertises");
  const [selected, setSelected] = useState<Expertise[]>([]);
  const [columns, setColumns] = useState<Expertise[]>([]);
  const itemsPerColumn = 10;
  const router = useRouter();
  useEffect(() => {
    if (data) {
      setColumns(
        Array.from(
          { length: Math.ceil(data.length / itemsPerColumn) },
          (_, index) =>
            data.slice(index * itemsPerColumn, (index + 1) * itemsPerColumn),
        ),
      );
    }
    if (error) router.push("/error");
  }, [data, error]);
  useEffect(() => {
    value(selected);
  }, [selected]);
  return (
    <>
      {!loading &&
        (
          <div className="flex flex-col gap-3">
            <ul className="px-2 py-3 bg-hslvar rounded-md">
              {selected.map((item) => (
                <li key={item.id} className="inline ml-2">
                  <Badge
                    className="bg-accent cursor-pointer"
                    onClick={() =>
                      setSelected(
                        selected.filter((expertis) => expertis.id != item.id),
                      )}
                  >
                    {item.display_name}
                  </Badge>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              {columns.map((column, columnIndex) => (
                <ul key={columnIndex} className="column">
                  {/**@ts-ignore */}
                  {column.map((item) => (
                    <li key={item.id}>
                      <Badge
                        className={cn(
                          "cursor-pointer text-sm my-0.5",
                          selected.includes(item) && "hidden",
                        )}
                        onClick={() => {
                          if (!selected.includes(item)) {
                            setSelected([...selected, item]);
                          }
                        }}
                      >
                        {item.display_name}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        )}
    </>
  );
}
