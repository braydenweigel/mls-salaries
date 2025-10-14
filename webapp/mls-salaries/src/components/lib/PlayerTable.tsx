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
import { Button } from "../ui/button";
import React from "react";
import { Input } from "../ui/input";
import { PositionFilter } from "./PositionFilter";
import { ClubFilter } from "./ClubFilter";
import { ButtonGroup } from "../ui/button-group";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SelectNumRows from "./SelectNumRows";
import { Label } from "../ui/label";
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
            columnFilters
        }
    })

    const allPlayerClubs: string[] = []
    for (const player of data){
        allPlayerClubs.push(player.club)
    }
    const clubs = [...new Set(allPlayerClubs)]//remove duplicates

    return (
        <div className="w-full table-fixed">
            <div className="flex items-center w-full py-4 justify-between">
                <div className="flex items-center space-x-4">
                    <Input
                    placeholder="Filter players..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                    />
                    <PositionFilter column={table.getColumn("position")!}/>
                    <ClubFilter column={table.getColumn("club")!} clubs={clubs}/>
                </div>
                <div className="flex items-center space-x-4">
                    <Label>Rows per page:</Label>
                    <SelectNumRows pageSize={table.getState().pagination.pageSize} dataSize={data.length} onPageSizeChange={(size) => table.setPageSize(size)}/>
                </div>
            </div>
            <div className="max-h-[55vh] overflow-auto w-full">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                <TableHead key={header.id} className="sticky top-0 z-10">
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
                                <TableCell key={cell.id}>
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
            <div className="flex justify-between w-full space-x-2 py-4">
                <Button variant="destructive" size="sm" className="" onClick={() => table.resetColumnFilters()}>Reset</Button>
                <div className="flex justify-between space-x-2 py-4">
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
                </div>
            </div>
        </div>
    )
}