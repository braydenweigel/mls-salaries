"use client"

import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card'

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
import { reports } from '@/lib/globals'
import SelectReport from '@/components/lib/SelectReport'
import LoadingPlayerPage from '@/app/players/[id]/loading'
import { makeSelectPlayerRecordsByClub } from '@/lib/store/playerRecordsSlice'
import { clubPlayerColumns, TableClubPlayers } from '@/components/lib/clubPlayerTableColumns'
import { ClubPlayersTable } from '@/components/lib/ClubPlayersTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ClubIDChart from './chart'
import { Club } from '@/lib/store/clubsSlice'
import { useSearchParams } from 'next/navigation'

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

export default function ClubPage(props: { params: Promise<{ id: string }> }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), [])
  const { theme, systemTheme } = useTheme()

  const { id } = use(props.params)
  const searchParams = useSearchParams()
  let reportParams = searchParams.get("year")
  const defaultReport = id == "CHV" ? "2014.5" : "2025"


  const [reportValue, setReportValue] = React.useState(reportParams ?? defaultReport)

  let year, season
  if (reports[reportValue]){
    year = reports[reportValue].year
    season = reports[reportValue].season
  } else {
    year = "2025"
    season = "Spring"
    reportParams = defaultReport
    setReportValue("2025")
  }

  const { data: allClubs, loading: clubLoading, error: clubError } = useSelector((state: RootState) => state.clubs)
  const club = allClubs.find((club) => club.clubid == id)

  const selectPlayerRecordsByClub = makeSelectPlayerRecordsByClub(club?.clubid ?? "");
  const clubRecords = useSelector(selectPlayerRecordsByClub)

  let actualTheme = determineTheme(theme, systemTheme)

  if (!mounted) {
    return null
  }

  if (clubError){
    return <p>Error Loading Club: {clubError}</p>

  } else if (!club){
    return (<p>Error: Club not found</p>)

  } else if (clubLoading || clubRecords.length == 0){
    return <LoadingPlayerPage/>

  }  else {
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
          guarComp: record.guaranteedcomp,
          reportYear: reportValue
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

    let chartData = structuredClone(data).reverse()

    for (let record of chartData){
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

    const colors = determineColors(actualTheme, club)

    return (
      <div>
       <Card className="my-4">
         <CardHeader>
           <CardTitle className="text-2xl">{club.clubname}</CardTitle>
           <CardDescription className="text-base">Years Active: {clubYears}</CardDescription>
         </CardHeader>
         <CardContent className="overflow-hidden space-y-2">
           <SelectReport onReportValueChange={(report) => setReportValue(report)} reports={clubReports} defaultReport={reportParams ?? defaultReport}/>
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
                <ClubIDChart data={chartData} colors={colors}/>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
     );
  }
    
  }