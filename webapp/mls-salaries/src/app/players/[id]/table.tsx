"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Club } from "@/lib/store/clubsSlice"
import { PlayerRecord } from "@/lib/store/playerRecordsSlice"
import Link from 'next/link'

interface Props {
    records: PlayerRecord[]
    playerClubs: Club[]
}

export default function PlayerIDTable({
    records,
    playerClubs
}: Props){
    
    return (
        <Table className="mx-auto px-4">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[120px]">Year</TableHead>
                    <TableHead>Club</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead className="text-right">Base Salary</TableHead>
                    <TableHead className="text-right">Guaranteed Comp</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
            {records.map((record, index) => (
                <TableRow key={record.id}>
                <TableCell>{record.recordyear}</TableCell>
                <TableCell><Link href={`/clubs/${record.club}`} className="hover:underline">{playerClubs[index].clubname}</Link></TableCell>
                <TableCell>{record.position}</TableCell>
                <TableCell className="text-right">
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