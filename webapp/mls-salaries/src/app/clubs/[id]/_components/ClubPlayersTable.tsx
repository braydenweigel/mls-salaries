"use client"

import {
    ColumnDef,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
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
import { Input } from "@/components/ui/input";
import { PositionFilter } from "@/components/lib/PositionFilter";

interface DataTableProps<TData, TValue>{
    columns: ColumnDef<TData, TValue>[];
    data: TData[]
    selectedPositions: string[]
    onPositionsChange: (value: string[]) => void
    nameFilter: string
    onNameFilterChange: (value: string) => void
}

export function ClubPlayersTable<TData, TValue>({
    columns,
    data,
    selectedPositions,
    onPositionsChange,
    nameFilter,
    onNameFilterChange
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({position: true, baseSal: true})
    const isMobile = useIsMobile()

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnVisibility
        },
    })

    React.useEffect(() => {
        setColumnVisibility({
            position: !isMobile,
            baseSal: !isMobile
        })
    }, [isMobile])

    return (
        <div className="w-full table-fixed">
            <div className="flex items-center w-full py-4 justify-between">
                <div className="flex items-center space-x-4">
                    <Input
                    placeholder="Filter players..."
                    value={nameFilter}
                    onChange={(event) => onNameFilterChange(event.target.value)}
                    className="max-w-sm text-xs md:text-sm"
                    />
                    <PositionFilter value={selectedPositions} onChange={onPositionsChange}/>
                </div>
            </div>
            <div className="max-h-[40vh] overflow-auto w-full md:max-h-[55vh]">
                <Table className="text-xs md:text-sm">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                <TableHead key={header.id} className="sticky top-0 z-10 px-0.5 md:px-2">
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
                                <TableCell key={cell.id} className="px-0.5 md:px-2">
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
                <Button variant="destructive" size="sm" className="text-xs md:text-sm" onClick={() => { onPositionsChange([]); onNameFilterChange("") }}>Reset</Button>
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