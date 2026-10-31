"use client"

import { Column, ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { POSITION_LABELS } from "@/lib/globals";

export type TablePlayer = {
    id: string;
    name: string;
    club: string;
    clubid: string;
    position: string;
    baseSal: number;
    guarComp: number;
    reportYear: string;
}

function getInitials(name: string){
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return ""
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function SortableHeader({ column, label, mobileLabel }: { column: Column<TablePlayer, unknown>, label: string, mobileLabel?: string }){
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

export const playerColumns: ColumnDef<TablePlayer>[] = [
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
        accessorKey: "name",
        header: () => (
            <>
                <span className="md:hidden">Player · Club</span>
                <span className="hidden md:inline">Player</span>
            </>
        ),
        enableHiding: false,
        cell: ({ row }) => {
            const player = row.original
            const positionLabel = POSITION_LABELS[player.position] ?? player.position
            return (
                <Link href={`/players/${player.id}`} className="flex items-center gap-2.5 group min-w-0" prefetch={false}>
                    <span className="hidden md:flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                        {getInitials(player.name)}
                    </span>
                    <span className="flex flex-col min-w-0">
                        <span className="font-medium group-hover:underline truncate">{player.name}</span>
                        <span className="md:hidden text-xs text-muted-foreground truncate">{player.club} · {positionLabel}</span>
                    </span>
                </Link>
            )

        }

    },
    {
        accessorKey: "club",
        header: "Club",
        cell: ({ row }) => {
            const player = row.original
            return (
                <Link href={`/clubs/${player.clubid}?year=${player.reportYear}`} className="hover:underline" prefetch={false}>{player.club}</Link>
            )
        },
        filterFn: (row, club, filterValue: string[]) => {
            if (!filterValue?.length) return true
            return filterValue.includes(row.getValue(club))
        }
    },
    {
        accessorKey: "position",
        header: "Position",
        filterFn: (row, position, filterValue: string[]) => {
            if (!filterValue?.length) return true
            return filterValue.includes(row.getValue(position))
        },
        cell: ({ row }) => {
            const value = row.getValue<string>("position")
            return <Badge variant="outline">{POSITION_LABELS[value] ?? value}</Badge>
        }

    },
    {
        accessorKey: "baseSal",
        header: ({ column }) => <SortableHeader column={column} label="Base salary"/>,
        cell: ({ row }) => {
            const value = row.getValue<number>("baseSal") ?? row.getValue<number>("guarComp")
            return <div className="text-right">${value.toLocaleString()}</div>
        }

    },
    {
        accessorKey: "guarComp",
        header: ({ column }) => <SortableHeader column={column} label="Guaranteed comp." mobileLabel="Guaranteed"/>,
        cell: ({ row }) => {
            const value = row.getValue<number>("guarComp")
            const baseSal = row.original.baseSal ?? value
            return (
                <div className="flex flex-col items-end">
                    <span className="font-semibold">${value.toLocaleString()}</span>
                    <span className="md:hidden text-xs text-muted-foreground">Base ${baseSal.toLocaleString()}</span>
                </div>
            )
        }
    },
]
