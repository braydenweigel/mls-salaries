"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn, formatCompactCurrency } from "@/lib/utils"

type Metric = "guarComp" | "baseSal"

const METRIC_OPTIONS: { value: Metric; label: string; shortLabel: string }[] = [
    { value: "guarComp", label: "Guaranteed comp.", shortLabel: "Guaranteed" },
    { value: "baseSal", label: "Base salary", shortLabel: "Base" },
]

export type PositionRow = {
    key: string
    label: string
    players: number
    totalGuar: number
    totalBase: number
    avgGuar: number
    avgBase: number
    medianGuar: number
    medianBase: number
}

interface Props {
    rows: PositionRow[]
    allPositions: PositionRow
}

function CurrencyCell({ value }: { value: number }){
    const rounded = Math.round(value)
    return (
        <>
            <span className="sm:hidden">{formatCompactCurrency(rounded)}</span>
            <span className="hidden sm:inline">${rounded.toLocaleString()}</span>
        </>
    )
}

export default function ReportPositionTable({ rows, allPositions }: Props){
    const [metric, setMetric] = useState<Metric>("guarComp")

    const valueFor = (row: PositionRow, field: "total" | "avg" | "median") => {
        if (metric === "guarComp"){
            return field === "total" ? row.totalGuar : field === "avg" ? row.avgGuar : row.medianGuar
        }
        return field === "total" ? row.totalBase : field === "avg" ? row.avgBase : row.medianBase
    }

    return (
        <Card className="my-4 border-0 shadow-none bg-transparent py-0 sm:border sm:shadow-sm sm:bg-card sm:py-6">
            <CardHeader className="px-0 sm:px-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <CardTitle className="text-xl">By position</CardTitle>
                    <CardDescription>Totals, averages and medians for each position in this release.</CardDescription>
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
                <Table className="text-xs sm:text-sm">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="px-1 sm:px-2">Position</TableHead>
                            <TableHead className="text-right px-1 sm:px-2">
                                <span className="sm:hidden">#</span>
                                <span className="hidden sm:inline">Players</span>
                            </TableHead>
                            <TableHead className="text-right px-1 sm:px-2">Total</TableHead>
                            <TableHead className="text-right px-1 sm:px-2">
                                <span className="sm:hidden">Avg</span>
                                <span className="hidden sm:inline">Average</span>
                            </TableHead>
                            <TableHead className="text-right px-1 sm:px-2">
                                <span className="sm:hidden">Med</span>
                                <span className="hidden sm:inline">Median</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.key}>
                                <TableCell className="px-1 sm:px-2">
                                    <div className="flex items-center gap-2">
                                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md bg-muted px-1 text-[10px] font-semibold">
                                            {row.key}
                                        </span>
                                        <span className="hidden sm:inline">{row.label}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right px-1 sm:px-2">{row.players}</TableCell>
                                <TableCell className="text-right px-1 sm:px-2"><CurrencyCell value={valueFor(row, "total")}/></TableCell>
                                <TableCell className="text-right px-1 sm:px-2"><CurrencyCell value={valueFor(row, "avg")}/></TableCell>
                                <TableCell className="text-right px-1 sm:px-2"><CurrencyCell value={valueFor(row, "median")}/></TableCell>
                            </TableRow>
                        ))}
                        <TableRow className="bg-muted/50 font-semibold">
                            <TableCell className="px-1 sm:px-2">
                                <span className="sm:hidden">All</span>
                                <span className="hidden sm:inline">All positions</span>
                            </TableCell>
                            <TableCell className="text-right px-1 sm:px-2">{allPositions.players}</TableCell>
                            <TableCell className="text-right px-1 sm:px-2"><CurrencyCell value={valueFor(allPositions, "total")}/></TableCell>
                            <TableCell className="text-right px-1 sm:px-2"><CurrencyCell value={valueFor(allPositions, "avg")}/></TableCell>
                            <TableCell className="text-right px-1 sm:px-2"><CurrencyCell value={valueFor(allPositions, "median")}/></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
