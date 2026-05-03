import { Card, CardContent } from "@/components/ui/card"
import { reports, clubs as clubsObject, CURRENT_YEAR} from "@/lib/globals"
import React from "react"
import { clubColumns, TableClub} from "@/app/clubs/_components/clubTableColumns"
import { ClubTable } from "./_components/ClubTable"
import { filterRecordsByReport } from "@/lib/data/filters"
import { PlayerRecord } from "@/lib/data/types"
import records from "@/lib/data/records.json"
import ClubsSelectReport from "./_components/ClubsSelectReport"

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ year?: string }> })  {
  const { year: report } = await searchParams

  const year = reports[report ?? CURRENT_YEAR].year
  const season = reports[report ?? CURRENT_YEAR].season

  return {
    title: `${year} ${season} Clubs - MLS Salaries`,
  }
}

export default async function Clubs({ searchParams }: { searchParams: Promise<{ year?: string }> }) {
  const { year: report } = await searchParams
  const reportParams = report

  const defaultReport = reports[reportParams ?? ""] && reportParams ? reportParams : CURRENT_YEAR
  const reportValue = reportParams ?? defaultReport

  const year = reports[reportValue].year
  const season = reports[reportValue].season

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
        <ClubsSelectReport reports={reports} defaultReport={reportValue}/>
        <div>
        <ClubTable columns={clubColumns} data={data}/>
        </div>
      </CardContent>
    </Card>
  );
}

function createTableData(clubs: typeof clubsObject, reportValue: string){
  const data: TableClub[] = []

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