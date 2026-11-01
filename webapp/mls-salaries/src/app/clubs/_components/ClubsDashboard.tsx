"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClubFilter } from "@/components/lib/ClubFilter"
import { ClubTable } from "./ClubTable"
import { clubColumns, TableClub } from "./clubTableColumns"
import ClubsBarChart from "./ClubsBarChart"
import ClubsSelectReport from "./ClubsSelectReport"
import Link from "next/link"
import { ArrowLeftRight, Download, Shuffle } from "lucide-react"

interface Props {
    data: TableClub[]
    reports: Record<string, { year: string; season: string }>
    reportValue: string
    year: string
    season: string
}

export default function ClubsDashboard({
    data,
    reports,
    reportValue,
    year,
    season
}: Props) {
    const [selectedClubs, setSelectedClubs] = React.useState<string[]>([])

    const clubNames = [...new Set(data.map((club) => club.clubName))]

    const filteredData = selectedClubs.length
        ? data.filter((club) => selectedClubs.includes(club.clubName))
        : data

    const chartData = filteredData
        .map((club) => ({
            clubName: club.clubName,
            baseSal: club.totalBaseSal,
            guarComp: club.totalGuarComp - club.totalBaseSal,
        }))
        .toReversed()

    return (
        <div className="flex flex-col gap-4 min-h-0">
            <div className="hidden shrink-0 md:flex items-center gap-1.5 text-sm text-muted-foreground">
                <Link href="/" className="hover:underline">Home</Link>
                <span>/</span>
                <span className="text-foreground">Clubs</span>
            </div>
            <div className="shrink-0 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Club payrolls</h1>
                    <p className="hidden md:block text-sm text-muted-foreground mt-1">
                        Total base salary and guaranteed compensation by club, {year} {season} release.
                    </p>
                </div>
                <div className="hidden md:flex items-center gap-2 shrink-0">
                    <Button variant="outline" className="text-xs md:text-sm">
                        <Download className="size-4"/>
                        Export CSV
                    </Button>
                    <Button asChild className="text-xs md:text-sm">
                        <Link href="/clubs/compare">
                            <ArrowLeftRight className="size-4"/>
                            Compare Clubs
                        </Link>
                    </Button>
                </div>
            </div>
            <Card className="min-h-0 border-0 shadow-none bg-transparent py-0 gap-0 md:border md:shadow-sm md:bg-card md:py-6">
                <CardContent className="min-h-0 flex flex-col overflow-hidden px-0 md:px-6">
                    <ClubTable
                        columns={clubColumns}
                        data={filteredData}
                        reportSelector={<ClubsSelectReport reports={reports} defaultReport={reportValue}/>}
                        filters={<ClubFilter value={selectedClubs} onChange={setSelectedClubs} clubs={clubNames}/>}
                    />
                </CardContent>
            </Card>
            <Card className="hidden md:block">
                <CardContent>
                    <ClubsBarChart data={chartData}/>
                </CardContent>
            </Card>
        </div>
    )
}
