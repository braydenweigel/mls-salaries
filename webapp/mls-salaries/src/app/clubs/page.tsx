"use client"

import SelectReport from "@/components/lib/SelectReport"
import { Card, CardContent } from "@/components/ui/card"
import { reports, clubs } from "@/lib/dicts"
import { makeSelectPlayerRecordsByYear } from "@/lib/store/playerRecordsSlice"
import { RootState } from "@/lib/store/store"
import React from "react"
import { useSelector } from "react-redux"
import { clubColumns, TableClub} from "@/components/lib/clubTableColumns"
import { isValidClub } from "@/lib/storeUtils"
import { ClubTable } from "@/components/lib/ClubTable"

export default function Clubs() {
  const [reportValue, setReportValue] = React.useState("2025")
  const year = reports[reportValue].year
  const season = reports[reportValue].season

  const selectPlayerRecordsByYear = makeSelectPlayerRecordsByYear(year, season);
  const playerRecords = useSelector(selectPlayerRecordsByYear)

  let data: TableClub[] = []

  //resets values (totals don't reset when state changes)
  Object.entries(clubs).map(([key, club]) => {
    club.totalBaseSal = 0
    club.totalGuarComp = 0
  })

  for (const record of playerRecords){
    clubs[record.club].totalBaseSal += record.basesalary
    clubs[record.club].totalGuarComp += record.guaranteedcomp

  }

  Object.entries(clubs).forEach(([key, club]) => {
    if (Number(reports[reportValue].year) >= club.yearFirst && club.yearFinal == 0) {
      if (key != "SJ" && reportValue != "2007"){
        data.push({
          clubid: key,
          clubName: club.clubName,
          totalBaseSal: club.totalBaseSal,
          totalGuarComp: club.totalGuarComp,
        })
      }
      
    }
  })
  
    return (
      <Card>
        <CardContent className="overflow-hidden">
          <SelectReport onReportValueChange={(report) => setReportValue(report)}/>
            <div>
            <ClubTable columns={clubColumns} data={data} />
            </div>
        </CardContent>

    </Card>
      
    );
  }