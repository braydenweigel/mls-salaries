"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

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

export const playerColumns: ColumnDef<TablePlayer>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const player = row.original
            return (
                <Link href={`/players/${player.id}`} className="hover:underline">{player.name}</Link>
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
            return <div className="text-left">{value.toLocaleString()}</div>
        }
        
    },
    {
        accessorKey: "baseSal",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className=""
            >
              Base Salary
              <ArrowUpDown/>
            </Button>
          )
        },
        cell: ({ row }) => {
            const value = row.getValue<number>("baseSal") ?? row.getValue<number>("guarComp")
            return <div className="text-right pr-8">${value.toLocaleString()}</div>
        }

    },
    {
        accessorKey: "guarComp",
        header: ({ column }) => {
          return (
            <div className="flex items-center">
                <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Guaranteed Comp
                    <ArrowUpDown/>
                </Button>
            </div>
          )
        },
        cell: ({ row }) => {
            const value = row.getValue<number>("guarComp")
            return <div className="text-right">${value.toLocaleString()}</div>
        }
    },
]