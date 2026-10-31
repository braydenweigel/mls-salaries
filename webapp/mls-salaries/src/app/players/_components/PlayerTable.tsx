"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    PaginationState,
    SortingState,
    VisibilityState,
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
import { ArrowLeft, ArrowRight, ArrowUpDown, Search, SlidersHorizontal } from "lucide-react";
import SelectNumRows from "./SelectNumRows";
import { Label } from "@/components/ui/label";
import { TablePlayer } from "./playerTableColumns";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableProps<TData extends TablePlayer, TValue>{
    columns: ColumnDef<TData, TValue>[];
    data: TData[]
    reportSelector?: React.ReactNode
}

const MOBILE_HIDDEN_COLUMNS = new Set(["club", "position", "baseSal"])

const COLUMN_LABELS: Record<string, string> = {
    club: "Club",
    position: "Position",
    baseSal: "Base salary",
    guarComp: "Guaranteed comp.",
}

const SORT_OPTIONS = [
    { label: "Highest paid", id: "guarComp", desc: true },
    { label: "Lowest paid", id: "guarComp", desc: false },
    { label: "Highest base salary", id: "baseSal", desc: true },
    { label: "Lowest base salary", id: "baseSal", desc: false },
]

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

export function PlayerTable<TData extends TablePlayer, TValue>({
    columns,
    data,
    reportSelector
}: DataTableProps<TData, TValue>) {
    const isMobile = useIsMobile()
    const [sorting, setSorting] = React.useState<SortingState>([{id: "guarComp", desc: true}])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [pagination, setPagination] = React.useState<PaginationState>({pageIndex: 0, pageSize: 25})

    const effectivePagination: PaginationState = isMobile
        ? {pageIndex: 0, pageSize: Math.max(data.length, 1)}
        : pagination

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
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            pagination: effectivePagination,
        },

    })

    const allPlayerClubs: string[] = []
    for (const player of data){
        allPlayerClubs.push(player.club)
    }
    const clubs = [...new Set(allPlayerClubs)]//remove duplicates

    const rows = table.getRowModel().rows
    const pageIndex = table.getState().pagination.pageIndex
    const pageCount = table.getPageCount()
    const windowSize = Math.min(3, pageCount)
    const windowStart = Math.max(0, Math.min(pageIndex - 1, pageCount - windowSize))
    const pageButtons = Array.from({length: windowSize}, (_, i) => windowStart + i)
    const hasMorePages = windowStart + windowSize < pageCount
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
                />
                <ClubFilter
                    value={(table.getColumn("club")?.getFilterValue() as string[]) ?? []}
                    onChange={(value) => table.getColumn("club")?.setFilterValue(value.length ? value : undefined)}
                    clubs={clubs}
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto hidden md:flex text-xs md:text-sm">
                            <SlidersHorizontal className="size-4"/>
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
            <div className="hidden md:flex shrink-0 flex-col sm:flex-row items-center justify-between gap-3 w-full pt-4 text-xs md:text-sm text-muted-foreground">
                <div>
                    Showing {rows.length} player{rows.length === 1 ? "" : "s"} on this page · {data.length} in release
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Label className="text-xs md:text-sm">Rows per page</Label>
                        <SelectNumRows pageSize={table.getState().pagination.pageSize} dataSize={data.length} onPageSizeChange={(size) => table.setPageSize(size)}/>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            aria-label="Previous page"
                            >
                            <ArrowLeft/>
                        </Button>
                        {pageButtons.map((i) => (
                            <Button
                                key={i}
                                variant={i === pageIndex ? "default" : "outline"}
                                size="icon-sm"
                                className="text-xs md:text-sm"
                                onClick={() => table.setPageIndex(i)}
                            >
                                {i + 1}
                            </Button>
                        ))}
                        {hasMorePages && <span className="px-1">...</span>}
                        <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            aria-label="Next page"
                            >
                            <ArrowRight/>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
