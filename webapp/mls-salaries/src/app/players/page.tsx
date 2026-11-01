import { PlayerTable } from "./_components/PlayerTable"
import { playerColumns, TablePlayer } from "@/app/players/_components/playerTableColumns"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { isValidClub } from "@/lib/storeUtils"
import { CURRENT_YEAR, reports } from "@/lib/globals"
import React from "react"
import Link from "next/link"
import { ArrowLeftRight, Download, Shuffle } from "lucide-react"
import records from "@/lib/data/records.json"
import clubs from "@/lib/data/clubs.json"
import type { PlayerRecord, Club } from "@/lib/data/types"
import { filterRecordsByReport } from "@/lib/data/filters"
import PlayersSelectReport from "./_components/PlayersSelectReport"

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ year?: string }> })  {
  const { year: report } = await searchParams

  const year = reports[report ?? CURRENT_YEAR].year
  const season = reports[report ?? CURRENT_YEAR].season

  return {
    title: `${year} ${season} Players - MLS Salaries`,
  }
}

export default async function Players({ searchParams }: { searchParams: Promise<{ year?: string }> }) {
  const { year: report } = await searchParams
  const reportParams = report

  const defaultReport = reports[reportParams ?? ""] && reportParams ? reportParams : CURRENT_YEAR
  const reportValue = reportParams ?? defaultReport

  const year = reports[reportValue].year
  const season = reports[reportValue].season

  const playerRecords = filterRecordsByReport((records as PlayerRecord[]), year, season)
  const allClubs = clubs as Club[]
  const data: TablePlayer[] = setTableData(playerRecords, allClubs, reportValue)

  return (
    <div className="flex flex-col gap-4 min-h-0">
      <div className="hidden shrink-0 md:flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span className="text-foreground">Players</span>
      </div>
      <div className="shrink-0 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Player salaries</h1>
          <p className="hidden md:block text-sm text-muted-foreground mt-1">
            Base salary and guaranteed compensation for every rostered player, {year} {season}.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Button variant="outline" className="text-xs md:text-sm">
            <Download className="size-4"/>
            Export CSV
          </Button>
          <Button asChild className="text-xs md:text-sm">
            <Link href="/players/compare">
              <ArrowLeftRight className="size-4"/>
              Compare Players
            </Link>
          </Button>
        </div>
      </div>
      <Card className="min-h-0 border-0 shadow-none bg-transparent py-0 gap-0 md:border md:shadow-sm md:bg-card md:py-6">
        <CardContent className="min-h-0 flex flex-col overflow-hidden px-0 md:px-6">
          <PlayerTable
            columns={playerColumns}
            data={data}
            reportSelector={<PlayersSelectReport reports={reports} defaultReport={reportValue}/>}
          />
        </CardContent>
      </Card>
      <p className="shrink-0 text-xs text-muted-foreground">
        Guaranteed compensation is base salary plus signing and guaranteed bonuses, annualized over the contract. Source: MLS Players Association.
      </p>
    </div>
  )
}

function setTableData(playerRecords: PlayerRecord[], allClubs: Club[], reportValue: string){
  const data: TablePlayer[] = []

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

  return data
}
  