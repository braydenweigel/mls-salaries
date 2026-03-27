import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card'
import Link from 'next/link'
import { isValidClub, isValidPlayer} from '@/lib/storeUtils'
import { cache } from "react"
import React from "react";
import PlayerIDTable from '@/app/players/[id]/_components/table'
import { CURRENT_YEAR, reports } from "@/lib/globals"
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
  const clubText = playerRecords[0].recordyear == reports[CURRENT_YEAR].year && playerRecords[0].recordseason == reports[CURRENT_YEAR].season ? "Current Club: " : "Last Club: "
  const position = playerRecords[0].position
  const data = formatData(playerRecords)

  const colors = {
    primary: playerClubs[0].colorprimary,
    secondary: playerClubs[0].colorsecondary
  }

  return (
    <div>
    <Card className="my-4">
      <CardHeader>
        <CardTitle className="text-2xl">{playerRecords[0].firstname} {playerRecords[0].lastname}</CardTitle>
        <CardDescription className="text-base"><div>{clubText} <Link href={`/clubs/${playerRecords[0].club}`} className="hover:underline">{playerClubs[0].clubname}</Link></div><div>Position: {position}</div></CardDescription>
      </CardHeader>
    </Card>
    <Card className="my-4">
      <CardContent>
        <PlayerIDTable records={playerRecords} playerClubs={playerClubs} />
      </CardContent>
    </Card>
    <Card className="hidden md:block">
      <CardContent>
        <PlayerIDChart data={data} colors={colors}/>
      </CardContent>
    </Card>

    </div>
  );
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
      } else {
        bS = record.basesalary
        gC = record.guaranteedcomp - record.basesalary
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