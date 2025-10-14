"use client"

import { 
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card'
import Link from 'next/link'
import { isValidClub, isValidPlayer} from '@/lib/storeUtils'
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { RootState } from "@/lib/store/store"
import React, { use } from "react";
import { makeSelectPlayerRecordsByPlayerId, PlayerRecord } from '@/lib/store/playerRecordsSlice'
import { Club } from '@/lib/store/clubsSlice'
import { useTheme } from "next-themes"
import LoadingPlayerPage from './loading'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PlayerIDTable from '@/app/players/[id]/table'
import { CURRENT_YEAR, reports } from "@/lib/globals"
import PlayerIDChart from '@/app/players/[id]/chart'
import { notFound } from 'next/navigation'


function getPlayerClubs(allClubs: Club[], records: PlayerRecord[]){
  let playerClubs: Club[] = []
  for (let i of records){
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

function determineColors(theme: string, club: Club){
  const clubColor = theme === "dark" ? club.colorprimary : club.colorsecondary

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
  let data: {
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

function adjustHexColor(hex: string, percent: number): string {
  // Remove leading "#" if present
  hex = hex.replace(/^#/, "");

  // Parse r, g, b
  const num = parseInt(hex, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;

  // Apply adjustment
  const adjust = (channel: number) =>
    Math.min(255, Math.max(0, Math.round(channel * (100 + percent) / 100)));

  r = adjust(r);
  g = adjust(g);
  b = adjust(b);

  // Convert back to hex string
  const newHex =
    "#" +
    (1 << 24 | (r << 16) | (g << 8) | b)
      .toString(16)
      .slice(1)
      .toUpperCase();

  return newHex;
}

export default function PlayerPage(props: { params: Promise<{ id: string }> }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), [])
  const { theme, systemTheme } = useTheme()

  const { id } = use(props.params)
  const { data: players, loading: playerLoading, error: playerError } = useSelector((state: RootState) => state.players)
  const player = isValidPlayer(players, id)

  const selectPlayerRecordsByPlayerId = makeSelectPlayerRecordsByPlayerId(player?.playerid ?? "");
  const playerRecords = useSelector(selectPlayerRecordsByPlayerId)

  const allClubs = useSelector((state: RootState) => state.clubs.data)
  
  const records = [...playerRecords].sort((a, b) => {
    if (a.recordyear < b.recordyear) return 1;
    if (a.recordyear > b.recordyear) return -1;
    return 0;
  })

  if (!mounted) {
    return null
  }

  if (playerError) {
    return <p>Error Loading Player: {playerError}</p>

  } else if (playerLoading || records.length == 0){
    console.log("Records: ", records)
    return <LoadingPlayerPage/>

  } else if (!player){
    notFound()

  } else {
    const playerClubs = getPlayerClubs(allClubs, records)

    let clubText = "Last Club: "
    const year = reports[CURRENT_YEAR].year
    const season = reports[CURRENT_YEAR].season
    if (records[0].recordyear == year && records[0].recordseason == season){
      clubText = "Current Club: "
    } 

    const position = records[0].position
    const data = formatData(records)

    let actualTheme = determineTheme(theme, systemTheme)
    const colors = determineColors(actualTheme, playerClubs[0])

    return (
      <div>
      <Card className="my-4">
        <CardHeader>
          <CardTitle className="text-2xl">{records[0].firstname} {records[0].lastname}</CardTitle>
          <CardDescription className="text-base">{clubText} <Link href={`/clubs/${records[0].club}`} className="hover:underline">{playerClubs[0].clubname}</Link> &emsp; Position: {position}</CardDescription>
        </CardHeader>
      </Card>
      <Tabs defaultValue="table">
          <TabsList>
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="chart">Chart</TabsTrigger>
          </TabsList>
          <TabsContent value="table">
            <Card >
              <CardContent>
                <PlayerIDTable records={records} playerClubs={playerClubs} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="chart">
            <Card>
              <CardContent>
                <PlayerIDChart data={data} colors={colors}/>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    );
  }
}