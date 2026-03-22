"use client"

import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card'
import Link from 'next/link'
import { isValidClub, isValidPlayer} from '@/lib/storeUtils'
import { useEffect } from "react"
import React, { use } from "react";
import { useTheme } from "next-themes"
import PlayerIDTable from '@/app/players/[id]/_components/table'
import { CURRENT_YEAR, reports } from "@/lib/globals"
import PlayerIDChart from '@/app/players/[id]/_components/chart'
import { notFound } from 'next/navigation'
import players from '@/lib/data/players.json'
import clubs from '@/lib/data/clubs.json'
import records from "@/lib/data/records.json"
import type { Player, Club, PlayerRecord } from '@/lib/data/types'
import { filterRecordsByPlayerID } from '@/lib/data/filters'


export default function PlayerPage(props: { params: Promise<{ id: string }> }) {
  const { theme, systemTheme } = useTheme()

  const { id } = use(props.params)
  const allPlayers = players as Player[]
  const player = isValidPlayer(allPlayers, id)

  if (!player) notFound()

  useEffect(() => {
    if (player) {
      document.title = player.lastname + " " + player.firstname + " - MLS Salaries"
    } else {
      document.title = "Player Not Found - MLS Salaries"
    }
  },[player])

  //getting player records
  const playerRecords = filterRecordsByPlayerID((records as PlayerRecord[]), id)
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

  //Theme stuff
  const actualTheme = determineTheme(theme, systemTheme)
  const colors = determineColors(actualTheme)

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


function getPlayerClubs(allClubs: Club[], records: PlayerRecord[]){
  const playerClubs: Club[] = []
  for (const i of records){
    const clubName = isValidClub(allClubs, i.club)
    if (clubName) 
      playerClubs.push(clubName)
  }

  return playerClubs
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
  // const clubColor = theme === "dark" ? club.colorprimary : club.colorsecondary

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