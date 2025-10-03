"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
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

interface DataTableProps<TData, TValue>{
    columns: ColumnDef<TData, TValue>[];
    data: TData[]
}

export function PlayerTable<TData, TValue>({
    columns,
    data
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    })

    return (
        <Card>
            <CardContent>
                
            </CardContent>
        </Card>
    )
}