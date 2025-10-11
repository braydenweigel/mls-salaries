"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Info } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

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
                <Link href={`/clubs/${club.clubid}?year=${club.reportYear}`} className="hover:underline">{club.clubName}</Link>
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
                Total Base Salary
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
          cell: ({ row }) => {
              const value = row.getValue<number>("totalBaseSal")
              return `$${value.toLocaleString()}`
          }
        
    },
    {
        accessorKey: "totalGuarComp",
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
              const value = row.getValue<number>("totalGuarComp")
              return `$${value.toLocaleString()}`
          }
        
    },
    
]