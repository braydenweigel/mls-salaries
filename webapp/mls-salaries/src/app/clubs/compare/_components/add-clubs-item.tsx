import { Club } from "@/lib/data/types"
import { ClubList } from "../page"
import { CURRENT_YEAR, reports } from "@/lib/globals"
import SelectReport from "@/components/lib/SelectReport"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { useState } from "react"
import { addClubToList, removeClubFromList } from "@/lib/compare-clubs-utils"

type AddClubsItemProps = {
    clubList: ClubList
    setClubList: React.Dispatch<React.SetStateAction<ClubList>>
    club: Club
}

export default function AddClubsItem({clubList, setClubList, club}: AddClubsItemProps){
    const defaultReport = club.clubid == "CHV" ? "2014.5" : CURRENT_YEAR
    const [reportValue, setReportValue] = useState(defaultReport)
    const clubReports = getClubReports(club)

    const existingEntry = clubList.data.find((d) => d.club?.club.clubid === club.clubid && d.club?.reportValue === reportValue)

    const handleAddClub = () => {
        if (clubList.numClubs < 4){
            setClubList(addClubToList(clubList, reportValue, club))
        }
    }

    const handleRemoveClub = () => {
        if (existingEntry) setClubList(removeClubFromList(clubList, existingEntry.stackID))
    }

    return (
        <div className="flex flex-row w-full items-center justify-between gap-2 py-1 md:py-2">
            <p className="min-w-0 flex-1 truncate text-xs">{club.clubname}</p>
            <div className="flex flex-row items-center shrink-0">
                <SelectReport
                    reports={clubReports}
                    defaultReport={defaultReport}
                    onReportValueChange={(report) => setReportValue(report)}
                    size="sm"
                    className="w-[120px] text-[11px]"
                />
                {existingEntry ?
                    <Button variant="outline" size="icon-sm" style={{borderColor: "var(--destructive)"}} onClick={handleRemoveClub} className="mx-1 md:mx-2"><X color="var(--destructive)"/></Button>
                    : <Button variant="outline" size="icon-sm" disabled={!(clubList.numClubs < 4)} onClick={handleAddClub} className="mx-1 md:mx-2"><Plus/></Button>
                }
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