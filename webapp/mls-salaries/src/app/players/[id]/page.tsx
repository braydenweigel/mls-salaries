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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis} from "recharts"
import Link from 'next/link'
import { isValidClub, isValidPlayer} from '@/lib/storeUtils'
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { RootState } from "@/lib/store/store"
import React, { use } from "react";
import { makeSelectRecordsByPlayerId } from '@/lib/store/recordsSlice'
import { makeSelectPlayerRecordsByPlayerId } from '@/lib/store/playerRecordsSlice'
import { Club } from '@/lib/store/clubsSlice'
import { useTheme } from "next-themes"
import LoadingPlayerPage from './loading'

const chartConfig: ChartConfig = {
  basesalary: {
    label: "Base Salary",
    color: "var(--chart-1)",
  },
  guaranteedcomp: {
    label: "Guaranteed Compensation",
    color: "var(--chart-2)",
  },
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

  } else if (!player){
    return <p>Player not found</p>

  } else if (playerLoading || records.length == 0){
    console.log("Records: ", records)
    return <LoadingPlayerPage/>

  } else {
    let playerClubs: Club[] = []
    for (let i of records){
      const clubName = isValidClub(allClubs, i.club)
      if (clubName) 
        playerClubs.push(clubName)
    }

    let clubText = "Last Club: "
    if (records[0].recordyear == "2025" && records[0].recordseason == "Spring"){
      clubText = "Current Club: "
    } 

    const position = records[0].position

    const data = records.map((r) => ({
      year: r.recordyear,
      basesalary: r.basesalary,
      guaranteedcomp: r.guaranteedcomp,
    }))

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

    const clubColor = actualTheme === "dark" ? playerClubs[0].colorprimary : playerClubs[0].colorsecondary

    let bsColor = "#FFFFFF"
    let gcColor = "#FFFFFF"
    if (actualTheme === "dark"){
      bsColor = adjustHexColor(clubColor, -10)
      gcColor = clubColor
    } else {
      bsColor = clubColor
      gcColor = adjustHexColor(clubColor, 10)
    }

    return (
      <div>
      <Card className="my-4">
        <CardHeader>
          <CardTitle className="text-2xl">{records[0].firstname} {records[0].lastname}</CardTitle>
          <CardDescription className="text-base">{clubText} <Link href={`/clubs/${records[0].club}`} className="hover:underline">{playerClubs[0].clubname}</Link> &emsp; Position: {position}</CardDescription>
        </CardHeader>
      </Card>
      <Card className="my-4">
        <CardContent>
          <Table className="mx-auto px-4">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Year</TableHead>
                <TableHead>Club</TableHead>
                <TableHead>Position</TableHead>
                <TableHead className="text-right">Base Salary</TableHead>
                <TableHead className="text-right">Guaranteed Comp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record, index) => (
                <TableRow key={record.id}>
                  <TableCell>{record.recordyear}</TableCell>
                  <TableCell><Link href={`/clubs/${record.club}`} className="hover:underline">{playerClubs[index].clubname}</Link></TableCell>
                  <TableCell>{record.position}</TableCell>
                  <TableCell className="text-right">
                    ${record.basesalary ? record.basesalary.toLocaleString() : record.guaranteedcomp.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    ${record.guaranteedcomp.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="fillBaseSalary" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={bsColor}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={bsColor}
                    stopOpacity={0.8}
                  />
                </linearGradient>
                <linearGradient id="fillGuaranteedComp" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={gcColor}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={gcColor}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" reversed/>
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />

              <Area
                type="monotone"
                dataKey="basesalary"
                stroke={bsColor}
                fill={bsColor}
              />
              <Area
                type="monotone"
                dataKey="guaranteedcomp"
                stroke={gcColor}
                fill="url(#fillGuaranteedComp)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      </div>
    );
  }
}