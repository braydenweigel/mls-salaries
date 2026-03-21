"use client"

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
    const isMobile = useIsMobile()
    
    return (
        <Table className="mx-auto px-4">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[120px]">Year</TableHead>
                    <TableHead>Club</TableHead>
                    {isMobile ? null : <TableHead>Position</TableHead>}
                    {isMobile ? null : <TableHead className="text-right">Base Salary</TableHead>}
                    <TableHead className="text-right">Guaranteed Comp</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
            {records.map((record, index) => (
                <TableRow key={record.id}>
                <TableCell>{record.recordyear}</TableCell>
                <TableCell><Link href={`/clubs/${record.club}?year=${(record.recordyear.toString()) + (record.recordseason == "Fall" ? ".5" : "")}`} className="hover:underline">{playerClubs[index].clubname}</Link></TableCell>
                {isMobile ? null : <TableCell>{record.position}</TableCell>}
                {isMobile ? null : <TableCell className="text-right">
                    ${record.basesalary ? record.basesalary.toLocaleString() : record.guaranteedcomp.toLocaleString()}
                </TableCell>}
                <TableCell className="text-right">
                    ${record.guaranteedcomp.toLocaleString()}
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
    )
}

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    setIsMobile(media.matches);

    const listener = () => setIsMobile(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  return isMobile;
}