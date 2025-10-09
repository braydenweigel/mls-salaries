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

import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { RootState } from "@/lib/store/store"
import React, { use } from "react"
import { useTheme } from "next-themes"
import { reports } from '@/lib/dicts'
import SelectReport from '@/components/lib/SelectReport'
import LoadingPlayerPage from '@/app/players/[id]/loading'
import { makeSelectPlayerRecordsByClub } from '@/lib/store/playerRecordsSlice'
import { report } from 'process'
import { clubPlayerColumns, TableClubPlayers } from '@/components/lib/clubPlayerTableColumns'
import { ClubPlayersTable } from '@/components/lib/ClubPlayersTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ClubPage(props: { params: Promise<{ id: string }> }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), [])
  const { theme, systemTheme } = useTheme()

  const { id } = use(props.params)
  const [reportValue, setReportValue] = React.useState(id == "CHV" ? "2014.5" : "2025")
  const year = reports[reportValue].year
  const season = reports[reportValue].season

  const { data: allClubs, loading: clubLoading, error: clubError } = useSelector((state: RootState) => state.clubs)
  const club = allClubs.find((club) => club.clubid == id)

  const selectPlayerRecordsByClub = makeSelectPlayerRecordsByClub(club?.clubid ?? "");
  const clubRecords = useSelector(selectPlayerRecordsByClub)

  if (!mounted) {
    return null
  }

  if (clubError){
    return <p>Error Loading Club: {clubError}</p>

  } else if (clubLoading || clubRecords.length == 0){
    return <LoadingPlayerPage/>

  } else if (!club){
    return (<p>Error: Club not found</p>)

  } else {
    let totalBaseSal = 0
    let totalGuarComp = 0
    let data: TableClubPlayers[] = []

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
          guarComp: record.guaranteedcomp
        })
      }
    }

    data.sort((a,b) => b.guarComp - a.guarComp)

    let clubYears = ""
    if (club.clubid == "SJ"){
      clubYears = "1996-2005, 2008-"
    } else if (club.clubid == "CHV"){
      clubYears = "2005-2014"
    } else {
      clubYears = club.yearfirst + "-"
    }

    let clubReports = structuredClone(reports)
    for (const key in clubReports){
      if (club.clubid == "SJ" && key == "2007.5"){
        delete clubReports[key]
      } else if (club.clubid == "CHV" && key > "2014.5"){
        delete clubReports[key]
      } else if (Number(key) < Number(club.yearfirst)){
        delete clubReports[key]
      }
    }

    return (
      <div>
       <Card className="my-4">
         <CardHeader>
           <CardTitle className="text-2xl">{club.clubname}</CardTitle>
           <CardDescription className="text-base">Years Active: {clubYears}</CardDescription>
         </CardHeader>
         <CardContent className="overflow-hidden space-y-2">
           <SelectReport onReportValueChange={(report) => setReportValue(report)} reports={clubReports} defaultReport={id == "CHV" ? "2014.5" : "2025"}/>
           <p>Total Base Salary: ${totalBaseSal.toLocaleString()}</p> 
           <p>Total Guaranteed Compensation: ${totalGuarComp.toLocaleString()}</p>
         </CardContent>
       </Card>
       <Tabs defaultValue="table">
        <TabsList>
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="chart">Chart</TabsTrigger>
          </TabsList>
          <TabsContent value="table">
          < Card className="">
              <CardContent className="overflow-hidden space-y-2">
                <ClubPlayersTable columns={clubPlayerColumns} data={data} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="chart">
            <Card className="">
              <CardContent className="overflow-hidden space-y-2">
                
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
     );
  }
    
  }