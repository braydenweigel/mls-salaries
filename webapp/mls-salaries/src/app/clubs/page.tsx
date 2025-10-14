"use client"

import SelectReport from "@/components/lib/SelectReport"
import { Card, CardContent } from "@/components/ui/card"
import { reports, clubs as clubsObject, CURRENT_YEAR} from "@/lib/globals"
import { makeSelectPlayerRecordsByYear } from "@/lib/store/playerRecordsSlice"
import React from "react"
import { useSelector } from "react-redux"
import { clubColumns, TableClub} from "@/components/lib/clubTableColumns"
import { ClubTable } from "@/components/lib/ClubTable"
import { useSearchParams } from "next/navigation"

function createTableData(clubs: typeof clubsObject, reportValue: string){
  const data: TableClub[] = []

  console.log("Report Value: ", reportValue)
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
          reportYear: reportValue
        })
      }
    }
  })

  return data
}

export default function Clubs() {
  const searchParams = useSearchParams()
  const reportParams = searchParams.get("year")
  const [reportValue, setReportValue] = React.useState(reports[reportParams ?? ""] && reportParams ? reportParams : CURRENT_YEAR)//report params used when params exist and are a valid year
  const year = reports[reportValue].year
  const season = reports[reportValue].season
  const defaultReport = reports[reportParams ?? ""] && reportParams ? reportParams : CURRENT_YEAR
  

  const selectPlayerRecordsByYear = makeSelectPlayerRecordsByYear(year, season);
  const playerRecords = useSelector(selectPlayerRecordsByYear)

  const clubs = structuredClone(clubsObject)

  for (const record of playerRecords){
    clubs[record.club].totalBaseSal += record.basesalary
    clubs[record.club].totalGuarComp += record.guaranteedcomp
  }

  const data: TableClub[] = createTableData(clubs, reportValue)
  data.sort((a,b) => b.totalGuarComp - a.totalGuarComp)

    return (
      <Card>
        <CardContent className="overflow-hidden">
          <SelectReport onReportValueChange={(report) => setReportValue(report)} reports={reports} defaultReport={defaultReport}/>
          <div>
          <ClubTable columns={clubColumns} data={data}/>
          </div>
        </CardContent>
    </Card>
    );
  }