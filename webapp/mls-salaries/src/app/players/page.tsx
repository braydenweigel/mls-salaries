"use client"

import { PlayerTable } from "@/components/lib/PlayerTable"
import { playerColumns, TablePlayer } from "@/components/lib/playerTableColumns"
import { Card, CardContent } from "@/components/ui/card"
import { makeSelectPlayerRecordsByYear } from "@/lib/store/playerRecordsSlice"
import { RootState } from "@/lib/store/store"
import { isValidClub } from "@/lib/storeUtils"
import { useSelector } from "react-redux"
import { CURRENT_YEAR, reports } from "@/lib/globals"
import React, { useEffect } from "react"
import SelectReport from "@/components/lib/SelectReport"
import { useSearchParams } from "next/navigation"

export default function Players() {
  const searchParams = useSearchParams()
  const reportParams = searchParams.get("year")
  const [reportValue, setReportValue] = React.useState(reports[reportParams ?? ""] && reportParams ? reportParams : CURRENT_YEAR)//report params used when params exist and are a valid year
  const year = reports[reportValue].year
  const season = reports[reportValue].season
  const defaultReport = reports[reportParams ?? ""] && reportParams ? reportParams : CURRENT_YEAR

  const selectPlayerRecordsByYear = makeSelectPlayerRecordsByYear(year, season);
  const playerRecords = useSelector(selectPlayerRecordsByYear)
  const allClubs = useSelector((state: RootState) => state.clubs.data)

  const data: TablePlayer[] = []

  useEffect(() => {
    document.title = year + " " + season + " Players - MLS Salaries"
  },[reportValue])

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

  return (
    <Card>
      <CardContent className="overflow-hidden">
        <SelectReport onReportValueChange={(report) => setReportValue(report)} reports={reports} defaultReport={defaultReport}/>
        <div>
          <PlayerTable columns={playerColumns} data={data} />
        </div>
      </CardContent>
    </Card>
  )
}
  