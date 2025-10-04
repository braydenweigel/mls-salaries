"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export type TablePlayer = {
    id: string;
    name: string;
    club: string;
    clubid: string;
    position: string;
    baseSal: number;
    guarComp: number;
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
                <Link href={`/clubs/${player.clubid}`} className="hover:underline">{player.club}</Link>
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
        }
    },
    {
        accessorKey: "baseSal",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Base Salary
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
            const value = row.getValue<number>("baseSal")
            return `$${value.toLocaleString()}`
        }

    },
    {
        accessorKey: "guarComp",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Guaranteed Comp
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
            const value = row.getValue<number>("guarComp")
            return `$${value.toLocaleString()}`
        }
    },
]