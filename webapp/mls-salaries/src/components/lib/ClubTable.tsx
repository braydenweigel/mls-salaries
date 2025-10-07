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
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import React from "react";
import { Input } from "../ui/input";
import { PositionFilter } from "./PositionFilter";
import { ClubFilter } from "./ClubFilter";
import { ButtonGroup } from "../ui/button-group";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SelectNumRows from "./SelectNumRows";
import { Label } from "../ui/label";

interface DataTableProps<TData, TValue>{
    columns: ColumnDef<TData, TValue>[];
    data: TData[]
}

export function ClubTable<TData, TValue>({
    columns,
    data
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

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

    return (
        <div className="w-full table-fixed">
            <div className="flex items-center w-full py-4 justify-between">
                <div className="flex items-center space-x-4">
                    <ClubFilter column={table.getColumn("clubName")} />
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
            </div>
        </div>
    )
}