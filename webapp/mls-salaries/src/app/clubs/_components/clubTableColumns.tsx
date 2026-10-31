"use client"

import { Column, ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import { Button } from "../../../components/ui/button"

export type TableClub = {
    clubName: string;
    clubid: string;
    totalBaseSal: number;
    totalGuarComp: number;
    reportYear: string;
}

function SortableHeader({ column, label, mobileLabel }: { column: Column<TableClub, unknown>, label: string, mobileLabel?: string }){
    const sorted = column.getIsSorted()

    return (
        <div className="flex justify-end">
            <Button
                variant="ghost"
                size="sm"
                className="px-1 md:px-3 text-xs md:text-sm"
                onClick={() => column.toggleSorting(sorted === "asc")}
            >
                {mobileLabel ? (
                    <>
                        <span className="md:hidden">{mobileLabel}</span>
                        <span className="hidden md:inline">{label}</span>
                    </>
                ) : label}
                {sorted === "asc" ? (
                    <ArrowUp className="hidden size-4 md:inline"/>
                ) : sorted === "desc" ? (
                    <ArrowDown className="hidden size-4 md:inline"/>
                ) : (
                    <ArrowUpDown className="hidden size-4 md:inline"/>
                )}
            </Button>
        </div>
    )
}

export const clubColumns: ColumnDef<TableClub>[] = [
    {
        id: "index",
        header: () => <span className="hidden md:inline">#</span>,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => {
            return <div className="text-muted-foreground">{row.index + 1}</div>
        }
    },
    {
        accessorKey: "clubName",
        header: "Club",
        enableHiding: false,
        cell: ({ row }) => {
            const club = row.original
            return (
                <Link href={`/clubs/${club.clubid}?year=${club.reportYear}`} className="font-medium hover:underline" prefetch={false}>
                    {club.clubName}
                </Link>
            )
        },
    },
    {
        accessorKey: "totalBaseSal",
        header: ({ column }) => <SortableHeader column={column} label="Base salary"/>,
        cell: ({ row }) => {
            const value = row.getValue<number>("totalBaseSal")
            return <div className="text-right">${value.toLocaleString()}</div>
        }
    },
    {
        accessorKey: "totalGuarComp",
        header: ({ column }) => <SortableHeader column={column} label="Guaranteed comp." mobileLabel="Guaranteed"/>,
        cell: ({ row }) => {
            const value = row.getValue<number>("totalGuarComp")
            const baseSal = row.original.totalBaseSal ?? value
            return (
                <div className="flex flex-col items-end">
                    <span className="font-semibold">${value.toLocaleString()}</span>
                    <span className="md:hidden text-xs text-muted-foreground">Base ${baseSal.toLocaleString()}</span>
                </div>
            )
        }
    },
]
