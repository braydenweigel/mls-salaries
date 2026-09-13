"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClubFilter } from "@/components/lib/ClubFilter"
import { ClubTable } from "./ClubTable"
import { clubColumns, TableClub } from "./clubTableColumns"
import ClubsBarChart from "./ClubsBarChart"
import ClubsSelectReport from "./ClubsSelectReport"

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
        <div>
            <Card className="mb-4">
                <CardContent className="overflow-hidden space-y-2">
                    <ClubsSelectReport reports={reports} defaultReport={reportValue}/>
                    <div className="flex items-center w-full py-4 justify-between">
                        <div className="flex items-center space-x-4">
                            <ClubFilter value={selectedClubs} onChange={setSelectedClubs} clubs={clubNames} />
                        </div>
                    </div>
                    <ClubTable columns={clubColumns} data={filteredData}/>
                    <div className="flex justify-between w-full space-x-2 py-4">
                        <Button variant="destructive" size="sm" onClick={() => setSelectedClubs([])}>Reset</Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="hidden md:block">
                <CardHeader>
                    <CardTitle className="text-xl">Club payroll comparison</CardTitle>
                    <CardDescription>Base salary and guaranteed compensation by club, {year} {season}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ClubsBarChart data={chartData} />
                </CardContent>
            </Card>
        </div>
    )
}
