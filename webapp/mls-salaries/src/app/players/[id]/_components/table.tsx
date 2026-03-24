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
        <Table className="">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[120px]">Year</TableHead>
                    <TableHead className="">Club</TableHead>
                    <TableHead className="hidden md:table-cell">Position</TableHead>
                    <TableHead className="text-right hidden md:table-cell">Base Salary</TableHead>
                    <TableHead className="text-right">Guaranteed Comp</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
            {records.map((record, index) => (
                <TableRow key={record.id}>
                <TableCell className="table-cell md:hidden">{record.recordseason.slice(0,2) + " " + record.recordyear.slice(2,4)}</TableCell>
                <TableCell className="hidden md:table-cell">{record.recordseason + " " + record.recordyear}</TableCell>
                <TableCell><Link href={`/clubs/${record.club}?year=${(record.recordyear.toString()) + (record.recordseason == "Fall" ? ".5" : "")}`} className="hover:underline">{playerClubs[index].clubname}</Link></TableCell>
                <TableCell className="hidden md:table-cell">{record.position}</TableCell>
                <TableCell className="text-right hidden md:table-cell">
                    ${record.basesalary ? record.basesalary.toLocaleString() : record.guaranteedcomp.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                    ${record.guaranteedcomp.toLocaleString()}
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
    )
}