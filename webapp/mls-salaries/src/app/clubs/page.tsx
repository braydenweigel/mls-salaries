"use client"

import SelectReport from "@/components/lib/SelectReport"
import { Card, CardContent } from "@/components/ui/card"
import { reports, clubs as clubsObject, CURRENT_YEAR} from "@/lib/globals"
import React, { useEffect } from "react"
import { clubColumns, TableClub} from "@/app/clubs/_components/clubTableColumns"
import { ClubTable } from "./_components/ClubTable"
import { useRouter, useSearchParams } from "next/navigation"
import { filterRecordsByReport } from "@/lib/data/filters"
import { PlayerRecord } from "@/lib/data/types"
import records from "@/lib/data/records.json"

export default function Clubs() {
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const reportParams = searchParams.get("year")

  const [reportValue, setReportValue] = React.useState(reports[reportParams ?? ""] && reportParams ? reportParams : CURRENT_YEAR)//report params used when params exist and are a valid year
  const year = reports[reportValue].year
  const season = reports[reportValue].season
  const defaultReport = reports[reportParams ?? ""] && reportParams ? reportParams : CURRENT_YEAR

  useEffect(() => {
    document.title = year + " " + season + " Clubs - MLS Salaries"
    replace(`/clubs?year=${reportValue}`)
  },[reportValue, replace, year, season])

  //get player records for report and get blank clubs object
  const playerRecords = filterRecordsByReport((records as PlayerRecord[]), year, season)
  const clubs = structuredClone(clubsObject)

  //calculate totals for clubs
  for (const record of playerRecords){
    clubs[record.club].totalBaseSal += record.basesalary
    clubs[record.club].totalGuarComp += record.guaranteedcomp
  }

  //format data
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

function createTableData(clubs: typeof clubsObject, reportValue: string){
  const data: TableClub[] = []

  console.log("Report Value: ", reportValue)
  Object.entries(clubs).forEach(([key, club]) => {
    if (Number(reports[reportValue].year) >= club.yearFirst) {
      if (key == "SJ" && reportValue == "2007.5"){

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