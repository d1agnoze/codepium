"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { RefreshCcw } from "lucide-react";
import { post_seo } from "@/types/post.seo";
import Post from "./PostSEODisplay";

interface DataTableProps<TData extends post_seo, TValue = post_seo> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filter_col?: { key: keyof TData; label: string }[];
}
export function PostDataTable<TData extends post_seo, TValue = post_seo>({
  columns,
  data,
  filter_col,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [filteredData, setFilteredData] = useState<string | null>(null);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex items-center py-4">
        {/* INFO: table filter*/}
        {filter_col && (
          <div className="flex gap-3">
            <Select onValueChange={(value) => setFilteredData(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtered by" />
              </SelectTrigger>
              <SelectContent>
                {filter_col?.map((col, index) => (
                  <SelectItem value={col.key.toString()} key={index}>
                    {col.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filteredData && (
              <Input
                placeholder="Filter title..."
                value={
                  (table
                    .getColumn(filteredData.toString())
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table
                    .getColumn(filteredData.toString())
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
            )}
          </div>
        )}

        <div className="ml-auto flex gap-1">
          {/* INFO: table reset*/}
          <Button
            variant="outline"
            className="flex gap-1"
            onClick={() => table.reset()}
          >
            <span>
              <RefreshCcw size={15} />
            </span>
            <span>Reset</span>
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
        </Table>
      </div>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <div className="my-3">
            <Post post={row.original} />
          </div>
        ))
      ) : (
        <div className="h-24 text-center">No results.</div>
      )}

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground">
          Total record: {table.getFilteredRowModel().rows.length}
        </div>
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
