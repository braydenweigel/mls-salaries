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
import { cn } from "@/lib/utils";

interface DataTableProps<TData extends TablePlayer, TValue>{
    columns: ColumnDef<TData, TValue>[];
    data: TData[]
}

const MOBILE_HIDDEN_COLUMNS = new Set(["club", "position", "baseSal"])

export function PlayerTable<TData extends TablePlayer, TValue>({
    columns,
    data
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

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

    })

    const allPlayerClubs: string[] = []
    for (const player of data){
        allPlayerClubs.push(player.club)
    }
    const clubs = [...new Set(allPlayerClubs)]//remove duplicates

    return (
        <div className="flex h-full min-h-0 w-full flex-col">
            <div className="shrink-0 grid grid-cols-1 md:grid-cols-2 items-center w-fit gap-2 py-2">
                <div className="flex items-center space-x-2">
                    <PositionFilter
                        value={(table.getColumn("position")?.getFilterValue() as string[]) ?? []}
                        onChange={(value) => table.getColumn("position")?.setFilterValue(value.length ? value : undefined)}
                    />
                    <ClubFilter
                        value={(table.getColumn("club")?.getFilterValue() as string[]) ?? []}
                        onChange={(value) => table.getColumn("club")?.setFilterValue(value.length ? value : undefined)}
                        clubs={clubs}
                    />
                </div>
                <Input
                    placeholder="Filter players..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm text-xs md:text-sm"
                />
            </div>
            <div className="min-h-0 overflow-y-auto w-full overflow-x-hidden">
                <Table className="table-fixed text-xs md:text-sm">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id} className={cn("sticky top-0 z-10 min-w-0 px-0.5 md:px-2", MOBILE_HIDDEN_COLUMNS.has(header.column.id) && "hidden md:table-cell")}>
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
                                <TableCell key={cell.id} className={cn("min-w-0 px-0.5 md:px-2", MOBILE_HIDDEN_COLUMNS.has(cell.column.id) && "hidden md:table-cell")}>
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
            <div className="shrink-0 flex justify-between items-start w-full space-x-2 py-4">
                <Button variant="destructive" size="sm" className="text-xs md:text-sm" onClick={() => table.resetColumnFilters()}>Reset</Button>
                <div className="flex flex-col items-end gap-4">
                    <ButtonGroup className="">
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs md:text-sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            >
                            <ArrowLeft/>Previous
                            </Button>
                            <Button
                            variant="outline"
                            size="sm"
                            className="text-xs md:text-sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            >
                            Next<ArrowRight/>
                        </Button>
                    </ButtonGroup>
                    <div className="flex items-center">
                        <Label className="text-xs md:text-sm">Rows per page: &emsp;</Label>
                        <SelectNumRows pageSize={table.getState().pagination.pageSize} dataSize={data.length} onPageSizeChange={(size) => table.setPageSize(size)}/>
                    </div>
                </div>
            </div>
        </div>
    )
}