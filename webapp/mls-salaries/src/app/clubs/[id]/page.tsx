import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card'
import React from "react"
import { CURRENT_YEAR, reports } from '@/lib/globals'
import { clubPlayerColumns, TableClubPlayers } from '@/app/clubs/[id]/_components/clubPlayerTableColumns'
import { ClubPlayersTable } from './_components/ClubPlayersTable'
import ClubIDChart from './_components/chart'
import { notFound } from 'next/navigation'
import clubs from "@/lib/data/clubs.json"
import records from "@/lib/data/records.json"
import { Club, PlayerRecord } from '@/lib/data/types'
import { filterRecordsByReportAndClub } from '@/lib/data/filters'
import { formatData } from '@/lib/clubs'
import ClubSelectReport from './_components/ClubSelectReport'

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>,
  searchParams: Promise<{ year?: string }>
})  {
  const { id } = await params
  const { year: report } = await searchParams

  const year = reports[report ?? CURRENT_YEAR].year
  const season = reports[report ?? CURRENT_YEAR].season

  const club = clubs.find((c) => c.clubid === id)

  if (!club) {
    return { title: "Club Not Found - MLS Salaries" }
  }

  return {
    title: `${club.clubname} - ${year} ${season} - MLS Salaries`,
  }
}


export default async function ClubPage({
params,
  searchParams,
}: {
  params: Promise<{ id: string }>,
  searchParams: Promise<{ year?: string }>
}) {
  const { id } = await params
  const { year: report } = await searchParams

  let reportParams = report
  const defaultReport = id == "CHV" ? "2014.5" : CURRENT_YEAR
  const reportValue = reportParams ?? defaultReport

  let year: string, season: string
  if (reports[reportValue]){
    year = reports[reportValue].year
    season = reports[reportValue].season
  } else {
    year = reports[CURRENT_YEAR].year
    season = reports[CURRENT_YEAR].season
  }

  //find club
  const allClubs = clubs as Club[]
  const club = allClubs.find((club) => club.clubid == id)

  if (!club){
    notFound()
  }

  const clubRecords = filterRecordsByReportAndClub((records as PlayerRecord[]), year, season, club.clubid)
  const { data, totalBaseSal, totalGuarComp } = formatData(clubRecords, year, season, reportValue)

  const clubYears = formatClubYears(club)
  const clubReports = getClubReports(club)
  const chartData = formatChartData(data)

  const colors = {
    primary: club.colorprimary,
    secondary: club.colorsecondary
  }

  return (
    <div>
      <Card className="my-4">
        <CardHeader>
          <CardTitle className="text-2xl">{club.clubname}</CardTitle>
          <CardDescription className="text-base">Years Active: {clubYears}</CardDescription>
        </CardHeader>
        <CardContent className="overflow-hidden space-y-2">
          <ClubSelectReport
            reports={clubReports}
            defaultReport={reportValue}
            clubId={club.clubid}
          />
          <div className="md:hidden">
            <p>Total Base Salary: </p><p className="mb-2">${totalBaseSal.toLocaleString()}</p>
            <p>Total Guaranteed Compensation: </p><p>${totalGuarComp.toLocaleString()}</p>
          </div>
          <div className="hidden md:block">
            <p>Total Base Salary: ${totalBaseSal.toLocaleString()}</p>
            <p>Total Guaranteed Compensation: ${totalGuarComp.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="my-4">
        <CardContent className="overflow-hidden space-y-2">
          <ClubPlayersTable columns={clubPlayerColumns} data={data} />
        </CardContent>
      </Card>
      <Card className="hidden md:block">
        <CardContent className="overflow-hidden space-y-2">
          <ClubIDChart data={chartData} colors={colors}/>
        </CardContent>
      </Card>
      
    </div>
    );
}

function formatClubYears(club: Club){
  if (club.clubid == "SJ"){
    return "1996-2005, 2008-"
  } else if (club.clubid == "CHV"){
    return "2005-2014"
  } else {
    return club.yearfirst + "-"
  }
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

function getClubReports(club: Club){
  const clubReports = structuredClone(reports)
  for (const key in clubReports){
    if (club.clubid == "SJ" && key == "2007.5"){
      delete clubReports[key]
    } else if (club.clubid == "CHV" && key > "2014.5"){
      delete clubReports[key]
    } else if (Number(key) < Number(club.yearfirst)){
      delete clubReports[key]
    }
  }

  return clubReports
}