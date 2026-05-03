import { PlayerTable } from "./_components/PlayerTable"
import { playerColumns, TablePlayer } from "@/app/players/_components/playerTableColumns"
import { Card, CardContent } from "@/components/ui/card"
import { isValidClub } from "@/lib/storeUtils"
import { CURRENT_YEAR, reports } from "@/lib/globals"
import React, { useEffect } from "react"
import records from "@/lib/data/records.json"
import clubs from "@/lib/data/clubs.json"
import type { PlayerRecord, Club } from "@/lib/data/types"
import { filterRecordsByReport } from "@/lib/data/filters"
import PlayersSelectReport from "./_components/PlayersSelectReport"

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ year?: string }> })  {
  const { year: report } = await searchParams

  const year = reports[report ?? CURRENT_YEAR].year
  const season = reports[report ?? CURRENT_YEAR].season

  return {
    title: `${year} ${season} Players - MLS Salaries`,
  }
}

export default async function Players({ searchParams }: { searchParams: Promise<{ year?: string }> }) {
  const { year: report } = await searchParams
  let reportParams = report

  const defaultReport = reports[reportParams ?? ""] && reportParams ? reportParams : CURRENT_YEAR
  const reportValue = reportParams ?? defaultReport

  const year = reports[reportValue].year
  const season = reports[reportValue].season

  const playerRecords = filterRecordsByReport((records as PlayerRecord[]), year, season)
  const allClubs = clubs as Club[]
  const data: TablePlayer[] = setTableData(playerRecords, allClubs, reportValue)

  return (
    <Card className="h-fit">
      <CardContent className="">
        <PlayersSelectReport reports={reports} defaultReport={reportValue}/>
        <div>
          <PlayerTable columns={playerColumns} data={data} />
        </div>
      </CardContent>
    </Card>
  )
}

function setTableData(playerRecords: PlayerRecord[], allClubs: Club[], reportValue: string){
  const data: TablePlayer[] = []

  for (const record of playerRecords){
    let name = ""
    if (!record.firstname){
      name = record.lastname
    } else if (!record.lastname){
      name = record.firstname
    } else {
      name = record.firstname + " " + record.lastname
    }

    const club = isValidClub(allClubs, record.club)

    data.push({
      id: record.playerid,
      name: name,
      club: club ? club.clubname : "",
      clubid: record.club,
      position: record.position,
      baseSal: record.basesalary,
      guarComp: record.guaranteedcomp,
      reportYear: reportValue
    })
  }

  data.sort((a,b) => b.guarComp - a.guarComp)

  return data
}
  