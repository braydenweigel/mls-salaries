import React, { useEffect, useState } from "react"
import { PlayerData, PlayerList } from "../page"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { reports } from "@/lib/globals"
import { removePlayerFromList } from "@/lib/compare-players-utils"
import { formatCompactCurrency } from "@/lib/utils"
import Link from "next/link"


type ComparePlayersHeaderProps = {
    playerList: PlayerList
    setPlayerList: React.Dispatch<React.SetStateAction<PlayerList>>
    player: PlayerData
    id: "a" | "b" | "c" | "d"
    index: number
}

type ComparePlayersTableProps = {
    playerList: PlayerList
    setPlayerList: React.Dispatch<React.SetStateAction<PlayerList>>
}

type ComparePlayersRowProps = {
    playerList: PlayerList
    reportValue: string
    isMobile: boolean
    hoveredReport: string | null
    setHoveredReport: React.Dispatch<React.SetStateAction<string | null>>
}

const YEAR_COLUMN_WIDTH = { mobile: 70, desktop: 120 }
const PLAYER_COLUMN_MIN_WIDTH = { mobile: 110, desktop: 150 }

export default function ComparePlayersTable({playerList, setPlayerList}: ComparePlayersTableProps){
    const isMobile = useIsMobile()
    const [hoveredReport, setHoveredReport] = useState<string | null>(null)
    const reportsList = []


    for (const key in reports){
        if (Number(key) >= Number(playerList.min) && Number(key) <= Number(playerList.max)){
            reportsList.push(key)
        }
    }

    reportsList.sort((a, b) => Number(b) - Number(a))
    console.log(reportsList)

    // Native table-layout: fixed rescales "fixed" columns based on content whenever
    // the table's own width is auto, so column sizing is driven by CSS Grid instead
    // (kept as a real <table> for accessibility, via display:contents on thead/tbody/tr).
    // minmax() lets player columns grow to fill leftover space but never shrink below
    // their minimum, overflowing (and scrolling) once there's no room left.
    const yearWidth = isMobile ? YEAR_COLUMN_WIDTH.mobile : YEAR_COLUMN_WIDTH.desktop
    const playerMinWidth = isMobile ? PLAYER_COLUMN_MIN_WIDTH.mobile : PLAYER_COLUMN_MIN_WIDTH.desktop
    const gridTemplateColumns = `${yearWidth}px repeat(${playerList.numPlayers}, minmax(${playerMinWidth}px, 1fr))`

    return (
        <Table className="px-4" style={{display: "grid", gridTemplateColumns}}>
            <TableHeader className="contents">
                <TableRow className="contents">
                    <TableHead className="p-0 whitespace-normal border-b">
                        <div className="flex h-full items-center px-2 py-1">Year</div>
                    </TableHead>
                    {playerList.data.map((p, index) => (
                        p.player ?
                        <ComparePlayersHeader
                            key={p.stackID + p.player.player.playerid}
                            playerList={playerList} setPlayerList={setPlayerList}
                            player={p.player} id={p.stackID} index={index}/>
                        : null
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody className="contents">
            {reportsList.map((report) => (
                <ComparePlayersRow key={report} playerList={playerList} reportValue={report} isMobile={isMobile}
                    hoveredReport={hoveredReport} setHoveredReport={setHoveredReport}/>
            ))}
            </TableBody>
        </Table>
    )
}

function ComparePlayersHeader({playerList, setPlayerList, player, id, index}: ComparePlayersHeaderProps){

    const handlePlayerDelete = () => {
       setPlayerList(removePlayerFromList(playerList, id))
    }

    return (
        <TableHead className="p-0 whitespace-normal align-top border-b">
            <div className={"flex h-full items-center justify-center gap-2 rounded-md px-1 py-1"}>
                <Link href={`/players/${player.player.playerid}`}><p className="min-w-0 font-semibold wrap-break-word text-center text-xs md:text-base hover:underline">
                    {player.player.lastname} {player.player.firstname}
                </p></Link>
                <Button
                    variant="outline"
                    size="icon"
                    className="size-4 md:size-6 shrink-0 rounded-sm"
                    style={{borderColor: "var(--destructive)"}}
                    onClick={handlePlayerDelete}
                    aria-label={`Remove ${player.player.firstname} ${player.player.lastname}`}
                >
                    <X className="size-2.5 md:size-3.5" color="var(--destructive)"/>
                </Button>
            </div>
        </TableHead>
    )
}

function ComparePlayersRow({playerList, reportValue, isMobile, hoveredReport, setHoveredReport}: ComparePlayersRowProps){
    const report = reports[reportValue]
    const isHovered = hoveredReport === reportValue

    const cellProps = {
        onMouseEnter: () => setHoveredReport(reportValue),
        onMouseLeave: () => setHoveredReport(null),
    }

    return (
        <TableRow key={reportValue} className="contents">
            <TableCell
                className={`whitespace-normal text-xs md:text-sm border-b transition-colors ${isHovered ? "bg-muted/50" : ""}`}
                {...cellProps}
            >
                {report.year} {report.season}
            </TableCell>
            {playerList.data.map((p, index) => {
                if (!p.player) return null

                const match = p.player.records.find((record) => record.recordyear === report.year && record.recordseason === report.season)

                return (
                    <TableCell
                        key={p.player.player.playerid + reportValue + index}
                        className={`whitespace-normal border-b transition-colors ${isHovered ? "bg-muted/50" : ""}`}
                        {...cellProps}
                    >
                        {match ?
                            <div className="flex flex-col">
                                <p className="text-center text-xs md:text-base font">{formatSalary(match.guaranteedcomp, isMobile)}</p>
                                <p className="text-center text-[10px] md:text-xs">{formatSalary(match.basesalary, isMobile)}</p>
                            </div>
                            : <div className="flex flex-col">
                                <p className="text-center text-xs md:text-base font text-muted-foreground">---</p>
                                <p className="text-center text-[10px] md:text-xs invisible">---</p>
                            </div>
                        }
                    </TableCell>
                )
            })}
        </TableRow>
    )
}

function formatSalary(value: number, isMobile: boolean){
    return isMobile ? formatCompactCurrency(value) : `$${value.toLocaleString()}`
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

