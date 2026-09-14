"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import Link from "next/link"
import { Button } from "../../../components/ui/button"

export type TableClub = {
    clubName: string;
    clubid: string;
    totalBaseSal: number;
    totalGuarComp: number;
    reportYear: string;
}

export const clubColumns: ColumnDef<TableClub>[] = [
    {
        accessorKey: "clubName",
        header: "Club",
        cell: ({ row }) => {
            const club = row.original
            return (
                <Link href={`/clubs/${club.clubid}?year=${club.reportYear}`} className="hover:underline" prefetch={false}>{club.clubName}</Link>
            )
        },
    },
    {
        accessorKey: "totalBaseSal",
        header: ({ column }) => {
            return (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-1 md:px-3 text-xs md:text-sm"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  Base Salary
                  <ArrowUpDown className="hidden size-4 md:inline" />
                </Button>
              </div>
            )
          },
          cell: ({ row }) => {
              const value = row.getValue<number>("totalBaseSal")
              return <div className="text-right">${value.toLocaleString()}</div>
          }

    },
    {
        accessorKey: "totalGuarComp",
        header: ({ column }) => {
            return (
              <div className="flex justify-end">
                <Button
                variant="ghost"
                size="sm"
                className="px-1 md:px-3 text-xs md:text-sm"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  Guaranteed Comp
                  <ArrowUpDown className="hidden size-4 md:inline" />
              </Button>
            </div>
            )
          },
          cell: ({ row }) => {
              const value = row.getValue<number>("totalGuarComp")
              return <div className="text-right">${value.toLocaleString()}</div>
          }

    },
    
]