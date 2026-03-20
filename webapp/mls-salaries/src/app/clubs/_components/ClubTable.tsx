"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table"

import {
    Table, 
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import React from "react";
import { ClubFilter } from "@/components/lib/ClubFilter"; 
import { TableClub } from "./clubTableColumns";

interface DataTableProps<TData extends TableClub, TValue>{
    columns: ColumnDef<TData, TValue>[];
    data: TData[]
}

export function ClubTable<TData extends TableClub, TValue>({
    columns,
    data
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const isMobile = useIsMobile()

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters
        }
    })

    const clubs: string[] = []
    for (const club of data){
        clubs.push(club.clubName)
    }

    return (
        <div className="w-full table-fixed">
            <div className="flex items-center w-full py-4 justify-between">
                <div className="flex items-center space-x-4">
                    <ClubFilter column={table.getColumn("clubName")!} clubs={clubs} />
                </div>
            </div>
            <div className="max-h-[55vh] overflow-auto w-full">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {isMobile ? 
                                    <><TableHead key={headerGroup.headers[0].id} className="sticky top-0 z-10">
                                        {headerGroup.headers[0].isPlaceholder
                                        ? null
                                        : flexRender(
                                            headerGroup.headers[0].column.columnDef.header,
                                            headerGroup.headers[0].getContext()
                                        )}
                                    </TableHead>
                                    <TableHead key={headerGroup.headers[2].id} className="sticky top-0 z-10">
                                        {headerGroup.headers[2].isPlaceholder
                                        ? null
                                        : flexRender(
                                            headerGroup.headers[2].column.columnDef.header,
                                            headerGroup.headers[2].getContext()
                                        )}
                                    </TableHead></>
                                    :
                                    <><TableHead key={headerGroup.headers[0].id} className="sticky top-0 z-10 min-w-0">
                                        {headerGroup.headers[0].isPlaceholder
                                        ? null
                                        : flexRender(
                                            headerGroup.headers[0].column.columnDef.header,
                                            headerGroup.headers[0].getContext()
                                        )}
                                    </TableHead>
                                    <TableHead key={headerGroup.headers[1].id} className="sticky top-0 z-10 min-w-0">
                                        {headerGroup.headers[1].isPlaceholder
                                        ? null
                                        : flexRender(
                                            headerGroup.headers[1].column.columnDef.header,
                                            headerGroup.headers[1].getContext()
                                        )}
                                    </TableHead>
                                    <TableHead key={headerGroup.headers[2].id} className="sticky top-0 z-10 min-w-0">
                                        {headerGroup.headers[2].isPlaceholder
                                        ? null
                                        : flexRender(
                                            headerGroup.headers[2].column.columnDef.header,
                                            headerGroup.headers[2].getContext()
                                        )}
                                    </TableHead></>
                                }
                            </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {isMobile ? 
                                    <>
                                        <TableCell key={row.getVisibleCells().at(0)?.id} className=" min-w-0">
                                            {flexRender(row.getVisibleCells().at(0)?.column.columnDef.cell, row.getVisibleCells().at(0)!.getContext())}
                                        </TableCell>
                                        <TableCell key={row.getVisibleCells().at(2)?.id} className=" min-w-0">
                                            {flexRender(row.getVisibleCells().at(2)?.column.columnDef.cell, row.getVisibleCells().at(2)!.getContext())}
                                        </TableCell>
                                    </>
                                    :
                                    <>
                                        <TableCell key={row.getVisibleCells().at(0)?.id} className=" min-w-0">
                                            {flexRender(row.getVisibleCells().at(0)?.column.columnDef.cell, row.getVisibleCells().at(0)!.getContext())}
                                        </TableCell>
                                        <TableCell key={row.getVisibleCells().at(1)?.id} className=" min-w-0">
                                            {flexRender(row.getVisibleCells().at(1)?.column.columnDef.cell, row.getVisibleCells().at(1)!.getContext())}
                                        </TableCell>
                                        <TableCell key={row.getVisibleCells().at(2)?.id} className=" min-w-0">
                                            {flexRender(row.getVisibleCells().at(2)?.column.columnDef.cell, row.getVisibleCells().at(2)!.getContext())}
                                        </TableCell>
                                    </>
                                }                               
                            </TableRow>
                            ))
                        ) : (
                            <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                </Table>
            </div>
            <div className="flex justify-between w-full space-x-2 py-4">
                <Button variant="destructive" size="sm" className="" onClick={() => table.resetColumnFilters()}>Reset</Button>
            </div>
        </div>
    )
}

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    setIsMobile(media.matches);

    const listener = () => setIsMobile(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  return isMobile;
}