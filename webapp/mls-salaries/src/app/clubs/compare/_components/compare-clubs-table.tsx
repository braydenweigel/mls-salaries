import Link from "next/link"
import { ClubList } from "../page"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlayerRecord } from "@/lib/data/types"
import { formatCompactCurrency } from "@/lib/utils"

type CompareClubsTableProps = {
    clubList: ClubList
}

const RANK_COLUMN_WIDTH = 64
const CLUB_COLUMN_MIN_WIDTH = 160
const MOBILE_RANK_COLUMN_WIDTH = 20

export default function CompareClubsTable({clubList}: CompareClubsTableProps){
    const populatedClubs = clubList.data.filter((entry) => entry.club)
    const maxPlayers = getMaxPlayers(clubList)
    const gridTemplateColumns = `${RANK_COLUMN_WIDTH}px repeat(${populatedClubs.length}, minmax(${CLUB_COLUMN_MIN_WIDTH}px, 1fr))`
    const mobileGridTemplateColumns = `${MOBILE_RANK_COLUMN_WIDTH}px repeat(${populatedClubs.length}, 1fr)`

    return (
        <Card className="flex flex-col w-full gap-3 border-0 shadow-none bg-transparent py-0 sm:min-h-0 sm:max-h-[70vh] sm:overflow-hidden sm:border sm:shadow-sm sm:bg-card sm:py-4">
            <div className="shrink-0 flex items-center justify-between gap-2 px-4 md:px-6">
                <p className="hidden sm:block text-sm text-muted-foreground">Guaranteed comp., with base salary below</p>
            </div>

            {/* mobile: plain list with a header row and row dividers, styled like the /clubs mobile table */}
            <div className="sm:hidden">
                <div
                    className="grid gap-x-2 border-b px-4 pb-2"
                    style={{ gridTemplateColumns: mobileGridTemplateColumns }}
                >
                    <span className="text-xs text-muted-foreground">#</span>
                    {populatedClubs.map((entry) => (
                        entry.club && (
                            <div key={entry.stackID} className="flex items-center gap-1.5 min-w-0">
                                <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: entry.club.club.colorprimary }}/>
                                <span className="text-xs truncate">{entry.club.club.clubid}</span>
                            </div>
                        )
                    ))}
                </div>
                {Array.from({ length: maxPlayers }).map((_, rank) => (
                    <div
                        key={rank}
                        className="grid items-start gap-x-2 border-b px-4 py-3"
                        style={{ gridTemplateColumns: mobileGridTemplateColumns }}
                    >
                        <span className="text-xs text-muted-foreground">{rank + 1}</span>
                        {populatedClubs.map((entry) => {
                            const player = entry.club?.players[rank]

                            return (
                                <div key={entry.stackID} className="min-w-0">
                                    {player ? (
                                        <>
                                            <p className="text-xs font-semibold truncate">{formatMobilePlayerName(player)}</p>
                                            <p className="text-xs font-bold">{formatCompactCurrency(player.guaranteedcomp)}</p>
                                            <p className="text-[10px] text-muted-foreground">Base {formatCompactCurrency(player.basesalary)}</p>
                                        </>
                                    ) : (
                                        <p className="text-xs text-muted-foreground">---</p>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>

            {/* desktop: side-by-side table with a dedicated rank column */}
            <div className="hidden sm:block min-h-0 overflow-auto">
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
                <p className="px-4 md:px-6 py-3 text-xs text-muted-foreground">
                    Guaranteed compensation is base salary plus signing and guaranteed bonuses, annualized over the contract.
                </p>
            </div>
        </Card>
    )
}

function formatPlayerName(player: PlayerRecord){
    if (!player.firstname) return player.lastname
    if (!player.lastname) return player.firstname
    return `${player.firstname} ${player.lastname}`
}

function formatMobilePlayerName(player: PlayerRecord){
    return player.lastname || player.firstname
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
