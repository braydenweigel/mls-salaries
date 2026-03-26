import { ClubList } from "../page"

type CompareClubsTableProps = {
    clubList: ClubList
}

type CompareClubsTableCell = {
    name: string
    id: string
    baseSalary: number
    guaranteedComp: number
} | null

type CompareClubsTableData = {row: CompareClubsTableCell[]}[]

export default function CompareClubsTable({clubList}: CompareClubsTableProps){
    const tableData = formatTableData(clubList)

    return (
        <div className="flex flex-col overflow-y-scroll overflow-x-hidden w-full"> 
            {tableData.map((row, index) => (
                <div key={index} className="flex w-full justify-around border-b-1 pb-2 hover:bg-muted/50">
                    {row.row.map((player, index) => (
                        <div key={player ? (player.id + index) : index} className="flex flex-col max-w-full" style={{minWidth: `${100 / clubList.numClubs}%`}}>
                            {player ? 
                                <>
                                    <p className="text-center">{player.name}</p>
                                    <p className="text-center">${player.guaranteedComp.toLocaleString()}</p>
                                    <p className="text-center">${player.baseSalary.toLocaleString()}</p>
                                </>
                            : null}
                        </div>
                    ))}
                </div>
            ))}
        </div>

    )
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
    const maxPlayers = getMaxPlayers(clubList)
    const tableData: CompareClubsTableData = []

    for (let i = 0; i < maxPlayers; i++){
        tableData.push({row: []})
        for (const club of clubList.data){
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