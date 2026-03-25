import { Club } from "@/lib/data/types"
import { ClubList, ClubData } from "../page"
import { CURRENT_YEAR, reports } from "@/lib/globals"
import SelectReport from "@/components/lib/SelectReport"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"

type AddClubsDialogProps = {
    clubList: ClubList
    setClubList: React.Dispatch<React.SetStateAction<ClubList>>
    club: Club
}

export default function AddClubsItem({clubList, setClubList, club}: AddClubsDialogProps){
    const defaultReport = club.clubid == "CHV" ? "2014.5" : CURRENT_YEAR
    const [reportValue, setReportValue] = useState(defaultReport)
    const clubReports = getClubReports(club)

    const handleAddClub = () => {
        if (clubList.numClubs < 5){
                const newClub: ClubData = {
                club: club,
                reportValue: reportValue,
                players: [],
                baseSalary: 0,
                guarComp: 0
            }

            //use same process as in /clubs/[id]

            const newList = structuredClone(clubList)
            newList.data[newList.numClubs].club = newClub
            newList.numClubs++

            setClubList(newList)
        }
    }

    return (
        <div className="flex flex-row w-full items-center justify-between py-2">
            <p>{club.clubname}</p>
            <div className="flex flex-row">
                <SelectReport reports={clubReports} defaultReport={defaultReport} onReportValueChange={(report) => setReportValue(report)}/>
                <Button variant="outline" size="icon" disabled={!(clubList.numClubs < 5)} onClick={handleAddClub} className="mx-2"><Plus/></Button>
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