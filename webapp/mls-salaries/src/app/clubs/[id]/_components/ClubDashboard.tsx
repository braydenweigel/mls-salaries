"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ClubPlayersTable } from "./ClubPlayersTable"
import { clubPlayerColumns, TableClubPlayers } from "./clubPlayerTableColumns"
import ClubIDChart from "./chart"

interface Props {
    data: TableClubPlayers[]
    colors: { primary: string; secondary: string }
}

export default function ClubDashboard({ data, colors }: Props) {
    const [selectedPositions, setSelectedPositions] = React.useState<string[]>([])
    const [nameFilter, setNameFilter] = React.useState("")

    const filteredData = data
        .filter((player) => !selectedPositions.length || selectedPositions.includes(player.position))
        .filter((player) => player.name.toLowerCase().includes(nameFilter.toLowerCase()))

    const chartData = formatChartData(filteredData)

    return (
        <>
            <Card className="my-4">
                <CardContent className="overflow-hidden space-y-2">
                    <ClubPlayersTable
                        columns={clubPlayerColumns}
                        data={filteredData}
                        selectedPositions={selectedPositions}
                        onPositionsChange={setSelectedPositions}
                        nameFilter={nameFilter}
                        onNameFilterChange={setNameFilter}
                    />
                </CardContent>
            </Card>
            <Card className="hidden md:block">
                <CardContent className="overflow-hidden space-y-2">
                    <ClubIDChart data={chartData} colors={colors}/>
                </CardContent>
            </Card>
        </>
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
