"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

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
                <Link href={`/clubs/${player.clubid}?year=${player.reportYear}`} className="hover:underline">{player.club}</Link>
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
            <div className="flex items-center">
              <Tooltip>
                <TooltipTrigger>
                  < Info className="mr-1 h-4 w-4"/>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Base Salary plus annualized signing</p><p>and guaranteed bonuses.</p>
                </TooltipContent>
              </Tooltip>
              <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Guaranteed Comp
                <ArrowUpDown className="ml-1 h-4 w-4" />
            </Button>
            </div>
          )
        },
        cell: ({ row }) => {
            const value = row.getValue<number>("guarComp")
            return `$${value.toLocaleString()}`
        }
    },
]