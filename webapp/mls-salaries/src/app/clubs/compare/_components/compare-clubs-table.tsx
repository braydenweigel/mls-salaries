import Link from "next/link"
import { ClubList } from "../page"
import { useEffect, useState } from "react"

type CompareClubsTableProps = {
    clubList: ClubList
    onScroll: (scrollLeft: number) => void
}

type CompareClubsTableCell = {
    name: string
    id: string
    baseSalary: number
    guaranteedComp: number
} | null

type CompareClubsTableData = {row: CompareClubsTableCell[]}[]

export default function CompareClubsTable({clubList, onScroll}: CompareClubsTableProps){
    const tableData = formatTableData(clubList)
    const isMobile = useIsMobile()

    return (
        <div
            className="flex flex-col w-full overflow-y-scroll overflow-x-auto"
            onScroll={(e) => onScroll(e.currentTarget.scrollLeft)}
        >
            {tableData.map((row, index) => (
                <div
                    key={index}
                    className="flex justify-start border-b py-1 md:py-2 hover:bg-muted/50"
                    style={{width: `${row.row.length * (isMobile ? 50 : 100 / clubList.numClubs)}%`}}
                >
                    {row.row.map((player, index) => (
                        <div key={player ? (player.id + index) : index} className="flex flex-col max-w-full" style={{minWidth: `${100 / row.row.length}%`}}>
                            {player &&
                                <>
                                    <Link key={player.id} href={`/players/${player.id}`}><p className="text-center text-xs md:text-sm hover:underline">{player.name}</p></Link>
                                    <p className="text-center text-xs md:text-sm font">${player.guaranteedComp.toLocaleString()}</p>
                                    <p className="text-center text-[10px] md:text-xs">${player.baseSalary.toLocaleString()}</p>
                                </>
                            }
                        </div>
                    ))}
                </div>
            ))}
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

function getMaxPlayers(clubList: ClubList){
    let max = 0

    for (const club of clubList.data){
        if (club.club && club.club.players.length > max){
            max = club.club.players.length
        }
    }

    return max
}

function formatTableData(clubList: ClubList){
    const populatedClubs = clubList.data.filter((club) => club.club)
    const maxPlayers = getMaxPlayers(clubList)
    const tableData: CompareClubsTableData = []

    for (let i = 0; i < maxPlayers; i++){
        tableData.push({row: []})
        for (const club of populatedClubs){
            if (club.club && club.club.players[i]){
                const p: CompareClubsTableCell = {
                    name: club.club.players[i].firstname + " " + club.club.players[i].lastname,
                    id: club.club.players[i].playerid,
                    baseSalary: club.club.players[i].basesalary ?? club.club.players[i].guaranteedcomp,
                    guaranteedComp: club.club.players[i].guaranteedcomp
                }
                tableData[i].row.push(p)
            } else {
                tableData[i].row.push(null)
            }
        }
    }

    return tableData
}