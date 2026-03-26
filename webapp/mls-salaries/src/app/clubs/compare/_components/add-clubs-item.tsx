import { Club } from "@/lib/data/types"
import { ClubList } from "../page"
import { CURRENT_YEAR, reports } from "@/lib/globals"
import SelectReport from "@/components/lib/SelectReport"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { addClubToList } from "@/lib/compare-clubs-utils"

type AddClubsItemProps = {
    clubList: ClubList
    setClubList: React.Dispatch<React.SetStateAction<ClubList>>
    club: Club
}

export default function AddClubsItem({clubList, setClubList, club}: AddClubsItemProps){
    const defaultReport = club.clubid == "CHV" ? "2014.5" : CURRENT_YEAR
    const [reportValue, setReportValue] = useState(defaultReport)
    const clubReports = getClubReports(club)

    const handleAddClub = () => {
        if (clubList.numClubs < 4){
            setClubList(addClubToList(clubList, reportValue, club))
        }
    }

    return (
        <div className="flex flex-row w-full items-center justify-between py-2">
            <p>{club.clubname}</p>
            <div className="flex flex-row">
                <SelectReport reports={clubReports} defaultReport={defaultReport} onReportValueChange={(report) => setReportValue(report)}/>
                <Button variant="outline" size="icon" disabled={!(clubList.numClubs < 4)} onClick={handleAddClub} className="mx-2"><Plus/></Button>
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