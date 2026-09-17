import React, { useEffect, useState } from "react"
import { ClubData, ClubList } from "../page"
import { Club } from "@/lib/data/types"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { reports } from "@/lib/globals"
import SelectReport from "@/components/lib/SelectReport"
import { removeClubFromList, updateClubReportValue } from "@/lib/compare-clubs-utils"
import { formatCompactCurrency } from "@/lib/utils"


type CompareClubsHeaderProps = {
    clubList: ClubList
    setClubList: React.Dispatch<React.SetStateAction<ClubList>>
    club: ClubData
    id: "a" | "b" | "c" | "d"
}

export default function CompareClubsHeader({clubList, setClubList, club, id}: CompareClubsHeaderProps){
    const [clubReports, setClubReports] = useState(getClubReports(club.club))
    const [reportValue, setReportValue] = useState(club.reportValue)
    const isMobile = useIsMobile()

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

    const selectorWidth = isMobile ? "w-[120px]" : "w-[180px]"

    return (
        <div className="flex flex-col max-w-full" style={{minWidth: isMobile ? "50%" : `${100 / clubList.numClubs}%`}}>
            <div className="flex flex-col justify-between px-1 py-1 md:px-4 md:py-2 items-center h-full" >
                <div className={`flex justify-between items-start gap-1 ${selectorWidth}`}>
                    <p className="min-w-0 wrap-break-word font-semibold text-xs md:text-base">{club.club.clubname}</p>
                    <Button
                        variant="outline"
                        size="icon"
                        style={{borderColor: "var(--destructive)"}}
                        onClick={handleClubDelete}
                        className="size-4 md:size-6 shrink-0 rounded-sm"
                    >
                        <X className="size-2.5 md:size-3.5" color="var(--destructive)"/>
                    </Button>
                </div>
                <div className={`flex flex-col items-center gap-1 md:gap-2 ${selectorWidth} pt-1 md:pt-2`}>
                    <SelectReport
                        reports={clubReports}
                        defaultReport={reportValue}
                        onReportValueChange={(report) => setReportValue(report)}
                        size={isMobile ? "sm" : "default"}
                        className={`${selectorWidth} ${isMobile ? "text-[11px]" : "text-sm"}`}
                    />
                    <div className="flex flex-col items-center">
                        <p className="text-center text-xs md:text-base font-semibold">
                            {`$${club.guarComp.toLocaleString()}`}
                        </p>
                        <p className="text-center text-[10px] md:text-xs text-muted-foreground">
                            {`$${club.baseSalary.toLocaleString()}`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    setIsMobile(media.matches);

    const listener = () => setIsMobile(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  return isMobile;
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