"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ClubPlayersTable } from "./ClubPlayersTable"
import { clubPlayerColumns, TableClubPlayers } from "./clubPlayerTableColumns"
import ClubIDChart from "./chart"
import ClubSelectReport from "./ClubSelectReport"

interface Props {
    data: TableClubPlayers[]
    colors: { primary: string; secondary: string }
    totalBaseSal: number
    totalGuarComp: number
    reports: Record<string, { year: string; season: string }>
    reportValue: string
    clubId: string
}

export default function ClubDashboard({
    data,
    colors,
    totalBaseSal,
    totalGuarComp,
    reports,
    reportValue,
    clubId
}: Props) {
    const chartData = formatChartData(data)

    return (
        <div className="flex flex-col gap-4 min-h-0">
            <Card className="min-h-0 border-0 shadow-none bg-transparent py-0 gap-0 md:border md:shadow-sm md:bg-card md:py-6">
                <CardContent className="min-h-0 flex flex-col overflow-hidden px-0 md:px-6">
                    <ClubPlayersTable
                        columns={clubPlayerColumns}
                        data={data}
                        reportSelector={<ClubSelectReport reports={reports} defaultReport={reportValue} clubId={clubId}/>}
                        totalBaseSal={totalBaseSal}
                        totalGuarComp={totalGuarComp}
                        accentColor={colors.primary}
                        exportFilename={`${clubId}-roster-${reportValue}.csv`}
                    />
                </CardContent>
            </Card>
            <Card className="hidden md:block">
                <CardContent className="overflow-hidden space-y-2">
                    <ClubIDChart data={chartData} colors={colors}/>
                </CardContent>
            </Card>
        </div>
    )
}

function formatChartData(data: TableClubPlayers[]){
    const chartData = structuredClone(data).reverse()

    for (const record of chartData){
        let bS = 0
        let gC = 0

        if (!record.baseSal){
            bS = record.guarComp ?? 0
        } else {
            bS = record.baseSal
            gC = record.guarComp - record.baseSal
        }

        record.baseSal = bS
        record.guarComp = gC
    }

    return chartData
}
