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
import { PositionFilter } from "@/components/lib/PositionFilter";
import { ArrowUpDown, Download, Search } from "lucide-react";
import { TableClubPlayers } from "./clubPlayerTableColumns";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableProps<TData extends TableClubPlayers, TValue>{
    columns: ColumnDef<TData, TValue>[];
    data: TData[]
    reportSelector?: React.ReactNode
    totalBaseSal: number
    totalGuarComp: number
    positionFilterColor?: string
}

const MOBILE_HIDDEN_COLUMNS = new Set(["position", "baseSal", "pctOfPayroll"])

const SORT_OPTIONS = [
    { label: "Highest paid", id: "guarComp", desc: true },
    { label: "Lowest paid", id: "guarComp", desc: false },
    { label: "Highest base salary", id: "baseSal", desc: true },
    { label: "Lowest base salary", id: "baseSal", desc: false },
]

export function ClubPlayersTable<TData extends TableClubPlayers, TValue>({
    columns,
    data,
    reportSelector,
    totalBaseSal,
    totalGuarComp,
    positionFilterColor
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([{id: "guarComp", desc: true}])
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
                <div className="relative w-full md:w-auto">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
                    <Input
                        placeholder="Filter by player name..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                        className="w-full pl-8 text-xs md:w-[260px] md:text-sm"
                    />
                </div>
                <PositionFilter
                    value={(table.getColumn("position")?.getFilterValue() as string[]) ?? []}
                    onChange={(value) => table.getColumn("position")?.setFilterValue(value.length ? value : undefined)}
                    applyColor={positionFilterColor}
                />
                <Button variant="outline" className="ml-auto hidden md:flex text-xs md:text-sm">
                    <Download className="size-4"/>
                    Export CSV
                </Button>
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
            <div className="shrink-0 flex items-center justify-between gap-3 rounded-md border bg-muted/40 px-3 py-2 mb-2 text-xs md:text-sm">
                <span className="font-semibold">Club totals</span>
                <div className="flex items-center gap-4 text-right">
                    <span className="text-muted-foreground">Base <span className="font-semibold text-foreground">${totalBaseSal.toLocaleString()}</span></span>
                    <span className="text-muted-foreground">Guaranteed <span className="font-semibold text-foreground">${totalGuarComp.toLocaleString()}</span></span>
                </div>
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
                                <TableCell key={cell.id} className={cn("min-w-0 px-0.5 py-3 md:px-2 md:py-2", MOBILE_HIDDEN_COLUMNS.has(cell.column.id) && "hidden md:table-cell", cell.column.id === "name" && "max-w-0 w-full md:max-w-none md:w-auto", cell.column.id === "index" && "pr-2 md:pr-2")}>
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
                Showing {rows.length} player{rows.length === 1 ? "" : "s"}
            </div>
        </div>
    )
}
