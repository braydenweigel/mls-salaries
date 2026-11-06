"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

type Metric = "guarComp" | "baseSal"

const METRIC_OPTIONS: { value: Metric; label: string; shortLabel: string }[] = [
    { value: "guarComp", label: "Guaranteed comp.", shortLabel: "Guaranteed" },
    { value: "baseSal", label: "Base salary", shortLabel: "Base" },
]

export type LeagueSalaryRow = {
    reportKey: string
    year: string
    season: string
    totalBase: number
    totalGuar: number
    avgBase: number
    avgGuar: number
    medianBase: number
    medianGuar: number
}

interface Props {
    rows: LeagueSalaryRow[]
}

export default function LeagueSalaryTable({ rows }: Props){
    const [metric, setMetric] = useState<Metric>("guarComp")

    return (
        <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <CardTitle className="text-xl">Total league salary spend by report</CardTitle>
                    <CardDescription>
                        {metric === "guarComp" ? "Guaranteed compensation" : "Base salary"} across all MLS clubs, per report
                    </CardDescription>
                </div>
                <div className="flex items-center gap-1 rounded-md bg-muted p-1 shrink-0">
                    {METRIC_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setMetric(option.value)}
                            className={cn(
                                "rounded-sm px-3 py-1.5 text-xs font-medium transition-colors",
                                metric === option.value ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <span className="hidden sm:inline">{option.label}</span>
                            <span className="sm:hidden">{option.shortLabel}</span>
                        </button>
                    ))}
                </div>
            </CardHeader>
            <CardContent>
                <div className="max-h-[70vh] overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="sticky top-0 z-10 bg-card">Report</TableHead>
                                <TableHead className="sticky top-0 z-10 bg-card text-right hidden md:table-cell">Average</TableHead>
                                <TableHead className="sticky top-0 z-10 bg-card text-right hidden md:table-cell">Median</TableHead>
                                <TableHead className="sticky top-0 z-10 bg-card text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((row) => {
                                const total = metric === "guarComp" ? row.totalGuar : row.totalBase
                                const avg = metric === "guarComp" ? row.avgGuar : row.avgBase
                                const med = metric === "guarComp" ? row.medianGuar : row.medianBase

                                return (
                                    <TableRow key={row.reportKey}>
                                        <TableCell>
                                            <Link href={`/clubs?year=${row.reportKey}`} className="hover:underline">{row.year} {row.season}</Link>
                                        </TableCell>
                                        <TableCell className="text-right hidden md:table-cell">${Math.round(avg).toLocaleString()}</TableCell>
                                        <TableCell className="text-right hidden md:table-cell">${Math.round(med).toLocaleString()}</TableCell>
                                        <TableCell className="text-right">${Math.round(total).toLocaleString()}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
