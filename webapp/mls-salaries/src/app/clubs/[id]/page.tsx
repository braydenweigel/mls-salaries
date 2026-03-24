"use client"

import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card'
import { useEffect } from "react"
import React, { use } from "react"
import { useTheme } from "next-themes"
import { CURRENT_YEAR, reports } from '@/lib/globals'
import SelectReport from '@/components/lib/SelectReport'
import { clubPlayerColumns, TableClubPlayers } from '@/app/clubs/[id]/_components/clubPlayerTableColumns'
import { ClubPlayersTable } from './_components/ClubPlayersTable'
import ClubIDChart from './_components/chart'
import { notFound, useRouter, useSearchParams } from 'next/navigation'
import clubs from "@/lib/data/clubs.json"
import records from "@/lib/data/records.json"
import { Club, PlayerRecord } from '@/lib/data/types'
import { filterRecordsByReportAndClub } from '@/lib/data/filters'


export default function ClubPage(props: { params: Promise<{ id: string }> }) {
  const { theme, systemTheme } = useTheme()

  const { id } = use(props.params)
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  let reportParams = searchParams.get("year")
  const defaultReport = id == "CHV" ? "2014.5" : CURRENT_YEAR
  const [reportValue, setReportValue] = React.useState(reportParams ?? defaultReport)

  let year: string, season: string
  if (reports[reportValue]){
    year = reports[reportValue].year
    season = reports[reportValue].season
  } else {
    year = reports[CURRENT_YEAR].year
    season = reports[CURRENT_YEAR].season
    reportParams = defaultReport
    setReportValue(CURRENT_YEAR)
  }

  //find club
  const allClubs = clubs as Club[]
  const club = allClubs.find((club) => club.clubid == id)

  if (!club){
    notFound()
  }

  useEffect(() => {
    if (club) {
      document.title = club.clubname + " - " + year + " " + season + " - MLS Salaries"
      replace(`/clubs/${club.clubid}?year=${reportValue}`)
    } else {
      document.title = "Club Not Found - MLS Salaries"
    }
  },[club, replace, year, season, reportValue])

  const clubRecords = filterRecordsByReportAndClub((records as PlayerRecord[]), year, season, club.clubid)
  const { data, totalBaseSal, totalGuarComp } = formatData(clubRecords, year, season, reportValue)

  const clubYears = formatClubYears(club)
  const clubReports = getClubReports(club)
  const chartData = formatChartData(data)

  const actualTheme = determineTheme(theme, systemTheme)
  const colors = determineColors(actualTheme)

  return (
    <div>
      <Card className="my-4">
        <CardHeader>
          <CardTitle className="text-2xl">{club.clubname}</CardTitle>
          <CardDescription className="text-base">Years Active: {clubYears}</CardDescription>
        </CardHeader>
        <CardContent className="overflow-hidden space-y-2">
          <SelectReport onReportValueChange={(report) => setReportValue(report)} reports={clubReports} defaultReport={reportParams ?? defaultReport}/>
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
    
function formatData(clubRecords: PlayerRecord[], year: string, season: string, reportValue: string){
  let totalBaseSal = 0
  let totalGuarComp = 0
  const data: TableClubPlayers[] = []

  for (const record of clubRecords){
    if (record.recordyear === year && record.recordseason === season){
      totalBaseSal += record.basesalary
      totalGuarComp += record.guaranteedcomp

      let name = ""
      if (!record.firstname){
        name = record.lastname
      } else if (!record.lastname){
        name = record.firstname
      } else {
        name = record.firstname + " " + record.lastname
      }

      data.push({
        id: record.playerid,
        name: name,
        position: record.position,
        baseSal: record.basesalary,
        guarComp: record.guaranteedcomp,
        reportYear: reportValue
      })
    }
  }

  data.sort((a,b) => b.guarComp - a.guarComp)

  return { 
    data: data,
    totalBaseSal: totalBaseSal,
    totalGuarComp: totalGuarComp
  }
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

function determineTheme(theme: string | undefined, systemTheme: "light" | "dark" | undefined){
  let actualTheme = "dark"
  if (theme === "dark"){
    actualTheme = "dark"
  } else if (theme === "light"){
    actualTheme = "light"
  } else if (theme === "system"){
    if (systemTheme === "dark"){
      actualTheme = "dark"
    } else if (systemTheme === "light"){
      actualTheme = "light"
    }
  }

  return actualTheme
}

function determineColors(theme: string){
  //const clubColor = theme === "dark" ? club.colorprimary : club.colorsecondary

  let bsColor = "#FFFFFF"
  let gcColor = "#FFFFFF"
  if (theme === "dark"){
    bsColor = "#A0A0A0"
    gcColor = "#C0C0C0"
  } else {
    bsColor = "#303030"
    gcColor = "#606060"
  }

  return {
    bsColor: bsColor,
    gcColor: gcColor
  }
}