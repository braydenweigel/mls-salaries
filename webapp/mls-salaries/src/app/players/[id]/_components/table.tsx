import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Club, PlayerRecord } from "@/lib/data/types"
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
                    <TableHead className="w-[120px] px-0.5 md:px-2">Year</TableHead>
                    <TableHead className="px-0.5 md:px-2">Club</TableHead>
                    <TableHead className="hidden md:table-cell px-0.5 md:px-2">Position</TableHead>
                    <TableHead className="text-right hidden md:table-cell px-0.5 md:px-2">Base Salary</TableHead>
                    <TableHead className="text-right px-0.5 md:px-2">Guaranteed Comp</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
            {records.map((record, index) => (
                <TableRow key={record.id}>
                <TableCell className="table-cell md:hidden px-0.5 md:px-2">{record.recordseason + " " + record.recordyear.slice(2,4)}</TableCell>
                <TableCell className="hidden md:table-cell px-0.5 md:px-2">{record.recordseason + " " + record.recordyear}</TableCell>
                <TableCell className="table-cell md:hidden px-0.5 md:px-2"><Link href={`/clubs/${record.club}?year=${(record.recordyear.toString()) + (record.recordseason == "Fall" ? ".5" : "")}`} className="hover:underline">{record.club}</Link></TableCell>
                <TableCell className="hidden md:table-cell px-0.5 md:px-2"><Link href={`/clubs/${record.club}?year=${(record.recordyear.toString()) + (record.recordseason == "Fall" ? ".5" : "")}`} className="hover:underline">{playerClubs[index].clubname}</Link></TableCell>
                <TableCell className="hidden md:table-cell px-0.5 md:px-2">{record.position}</TableCell>
                <TableCell className="text-right hidden md:table-cell px-0.5 md:px-2">
                    ${record.basesalary ? record.basesalary.toLocaleString() : record.guaranteedcomp.toLocaleString()}
                </TableCell>
                <TableCell className="text-right px-0.5 md:px-2">
                    ${record.guaranteedcomp.toLocaleString()}
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
    )
}