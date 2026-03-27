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
    const [clubReports, setClubReports] = useState(getClubReports(club.club))
    const [reportValue, setReportValue] = useState(club.reportValue)

    useEffect(() => {
        setClubReports(getClubReports(club.club))
        setReportValue(club.reportValue)
    }, [club])

    useEffect(() => {
        setClubList(updateClubReportValue(clubList, reportValue, club.club, id))
    }, [reportValue])


    const handleClubDelete = () => {
        setClubList(removeClubFromList(clubList, id))
    }

    return (
        <div className="flex flex-col max-w-full min-w-[50%] md:min-w-0" style={{minWidth: `${100 / clubList.numClubs}%`}}>
            <div className="flex flex-col px-4 py-2 items-center  h-full" >
                <div className="flex justify-between w-[180px] items-start mb-2 h-12">
                    <p className="font-semibold">{club.club.clubname}</p>
                    <Button variant="outline" size="icon-sm" style={{borderColor: "var(--destructive)"}} onClick={handleClubDelete}><X color="var(--destructive)"/></Button>
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