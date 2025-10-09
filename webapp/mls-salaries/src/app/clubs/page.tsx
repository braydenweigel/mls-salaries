"use client"

import SelectReport from "@/components/lib/SelectReport"
import { Card, CardContent } from "@/components/ui/card"
import { reports, clubs as clubsObject} from "@/lib/dicts"
import { makeSelectPlayerRecordsByYear } from "@/lib/store/playerRecordsSlice"
import { RootState } from "@/lib/store/store"
import React from "react"
import { useSelector } from "react-redux"
import { clubColumns, TableClub} from "@/components/lib/clubTableColumns"
import { isValidClub } from "@/lib/storeUtils"
import { ClubTable } from "@/components/lib/ClubTable"
import { report } from "process"

function createTableData(clubs: typeof clubsObject, reportValue: string){
  let data: TableClub[] = []

  Object.entries(clubs).forEach(([key, club]) => {
    if (Number(reports[reportValue].year) >= club.yearFirst) {
      if (key == "SJ" && reportValue == "2007"){

      } else if (key == "CHV" && Number(reports[reportValue].year) > 2014) {

      } else {
        data.push({
          clubid: key,
          clubName: club.clubName,
          totalBaseSal: club.totalBaseSal,
          totalGuarComp: club.totalGuarComp,
        })
      }
    }
  })

  return data
}

export default function Clubs() {
  const [reportValue, setReportValue] = React.useState("2025")
  const year = reports[reportValue].year
  const season = reports[reportValue].season

  const selectPlayerRecordsByYear = makeSelectPlayerRecordsByYear(year, season);
  const playerRecords = useSelector(selectPlayerRecordsByYear)

  let clubs = structuredClone(clubsObject)

  for (const record of playerRecords){
    clubs[record.club].totalBaseSal += record.basesalary
    clubs[record.club].totalGuarComp += record.guaranteedcomp
  }

  const data: TableClub[] = createTableData(clubs, reportValue)

    return (
      <Card>
        <CardContent className="overflow-hidden">
          <SelectReport onReportValueChange={(report) => setReportValue(report)} reports={reports} defaultReport={"2025"}/>
          <div>
          <ClubTable columns={clubColumns} data={data} />
          </div>
        </CardContent>
    </Card>
    );
  }