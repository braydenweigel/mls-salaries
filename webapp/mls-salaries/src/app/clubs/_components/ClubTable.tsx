"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
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
import { ArrowUpDown, Columns3, Search } from "lucide-react";
import { TableClub } from "./clubTableColumns";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableProps<TData extends TableClub, TValue>{
    columns: ColumnDef<TData, TValue>[];
    data: TData[]
    reportSelector?: React.ReactNode
    filters?: React.ReactNode
}

const MOBILE_HIDDEN_COLUMNS = new Set(["totalBaseSal"])

const COLUMN_LABELS: Record<string, string> = {
    totalBaseSal: "Base salary",
    totalGuarComp: "Guaranteed comp.",
}

const SORT_OPTIONS = [
    { label: "Highest paid", id: "totalGuarComp", desc: true },
    { label: "Lowest paid", id: "totalGuarComp", desc: false },
    { label: "Highest base salary", id: "totalBaseSal", desc: true },
    { label: "Lowest base salary", id: "totalBaseSal", desc: false },
]

export function ClubTable<TData extends TableClub, TValue>({
    columns,
    data,
    reportSelector,
    filters
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([{id: "totalGuarComp", desc: true}])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    })

    const rows = table.getRowModel().rows
    const activeSort = sorting[0]
    const activeSortOption = SORT_OPTIONS.find((option) => option.id === activeSort?.id && option.desc === activeSort?.desc)

    return (
        <div className="flex h-full min-h-0 w-full flex-col">
            <div className="shrink-0 flex flex-wrap items-center gap-2 py-2">
                <React.Fragment key="report-selector">{reportSelector}</React.Fragment>
                <React.Fragment key="filters">{filters}</React.Fragment>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto hidden md:flex text-xs md:text-sm">
                            <Columns3 className="size-4"/>
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                            >
                                {COLUMN_LABELS[column.id] ?? column.id}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto flex md:hidden text-xs">
                            <ArrowUpDown className="size-4"/>
                            {activeSortOption?.label ?? "Sort"}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {SORT_OPTIONS.map((option) => (
                            <DropdownMenuCheckboxItem
                                key={option.label}
                                checked={activeSortOption?.label === option.label}
                                onCheckedChange={() => setSorting([{ id: option.id, desc: option.desc }])}
                            >
                                {option.label}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="min-h-0 overflow-y-auto w-full overflow-x-auto">
                <Table className="text-xs md:text-sm">
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
                        {rows?.length ? (
                            rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                               {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id} className={cn("min-w-0 px-0.5 py-3 md:px-2 md:py-2", MOBILE_HIDDEN_COLUMNS.has(cell.column.id) && "hidden md:table-cell", cell.column.id === "clubName" && "max-w-0 w-full md:max-w-none md:w-auto", cell.column.id === "index" && "pr-2 md:pr-2")}>
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
            <div className="hidden md:block shrink-0 pt-4 text-xs md:text-sm text-muted-foreground">
                Showing {rows.length} club{rows.length === 1 ? "" : "s"}
            </div>
        </div>
    )
}
