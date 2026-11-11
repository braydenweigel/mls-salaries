import React from "react"
import Link from 'next/link'
import { ArrowLeftRight, ChevronLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CURRENT_YEAR, reports } from '@/lib/globals'
import ClubDashboard from './_components/ClubDashboard'
import { notFound } from 'next/navigation'
import clubs from "@/lib/data/clubs.json"
import records from "@/lib/data/records.json"
import { Club, PlayerRecord } from '@/lib/data/types'
import { filterRecordsByReportAndClub, filterRecordsByClub } from '@/lib/data/filters'
import { formatData } from '@/lib/clubs'
import LeagueSalaryTable from '@/app/_components/LeagueSalaryTable'
import LeagueSalaryChart from '@/app/_components/LeagueSalaryChart'
import LeagueAverageChart from '@/app/_components/LeagueAverageChart'

function median(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

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

  const reportParams = report
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

  const clubSubtitle = formatClubSubtitle(club)
  const clubReports = getClubReports(club)

  const colors = {
    primary: club.colorprimary,
    secondary: club.colorsecondary
  }

  const clubAllRecords = filterRecordsByClub((records as PlayerRecord[]), club.clubid)
  const clubReportRows = Object.keys(clubReports)
    .map((reportKey) => {
      const { year: reportYear, season: reportSeason } = reports[reportKey]
      const reportRecords = clubAllRecords.filter((r) => r.recordyear === reportYear && r.recordseason === reportSeason)
      const count = reportRecords.length
      const totalBase = reportRecords.reduce((sum, r) => sum + r.basesalary, 0)
      const totalGuar = reportRecords.reduce((sum, r) => sum + r.guaranteedcomp, 0)

      return {
        reportKey,
        year: reportYear,
        season: reportSeason,
        totalBase,
        totalGuar,
        avgBase: count ? totalBase / count : 0,
        avgGuar: count ? totalGuar / count : 0,
        medianBase: median(reportRecords.map((r) => r.basesalary)),
        medianGuar: median(reportRecords.map((r) => r.guaranteedcomp)),
      }
    })
    .sort((a, b) => Number(b.reportKey) - Number(a.reportKey))

  const clubChartData = clubReportRows
    .map((row) => ({
      report: row.reportKey,
      baseSalary: row.totalBase,
      guaranteedComp: row.totalGuar,
    }))
    .sort((a, b) => Number(a.report) - Number(b.report))

  const clubAverageChartData = [...clubReportRows].sort((a, b) => Number(a.reportKey) - Number(b.reportKey))

  return (
    <div>
      <div className="flex md:hidden items-center gap-1 text-sm font-medium text-muted-foreground mb-3">
        <Link href="/clubs" className="flex items-center gap-0.5 hover:text-foreground">
          <ChevronLeft className="size-4"/>
          Clubs
        </Link>
      </div>
      <div className="hidden shrink-0 md:flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
        <Link href="/clubs" className="hover:underline">Clubs</Link>
        <span>/</span>
        <span className="text-foreground">{club.clubname}</span>
      </div>
      <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-md text-sm font-semibold text-white" style={{ backgroundColor: colors.primary }}>
            {club.clubid}
          </span>
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold">{club.clubname}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <Badge variant="outline">{clubSubtitle}</Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:w-fit">
          <Button asChild className="w-full md:w-fit shrink-0" style={{ backgroundColor: colors.primary }}>
            <Link href={`/clubs/compare?clubs=${club.clubid}:${reportValue}`}>
              <ArrowLeftRight className="size-4"/>
              Compare Clubs
            </Link>
          </Button>
        </div>
      </div>
      <ClubDashboard
        data={data}
        colors={colors}
        totalBaseSal={totalBaseSal}
        totalGuarComp={totalGuarComp}
        reports={clubReports}
        reportValue={reportValue}
        clubId={club.clubid}
      />

      <LeagueSalaryTable
        rows={clubReportRows}
        title={`${club.clubname} salary spend by report`}
        scopeLabel={`for ${club.clubname}`}
      />

      <LeagueSalaryChart
        data={clubChartData}
        title="Salary spend over time"
        description={`Total base salary and guaranteed compensation for ${club.clubname}, by report`}
        color={colors.primary}
      />

      <LeagueAverageChart
        data={clubAverageChartData}
        title="Average & median salary over time"
        scopeLabel={`for ${club.clubname}'s roster`}
        color={colors.primary}
      />
    </div>
    );
}

function formatClubSubtitle(club: Club){
  if (club.clubid == "SJ"){
    return "In MLS 1996-2005, 2008-present"
  } else if (club.clubid == "CHV"){
    return "In MLS 2005-2014"
  } else {
    return `In MLS since ${club.yearfirst}`
  }
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
