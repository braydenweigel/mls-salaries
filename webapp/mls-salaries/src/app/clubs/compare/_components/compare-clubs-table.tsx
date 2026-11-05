import Link from "next/link"
import { ClubList } from "../page"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlayerRecord } from "@/lib/data/types"

type CompareClubsTableProps = {
    clubList: ClubList
}

const RANK_COLUMN_WIDTH = 64
const CLUB_COLUMN_MIN_WIDTH = 160

export default function CompareClubsTable({clubList}: CompareClubsTableProps){
    const populatedClubs = clubList.data.filter((entry) => entry.club)
    const maxPlayers = getMaxPlayers(clubList)
    const gridTemplateColumns = `${RANK_COLUMN_WIDTH}px repeat(${populatedClubs.length}, minmax(${CLUB_COLUMN_MIN_WIDTH}px, 1fr))`

    return (
        <Card className="flex flex-col w-full min-h-0 max-h-[70vh] overflow-hidden gap-3 py-4">
            <div className="shrink-0 flex items-center justify-between gap-2 px-4 md:px-6">
                <p className="text-sm text-muted-foreground">Guaranteed comp., with base salary below</p>
            </div>

            <div className="min-h-0 overflow-auto">
                <Table className="px-4" style={{display: "grid", gridTemplateColumns}}>
                    <TableHeader className="contents">
                        <TableRow className="contents">
                            <TableHead className="p-0 whitespace-normal border-b">
                                <div className="flex h-full items-center px-2 py-1 text-xs md:text-sm">Rank</div>
                            </TableHead>
                            {populatedClubs.map((entry) => (
                                entry.club && (
                                    <TableHead key={entry.stackID} className="p-0 whitespace-normal align-top border-b">
                                        <div className="flex h-full items-center gap-1.5 px-2 py-1">
                                            <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: entry.club.club.colorprimary }}/>
                                            <Link
                                                href={`/clubs/${entry.club.club.clubid}?year=${entry.club.reportValue}`}
                                                className="min-w-0 truncate font-semibold text-xs md:text-sm hover:underline"
                                            >
                                                {entry.club.club.clubname}
                                            </Link>
                                        </div>
                                    </TableHead>
                                )
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody className="contents">
                        {Array.from({ length: maxPlayers }).map((_, rank) => (
                            <TableRow key={rank} className="contents">
                                <TableCell className="whitespace-normal text-sm py-3 border-b text-muted-foreground">
                                    {rank + 1}
                                </TableCell>
                                {populatedClubs.map((entry) => {
                                    const player = entry.club?.players[rank]

                                    return (
                                        <TableCell key={entry.stackID} className="whitespace-normal py-3 border-b">
                                            {player ? (
                                                <div className="flex flex-col">
                                                    <Link
                                                        href={`/players/${player.playerid}`}
                                                        className="font-semibold text-sm hover:underline"
                                                    >
                                                        {formatPlayerName(player)}
                                                    </Link>
                                                    <p className="text-sm">
                                                        ${player.guaranteedcomp.toLocaleString()}
                                                        <span className="text-xs text-muted-foreground"> Base ${player.basesalary.toLocaleString()}</span>
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">---</p>
                                            )}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        ))}
                        <TableRow className="contents">
                            <TableCell className="whitespace-normal text-sm font-semibold py-3 border-t">
                                Total
                            </TableCell>
                            {populatedClubs.map((entry) => (
                                <TableCell key={entry.stackID} className="whitespace-normal py-3 border-t">
                                    {entry.club && (
                                        <div className="flex flex-col">
                                            <p className="font-bold text-sm">${entry.club.guarComp.toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground">Base ${entry.club.baseSalary.toLocaleString()}</p>
                                        </div>
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            <p className="shrink-0 px-4 md:px-6 text-xs text-muted-foreground">
                Guaranteed compensation is base salary plus signing and guaranteed bonuses, annualized over the contract.
            </p>
        </Card>
    )
}

function formatPlayerName(player: PlayerRecord){
    if (!player.firstname) return player.lastname
    if (!player.lastname) return player.firstname
    return `${player.firstname} ${player.lastname}`
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
