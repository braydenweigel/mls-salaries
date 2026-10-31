import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Club, PlayerRecord } from "@/lib/data/types"
import { POSITION_LABELS } from "@/lib/globals"
import Link from 'next/link'
import React from "react"

interface Props {
    records: PlayerRecord[]
    playerClubs: Club[]
}

export default function PlayerIDTable({
    records,
    playerClubs
}: Props){
    return (
        <Table className="text-xs md:text-sm">
            <TableHeader>
                <TableRow>
                    <TableHead className="sticky top-0 z-10 w-[120px] px-0.5 md:px-2">Year</TableHead>
                    <TableHead className="sticky top-0 z-10 hidden md:table-cell px-0.5 md:px-2">Club</TableHead>
                    <TableHead className="sticky top-0 z-10 hidden md:table-cell px-0.5 md:px-2">Position</TableHead>
                    <TableHead className="sticky top-0 z-10 text-right hidden md:table-cell px-0.5 md:px-2">Base Salary</TableHead>
                    <TableHead className="sticky top-0 z-10 text-right px-0.5 md:px-2">Guaranteed Comp</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
            {records.map((record, index) => {
                const positionLabel = POSITION_LABELS[record.position] ?? record.position
                const clubHref = `/clubs/${record.club}?year=${record.recordyear.toString() + (record.recordseason == "Fall" ? ".5" : "")}`
                const baseSal = record.basesalary ? record.basesalary : record.guaranteedcomp

                return (
                <TableRow key={record.id}>
                <TableCell className="px-0.5 py-3 md:px-2 md:py-2 whitespace-normal">
                    <div className="flex flex-col md:hidden min-w-0">
                        <span className="font-medium">{record.recordseason} {record.recordyear}</span>
                        <span className="text-xs text-muted-foreground truncate">{playerClubs[index].clubname} · {positionLabel}</span>
                    </div>
                    <span className="hidden md:inline">{record.recordseason} {record.recordyear}</span>
                </TableCell>
                <TableCell className="hidden md:table-cell px-0.5 md:px-2"><Link href={clubHref} className="hover:underline">{playerClubs[index].clubname}</Link></TableCell>
                <TableCell className="hidden md:table-cell px-0.5 md:px-2"><Badge variant="outline">{positionLabel}</Badge></TableCell>
                <TableCell className="text-right hidden md:table-cell px-0.5 md:px-2">
                    ${baseSal.toLocaleString()}
                </TableCell>
                <TableCell className="text-right px-0.5 py-3 md:px-2 md:py-2">
                    <div className="flex flex-col items-end">
                        <span className="font-semibold">${record.guaranteedcomp.toLocaleString()}</span>
                        <span className="md:hidden text-xs text-muted-foreground">Base ${baseSal.toLocaleString()}</span>
                    </div>
                </TableCell>
                </TableRow>
                )
            })}
            </TableBody>
        </Table>
    )
}
