"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ExpertisePicker from "./ExpertisePicker";
import { useEffect, useState } from "react";
import { FilterIcon, ListRestart, Rows3 } from "lucide-react";
import { DatePickerWithRange } from "./DateRangePicker";
import { DateRange } from "react-day-picker";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const Filter = ({ values }: Prop) => {
  const [openExpertise, setOpenExpertise] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [filter, setFilter] = useState<settings>({
    tag: [],
    search: "",
    date: undefined,
  });

  useEffect(() => {
    values(filter);
  }, [filter]);

  const expertiseHandler = (arg: Expertise[]) => {
    setFilter({ ...filter, tag: arg });
  };
  const datePickerHandler = (arg: DateRange) => {
    setFilter({ ...filter, date: arg });
  };
  const searchHandler = () => {
    setFilter({ ...filter, search: input });
  };
  const resetForm = () => {
    setInput("");
    setFilter({ tag: [], search: "", date: undefined });
  };

  return (
    <div className="flex gap-3 px-2 py-1 rounded-md">
      <Dialog onOpenChange={(o) => setOpenExpertise(o)} open={openExpertise}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter by expertise</DialogTitle>
            <DialogDescription>
              <div className="my-3">
                <ExpertisePicker
                  value={expertiseHandler}
                  defaultValues={filter.tag}
                />
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder="🔎 Search by question title"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="submit" onClick={() => searchHandler()}>Search</Button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="ml-auto">
          <div className="flex gap-1 justify-center items-center transition-all hover:bg-accent bg-hslvar px-4 py-3 rounded-md">
            <span>Filter</span>
            <FilterIcon size={20} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Filter by date</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DatePickerWithRange
            dates={datePickerHandler}
            defaultVal={filter.date}
          />
          <DropdownMenuLabel>Filter by expertise</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setOpenExpertise(true)}
            className="hover:bg-accent"
          >
            <Rows3 size={20} />
            <span className="ml-2">Open expertise Picker</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Button
            variant={"outline"}
            className="mr-0auto"
            size={"sm"}
            onClick={() => resetForm()}
          >
            <ListRestart size={20} />
            <span className="ml-2">Reset</span>
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default Filter;

interface Prop {
  values: (filter: settings) => void;
}
export interface settings {
  tag: Expertise[];
  search: string;
  date: DateRange | undefined;
}
