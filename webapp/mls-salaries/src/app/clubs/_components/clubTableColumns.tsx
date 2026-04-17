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
        filterFn: (row, club, filterValue: string[]) => {
            if (!filterValue?.length) return true
            return filterValue.includes(row.getValue(club))
        }
        
    },
    {
        accessorKey: "totalBaseSal",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Base Salary
                <ArrowUpDown />
              </Button>
            )
          },
          cell: ({ row }) => {
              const value = row.getValue<number>("totalBaseSal")
              return <div className="pl-8">${value.toLocaleString()}</div>
          }
        
    },
    {
        accessorKey: "totalGuarComp",
        header: ({ column }) => {
            return (
              <div className="flex items-center">
                <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  Guaranteed Comp
                  <ArrowUpDown />
              </Button>
            </div>
            )
          },
          cell: ({ row }) => {
              const value = row.getValue<number>("totalGuarComp")
              return <div className="pl-8">${value.toLocaleString()}</div>
          }
        
    },
    
]