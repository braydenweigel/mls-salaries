import React, { useEffect, useMemo, useState } from "react"
import { ClubData, ClubList } from "../page"
import { Club } from "@/lib/data/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { reports } from "@/lib/globals"
import SelectReport from "@/components/lib/SelectReport"
import { removeClubFromList, updateClubReportValue } from "@/lib/compare-clubs-utils"
import Link from "next/link"


type CompareClubsHeaderProps = {
    clubList: ClubList
    setClubList: React.Dispatch<React.SetStateAction<ClubList>>
    club: ClubData
    id: "a" | "b" | "c" | "d"
}

export default function CompareClubsHeader({clubList, setClubList, club, id}: CompareClubsHeaderProps){
    const [clubReports, setClubReports] = useState(getClubReports(club.club))
    const [reportValue, setReportValue] = useState(club.reportValue)

    useEffect(() => {
        setClubReports(getClubReports(club.club))
        setReportValue(club.reportValue)
    }, [club])

    useEffect(() => {
        setClubList(updateClubReportValue(clubList, reportValue, club.club, id))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportValue])

    const handleClubDelete = () => {
        setClubList(removeClubFromList(clubList, id))
    }

    const sortedReportKeys = useMemo(
        () => Object.keys(clubReports).sort((a, b) => Number(a) - Number(b)),
        [clubReports]
    )
    const reportIndex = sortedReportKeys.indexOf(reportValue)
    const previousReport = reportIndex > 0 ? sortedReportKeys[reportIndex - 1] : null
    const nextReport = reportIndex >= 0 && reportIndex < sortedReportKeys.length - 1 ? sortedReportKeys[reportIndex + 1] : null

    return (
        <Card className="flex flex-col gap-3 py-4 px-4">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    <span
                        className="flex size-8 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white"
                        style={{ backgroundColor: club.club.colorprimary }}
                    >
                        {club.club.clubid}
                    </span>
                    <Link
                        href={`/clubs/${club.club.clubid}?year=${club.reportValue}`}
                        className="min-w-0 truncate font-semibold hover:underline"
                    >
                        {club.club.clubname}
                    </Link>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 shrink-0 text-muted-foreground hover:text-foreground"
                    onClick={handleClubDelete}
                    aria-label={`Remove ${club.club.clubname}`}
                >
                    <X className="size-3.5"/>
                </Button>
            </div>

            <div className="hidden sm:flex items-stretch gap-1">
                <Button
                    variant="outline"
                    className="h-auto w-7 shrink-0 rounded-md px-0"
                    onClick={() => previousReport && setReportValue(previousReport)}
                    disabled={!previousReport}
                    aria-label="Previous release"
                >
                    <ChevronLeft className="size-4"/>
                </Button>
                <SelectReport
                    reports={clubReports}
                    defaultReport={reportValue}
                    onReportValueChange={(report) => setReportValue(report)}
                    className="min-w-0 flex-1 text-xs md:text-sm"
                />
                <Button
                    variant="outline"
                    className="h-auto w-7 shrink-0 rounded-md px-0"
                    onClick={() => nextReport && setReportValue(nextReport)}
                    disabled={!nextReport}
                    aria-label="Next release"
                >
                    <ChevronRight className="size-4"/>
                </Button>
            </div>

            <div className="sm:hidden flex items-center justify-between gap-2">
                <div>
                    <p className="text-sm font-bold tabular-nums">${club.guarComp.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Base ${club.baseSalary.toLocaleString()}</p>
                </div>
                <div className="flex items-stretch gap-1 shrink-0">
                    <Button
                        variant="outline"
                        className="h-auto w-6 shrink-0 rounded-md px-0"
                        onClick={() => previousReport && setReportValue(previousReport)}
                        disabled={!previousReport}
                        aria-label="Previous release"
                    >
                        <ChevronLeft className="size-3.5"/>
                    </Button>
                    <SelectReport
                        reports={clubReports}
                        defaultReport={reportValue}
                        onReportValueChange={(report) => setReportValue(report)}
                        size="sm"
                        className="w-[120px] text-[11px]"
                    />
                    <Button
                        variant="outline"
                        className="h-auto w-6 shrink-0 rounded-md px-0"
                        onClick={() => nextReport && setReportValue(nextReport)}
                        disabled={!nextReport}
                        aria-label="Next release"
                    >
                        <ChevronRight className="size-3.5"/>
                    </Button>
                </div>
            </div>
            <div className="hidden sm:block">
                <p className="text-xs text-muted-foreground">Total guaranteed comp.</p>
                <p className="text-lg font-bold tabular-nums">${club.guarComp.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Base ${club.baseSalary.toLocaleString()}</p>
            </div>
        </Card>
    )
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
