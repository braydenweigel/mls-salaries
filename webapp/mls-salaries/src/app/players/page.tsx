"use client"

import { PlayerTable } from "@/components/lib/PlayerTable"
import { playerColumns, TablePlayer } from "@/components/lib/playerTableColumns"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { makeSelectPlayerRecordsByYear } from "@/lib/store/playerRecordsSlice"
import { RootState } from "@/lib/store/store"
import { isValidClub } from "@/lib/storeUtils"
import { useSelector } from "react-redux"
import { reports } from "@/lib/dicts"
import React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Players() {
  const [reportValue, setReportValue] = React.useState("2025")
  const year = reports[reportValue].year
  const season = reports[reportValue].season

  const selectPlayerRecordsByPlayerId = makeSelectPlayerRecordsByYear(year, season);
  const playerRecords = useSelector(selectPlayerRecordsByPlayerId)
  const allClubs = useSelector((state: RootState) => state.clubs.data)

  let data: TablePlayer[] = []

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
      guarComp: record.guaranteedcomp
    })
  }

  return (
    <Card>
      <CardContent className="overflow-hidden">
        <Select defaultValue={"2025"} onValueChange={(value) => setReportValue(value)} >
          <SelectTrigger className="w-[180px]">
            <SelectValue/>
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            {Object.entries(reports)
              .sort((a, b) => Number(b[0]) - Number(a[0]))
              .map(([key, report]) => (
              <SelectItem key={key} value={key}>
                {report.year} {report.season}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div>
          <PlayerTable columns={playerColumns} data={data} />
        </div>
      </CardContent>

    </Card>
    
  )
}
  