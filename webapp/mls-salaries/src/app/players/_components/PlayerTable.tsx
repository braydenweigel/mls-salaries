"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
    VisibilityState, 
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
import { Input } from "@/components/ui/input";
import { PositionFilter } from "@/components/lib/PositionFilter";
import { ClubFilter } from "@/components/lib/ClubFilter";
import { ButtonGroup } from "@/components/ui/button-group";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SelectNumRows from "./SelectNumRows";
import { Label } from "@/components/ui/label";
import { TablePlayer } from "./playerTableColumns";

interface DataTableProps<TData extends TablePlayer, TValue>{
    columns: ColumnDef<TData, TValue>[];
    data: TData[]
}

export function PlayerTable<TData extends TablePlayer, TValue>({
    columns,
    data
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({club: true, position: true, baseSal: true})
    const isMobile = useIsMobile()

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility
        },

    })

    React.useEffect(() => {
        setColumnVisibility({
            club: !isMobile,
            position: !isMobile,
            baseSal: !isMobile
        })
    }, [isMobile])

    const allPlayerClubs: string[] = []
    for (const player of data){
        allPlayerClubs.push(player.club)
    }
    const clubs = [...new Set(allPlayerClubs)]//remove duplicates

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center w-fit gap-2 py-2">
                <div className="flex items-center space-x-2">
                    <PositionFilter column={table.getColumn("position")!}/>
                    <ClubFilter column={table.getColumn("club")!} clubs={clubs}/>
                </div>
                <Input
                    placeholder="Filter players..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
            <div className="max-h-[55vh] overflow-y-auto w-full overflow-x-hidden">
                <Table className="table-fixed">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id} className="sticky top-0 z-10 min-w-0">
                                        {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                            )}
                                    </TableHead>
                                    )
                                })}
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
                               {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id} className=" min-w-0">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                                ))} 
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
            <div className="flex justify-between items-start w-full space-x-2 py-4">
                <Button variant="destructive" size="sm" className="" onClick={() => table.resetColumnFilters()}>Reset</Button>
                <div className="flex flex-col items-end gap-4">
                    <ButtonGroup className="">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            >
                            <ArrowLeft/>Previous
                            </Button>
                            <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            >
                            Next<ArrowRight/>
                        </Button>
                    </ButtonGroup>
                    <div className="flex items-center">
                        <Label>Rows per page: &emsp;</Label>
                        <SelectNumRows pageSize={table.getState().pagination.pageSize} dataSize={data.length} onPageSizeChange={(size) => table.setPageSize(size)}/>
                    </div>
                </div>
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