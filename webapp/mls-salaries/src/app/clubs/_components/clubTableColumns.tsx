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
    colorPrimary?: string;
}

function getPayrollWidthPercent(club: TableClub, allClubs: TableClub[]){
    const maxGuarComp = Math.max(...allClubs.map((c) => c.totalGuarComp), 1)
    return (club.totalGuarComp / maxGuarComp) * 100
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
        cell: ({ row, table }) => {
            const club = row.original
            const allClubs = table.options.data as TableClub[]
            const widthPercent = getPayrollWidthPercent(club, allClubs)
            return (
                <div className="flex flex-col">
                    <Link href={`/clubs/${club.clubid}?year=${club.reportYear}`} className="font-medium hover:underline" prefetch={false}>
                        {club.clubName}
                    </Link>
                    <div className="mt-1 h-1 w-full max-w-24 rounded-full bg-muted md:hidden">
                        <div
                            className="h-1 rounded-full"
                            style={{ width: `${widthPercent}%`, backgroundColor: club.colorPrimary ?? "var(--primary)" }}
                        />
                    </div>
                </div>
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
    {
        id: "payroll",
        header: () => "Payroll",
        enableSorting: false,
        enableHiding: false,
        cell: ({ row, table }) => {
            const club = row.original
            const allClubs = table.options.data as TableClub[]
            const widthPercent = getPayrollWidthPercent(club, allClubs)
            return (
                <div className="w-full min-w-24">
                    <div className="h-1.5 w-full rounded-full bg-muted">
                        <div
                            className="h-1.5 rounded-full"
                            style={{ width: `${widthPercent}%`, backgroundColor: club.colorPrimary ?? "var(--primary)" }}
                        />
                    </div>
                </div>
            )
        }
    },
]
