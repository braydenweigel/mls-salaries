"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn, formatCompactCurrency } from "@/lib/utils"

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
        <Card className="my-4 border-0 shadow-none bg-transparent py-0 sm:border sm:shadow-sm sm:bg-card sm:py-6">
            <CardHeader className="px-0 sm:px-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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
            <CardContent className="px-0 sm:px-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Report</TableHead>
                            <TableHead className="text-right">Average</TableHead>
                            <TableHead className="text-right">Median</TableHead>
                            <TableHead className="text-right">Total</TableHead>
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
                                        <Link href={`/reports/${row.reportKey}`} className="hover:underline">{row.year} {row.season}</Link>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="sm:hidden">{formatCompactCurrency(Math.round(avg))}</span>
                                        <span className="hidden sm:inline">${Math.round(avg).toLocaleString()}</span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="sm:hidden">{formatCompactCurrency(Math.round(med))}</span>
                                        <span className="hidden sm:inline">${Math.round(med).toLocaleString()}</span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="sm:hidden">{formatCompactCurrency(Math.round(total))}</span>
                                        <span className="hidden sm:inline">${Math.round(total).toLocaleString()}</span>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
