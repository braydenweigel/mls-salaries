import React, { useEffect, useState } from "react"
import { ClubData, ClubList } from "../page"
import { Club } from "@/lib/data/types"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { reports } from "@/lib/globals"
import SelectReport from "@/components/lib/SelectReport"
import { removeClubFromList, updateClubReportValue } from "@/lib/compare-clubs-utils"


type CompareClubsHeaderProps = {
    clubList: ClubList
    setClubList: React.Dispatch<React.SetStateAction<ClubList>>
    club: ClubData
    id: "a" | "b" | "c" | "d"
}

export default function CompareClubsHeader({clubList, setClubList, club, id}: CompareClubsHeaderProps){
    const clubReports = getClubReports(club.club)
    const [reportValue, setReportValue] = useState(club.reportValue)

    useEffect(() => {
        setClubList(updateClubReportValue(clubList, reportValue, club.club, id))
    }, [reportValue])

    const handleClubDelete = () => {
        setClubList(removeClubFromList(clubList, id))
    }

    return (
        <div className="flex flex-col min-w-1/5 max-w-full h-fit">
            <div className="flex flex-col px-4 pb-2">
                <div className="flex justify-between w-full items-center mb-2">
                    <p className="font-semibold my-2">{club.club.clubname}</p>
                    <Button variant="outline" size="icon-sm" style={{borderColor: "var(--destructive)"}} className="self-end" onClick={handleClubDelete}><X color="var(--destructive)"/></Button>
                </div>
                <SelectReport reports={clubReports} defaultReport={reportValue} onReportValueChange={(report) => setReportValue(report)} />
            </div>
        </div>
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