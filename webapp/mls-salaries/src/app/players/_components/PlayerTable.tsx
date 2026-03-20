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
                                {isMobile ? 
                                    <><TableHead key={headerGroup.headers[0].id} className="sticky top-0 z-10">
                                        {headerGroup.headers[0].isPlaceholder
                                        ? null
                                        : flexRender(
                                            headerGroup.headers[0].column.columnDef.header,
                                            headerGroup.headers[0].getContext()
                                        )}
                                    </TableHead>
                                    <TableHead key={headerGroup.headers[4].id} className="sticky top-0 z-10">
                                        {headerGroup.headers[4].isPlaceholder
                                        ? null
                                        : flexRender(
                                            headerGroup.headers[4].column.columnDef.header,
                                            headerGroup.headers[4].getContext()
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
                                    </TableHead>
                                    <TableHead key={headerGroup.headers[3].id} className="sticky top-0 z-10 min-w-0">
                                        {headerGroup.headers[3].isPlaceholder
                                        ? null
                                        : flexRender(
                                            headerGroup.headers[3].column.columnDef.header,
                                            headerGroup.headers[3].getContext()
                                        )}
                                    </TableHead>
                                    <TableHead key={headerGroup.headers[4].id} className="sticky top-0 z-10 min-w-0">
                                        {headerGroup.headers[4].isPlaceholder
                                        ? null
                                        : flexRender(
                                            headerGroup.headers[4].column.columnDef.header,
                                            headerGroup.headers[4].getContext()
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
                                        <TableCell key={row.getVisibleCells().at(4)?.id} className=" min-w-0">
                                            {flexRender(row.getVisibleCells().at(4)?.column.columnDef.cell, row.getVisibleCells().at(4)!.getContext())}
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
                                        <TableCell key={row.getVisibleCells().at(3)?.id} className=" min-w-0">
                                            {flexRender(row.getVisibleCells().at(3)?.column.columnDef.cell, row.getVisibleCells().at(3)!.getContext())}
                                        </TableCell>
                                        <TableCell key={row.getVisibleCells().at(4)?.id} className=" min-w-0">
                                            {flexRender(row.getVisibleCells().at(4)?.column.columnDef.cell, row.getVisibleCells().at(4)!.getContext())}
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
                <div className="grid grid-cols-1 gap-4 space-x-2 py-4">
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
                    <div className="flex items-center space-x-4 ">
                        <Label>Rows per page:</Label>
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