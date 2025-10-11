"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export type TableClubPlayers = {
    id: string;
    name: string;
    position: string;
    baseSal: number;
    guarComp: number;
    reportYear: string;
}

export const clubPlayerColumns: ColumnDef<TableClubPlayers>[] = [
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
            const backup = row.getValue<number>("guarComp")
            return `$${(value ?? backup).toLocaleString()}`
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