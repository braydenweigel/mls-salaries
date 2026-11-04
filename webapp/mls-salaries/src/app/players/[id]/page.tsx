import {
  Card,
  CardContent
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExportCsvButton } from '@/components/lib/ExportCsvButton'
import { ArrowLeftRight, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { isValidClub, isValidPlayer} from '@/lib/storeUtils'
import { cache } from "react"
import React from "react";
import PlayerIDTable from '@/app/players/[id]/_components/table'
import { reports, POSITION_LABELS } from "@/lib/globals"
import PlayerIDChart from '@/app/players/[id]/_components/chart'
import { notFound } from 'next/navigation'
import players from '@/lib/data/players.json'
import clubs from '@/lib/data/clubs.json'
import records from "@/lib/data/records.json"
import type { Player, Club, PlayerRecord } from '@/lib/data/types'
import { filterRecordsByPlayerID } from '@/lib/data/filters'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const player = getPlayer(id)

  return (player ? 
    {title: player.lastname + " " + player.firstname + " - MLS Salaries"} 
    : {title: "Player Not Found - MLS Salaries"}
  )
  
}

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {

  const { id } = await params
  const player = getPlayer(id)

  if (!player) notFound()

  //getting player records
  const playerRecords = filterRecordsByPlayerID((records as PlayerRecord[]), player.playerid)
  playerRecords.sort((a, b) => {
    if (a.recordyear !== b.recordyear){
      return Number(b.recordyear) - Number(a.recordyear)
    }

    const seasonOrder: Record<string, number> = { "Spring": 0, "Fall": 1 }
    return seasonOrder[b.recordseason] - seasonOrder[a.recordseason]
  })

  //getting Club Info
  const allClubs = clubs as Club[]
  const playerClubs = getPlayerClubs(allClubs, playerRecords)

  //Formatting stuff
  const position = playerRecords[0].position
  const positionLabel = POSITION_LABELS[position] ?? position
  const name = `${playerRecords[0].firstname} ${playerRecords[0].lastname}`
  const initials = getInitials(name)
  const seasonRange = getSeasonRanges(playerRecords)
  const data = formatData(playerRecords)
  const exportData = playerRecords.map((record, index) => ({
    period: `${record.recordseason} ${record.recordyear}`,
    club: playerClubs[index].clubname,
    position: POSITION_LABELS[record.position] ?? record.position,
    baseSalary: record.basesalary ? record.basesalary : record.guaranteedcomp,
    guaranteedComp: record.guaranteedcomp,
  }))

  const colors = {
    primary: playerClubs[0].colorprimary,
    secondary: playerClubs[0].colorsecondary
  }

  return (
    <div>
    <div className="flex md:hidden items-center gap-1 text-sm font-medium text-muted-foreground mb-3">
      <Link href="/players" className="flex items-center gap-0.5 hover:text-foreground">
        <ChevronLeft className="size-4"/>
        Players
      </Link>
    </div>
    <div className="hidden shrink-0 md:flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
      <Link href="/players" className="hover:underline">Players</Link>
      <span>/</span>
      <span className="text-foreground">{name}</span>
    </div>
    <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white" style={{ backgroundColor: colors.primary }}>
          {initials}
        </span>
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold">{name}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <Badge variant="outline" asChild>
              <Link href={`/clubs/${playerRecords[0].club}`} className="hover:underline">{playerClubs[0].clubname}</Link>
            </Badge>
            <Badge variant="outline">{positionLabel}</Badge>
            <span className="text-sm text-muted-foreground">{seasonRange}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:w-fit">
        <ExportCsvButton
          data={exportData}
          columns={[
            { key: "period", label: "Report" },
            { key: "club", label: "Club" },
            { key: "position", label: "Position" },
            { key: "baseSalary", label: "Base Salary" },
            { key: "guaranteedComp", label: "Guaranteed Compensation" },
          ]}
          filename={`${name.replace(/\s+/g, "-").toLowerCase()}-salary-history.csv`}
          buttonClassName="hidden md:flex"
          accentColor={colors.primary}
        />
        <Button asChild className="w-full md:w-fit shrink-0" style={{ backgroundColor: colors.primary }}>
          <Link href={`/players/compare?players=${player.playerid}`}>
            <ArrowLeftRight className="size-4"/>
            Compare Players
          </Link>
        </Button>
      </div>
    </div>
    <PlayerIDChart data={data} colors={colors}/>
    <Card className="min-h-0 border-0 shadow-none bg-transparent py-0 gap-0 md:border md:shadow-sm md:bg-card md:py-6 my-4">
      <CardContent className="min-h-0 flex flex-col overflow-hidden px-0 md:px-6">
        <PlayerIDTable records={playerRecords} playerClubs={playerClubs} />
      </CardContent>
    </Card>

    </div>
  );
}

function getInitials(name: string){
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ""
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function getSeasonRanges(playerRecords: PlayerRecord[]){
  const reportKeys = Object.keys(reports).sort((a, b) => Number(a) - Number(b))
  const ranges: { start: { year: string, season: string }, end: { year: string, season: string } }[] = []
  let current: { start: { year: string, season: string }, end: { year: string, season: string } } | null = null

  for (const key of reportKeys){
    const report = reports[key]
    const hasRecord = playerRecords.some((record) => record.recordyear === report.year && record.recordseason === report.season)

    if (hasRecord){
      current = current ? { start: current.start, end: report } : { start: report, end: report }
    } else if (current){
      ranges.push(current)
      current = null
    }
  }

  if (current) ranges.push(current)

  return ranges
    .map((range) => range.start.year === range.end.year && range.start.season === range.end.season
      ? `${range.start.season} ${range.start.year}`
      : `${range.start.season} ${range.start.year} – ${range.end.season} ${range.end.year}`)
    .join(", ")
}

const getPlayer = cache((id: string) => {
  const allPlayers = players as Player[]
  return isValidPlayer(allPlayers, id)
})

function getPlayerClubs(allClubs: Club[], records: PlayerRecord[]){
  const playerClubs: Club[] = []
  for (const i of records){
    const clubName = isValidClub(allClubs, i.club)
    if (clubName) 
      playerClubs.push(clubName)
  }

  return playerClubs
}

function formatData(playerRecords: PlayerRecord[]){
  const data: {
    report: string,
    baseSalary: number,
    guaranteedComp: number,
    club: string,
    position: string
  }[] = []

  let firstKey = playerRecords[playerRecords.length - 1].recordyear
  if (playerRecords[playerRecords.length - 1].recordseason == "Fall") firstKey += ".5"

  let finalKey = playerRecords[0].recordyear
  if (playerRecords[0].recordseason == "Fall") finalKey += ".5" 


  Object.entries(reports).forEach(([key, report]) => {
    const record = playerRecords.find((record) => record.recordyear == report.year && record.recordseason == report.season)

    if (record){

      let bS = 0
      let gC = 0

      if (!record.basesalary){
        bS = record.guaranteedcomp ?? 0
        gC = record.guaranteedcomp ?? 0
      } else {
        bS = record.basesalary
        gC = record.guaranteedcomp
      }

      data.push({
        report: key,
        baseSalary: bS,
        guaranteedComp: gC,
        club: record.club,
        position: record.position
      })

      console.log("Record Added - Key: ", key)

    } else if (Number(key) > Number(firstKey) && Number(key) < Number(finalKey)){//player not in league this year, but has been in league before, so send values of 0
      data.push({ report: key, baseSalary: 0, guaranteedComp: 0, club: "", position: "" })
      console.log("Empty Record Added - Key: ", key)
    }

  })

  data.sort((a,b) => Number(a.report) - Number(b.report))

  return data
}