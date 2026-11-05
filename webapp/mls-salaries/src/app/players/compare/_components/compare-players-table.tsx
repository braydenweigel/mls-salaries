import { Dispatch, SetStateAction, useState } from "react"
import { PlayerList } from "../page"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { reports } from "@/lib/globals"
import { compareColors as colors } from "@/lib/compare-players-utils"
import { formatCompactCurrency } from "@/lib/utils"
import { ExportCsvButton } from "@/components/lib/ExportCsvButton"
import Link from "next/link"

type ComparePlayersTableProps = {
    playerList: PlayerList
}

type ComparePlayersRowProps = {
    playerList: PlayerList
    reportValue: string
    hoveredReport: string | null
    setHoveredReport: Dispatch<SetStateAction<string | null>>
}

const YEAR_COLUMN_WIDTH = 120
const PLAYER_COLUMN_MIN_WIDTH = 150

export default function ComparePlayersTable({playerList}: ComparePlayersTableProps){
    const [hoveredReport, setHoveredReport] = useState<string | null>(null)
    const reportsList = []

    for (const key in reports){
        if (Number(key) >= Number(playerList.min) && Number(key) <= Number(playerList.max)){
            reportsList.push(key)
        }
    }

    reportsList.sort((a, b) => Number(b) - Number(a))

    // Native table-layout: fixed rescales "fixed" columns based on content whenever
    // the table's own width is auto, so column sizing is driven by CSS Grid instead
    // (kept as a real <table> for accessibility, via display:contents on thead/tbody/tr).
    // minmax() lets player columns grow to fill leftover space but never shrink below
    // their minimum, overflowing (and scrolling) once there's no room left.
    const gridTemplateColumns = `${YEAR_COLUMN_WIDTH}px repeat(${playerList.numPlayers}, minmax(${PLAYER_COLUMN_MIN_WIDTH}px, 1fr))`
    const mobileGridTemplateColumns = `repeat(${playerList.numPlayers}, 1fr)`
    const exportData = reportsList.flatMap((reportValue) => {
        const report = reports[reportValue]

        return playerList.data.flatMap((p) => {
            if (!p.player) return []

            const match = p.player.records.find((record) => record.recordyear === report.year && record.recordseason === report.season)

            return [{
                report: `${report.year} ${report.season}`,
                player: `${p.player.records[0]?.firstname} ${p.player.records[0]?.lastname}`,
                guaranteedComp: match ? match.guaranteedcomp : null,
                baseSalary: match ? match.basesalary : null,
            }]
        })
    })
    const exportFilename = `Compare_${playerList.data
        .filter((p) => p.player)
        .map((p) => p.player!.records[0]?.lastname || p.player!.records[0]?.firstname)
        .join("_")}.csv`

    return (
        <Card className="flex flex-col w-full gap-3 border-0 shadow-none bg-transparent py-0 sm:min-h-0 sm:max-h-[70vh] sm:overflow-hidden sm:border sm:shadow-sm sm:bg-card sm:py-4">
            <div className="shrink-0 flex items-center justify-between gap-2 px-4 md:px-6">
                <p className="sm:hidden text-xs text-muted-foreground">Guaranteed · Base</p>
                <p className="hidden sm:block text-sm text-muted-foreground">Guaranteed comp., with base salary below</p>
                <ExportCsvButton
                    data={exportData}
                    columns={[
                        { key: "report", label: "Report" },
                        { key: "player", label: "Player" },
                        { key: "guaranteedComp", label: "Guaranteed Compensation" },
                        { key: "baseSalary", label: "Base Salary" },
                    ]}
                    filename={exportFilename}
                    buttonClassName="hidden sm:flex ml-auto"
                />
            </div>

            {/* mobile: grouped list, one full-width release heading per section with 3 colored value columns below */}
            <div className="sm:hidden">
                <div className="grid gap-x-2 px-4 pb-2 border-b" style={{ gridTemplateColumns: mobileGridTemplateColumns }}>
                    {playerList.data.map((p, index) => (
                        p.player && (
                            <div key={p.stackID} className="flex items-center gap-1.5 min-w-0">
                                <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: colors[index] }}/>
                                <span className="text-sm font-semibold truncate">{p.player.records[0]?.lastname || p.player.records[0]?.firstname}</span>
                            </div>
                        )
                    ))}
                </div>
                {reportsList.map((reportValue) => {
                    const report = reports[reportValue]

                    return (
                        <div key={reportValue} className="border-b px-4 py-3">
                            <p className="text-xs mb-2">{report.year} {report.season}</p>
                            <div className="grid gap-x-2" style={{ gridTemplateColumns: mobileGridTemplateColumns }}>
                                {playerList.data.map((p) => {
                                    if (!p.player) return null

                                    const match = p.player.records.find((record) => record.recordyear === report.year && record.recordseason === report.season)

                                    return (
                                        <div key={p.player.player.playerid}>
                                            {match ? (
                                                <>
                                                    <p className="text-sm font-bold">{formatCompactCurrency(match.guaranteedcomp)}</p>
                                                    <p className="text-xs text-muted-foreground">{formatCompactCurrency(match.basesalary)}</p>
                                                </>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">---</p>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* desktop: side-by-side table with a dedicated release column */}
            <div className="hidden sm:block min-h-0 overflow-auto">
                <Table className="px-4" style={{display: "grid", gridTemplateColumns}}>
                    <TableHeader className="contents">
                        <TableRow className="contents">
                            <TableHead className="p-0 whitespace-normal border-b">
                                <div className="flex h-full items-center px-2 py-1">Report</div>
                            </TableHead>
                            {playerList.data.map((p, index) => (
                                p.player ?
                                <ComparePlayersHeader
                                    key={p.stackID + p.player.player.playerid}
                                    player={p.player} color={colors[index]}/>
                                : null
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody className="contents">
                    {reportsList.map((report) => (
                        <ComparePlayersRow key={report} playerList={playerList} reportValue={report}
                            hoveredReport={hoveredReport} setHoveredReport={setHoveredReport}/>
                    ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    )
}

type ComparePlayersHeaderProps = {
    player: NonNullable<PlayerList["data"][number]["player"]>
    color: string
}

function ComparePlayersHeader({player, color}: ComparePlayersHeaderProps){
    return (
        <TableHead className="p-0 whitespace-normal align-top border-b">
            <div className="flex h-full items-center gap-1.5 rounded-md px-1 py-1">
                <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: color }}/>
                <Link href={`/players/${player.player.playerid}`}>
                    <p className="min-w-0 font-semibold wrap-break-word text-left text-base hover:underline">
                        {player.records[0]?.firstname} {player.records[0]?.lastname}
                    </p>
                </Link>
            </div>
        </TableHead>
    )
}

function ComparePlayersRow({playerList, reportValue, hoveredReport, setHoveredReport}: ComparePlayersRowProps){
    const report = reports[reportValue]
    const isHovered = hoveredReport === reportValue

    const cellProps = {
        onMouseEnter: () => setHoveredReport(reportValue),
        onMouseLeave: () => setHoveredReport(null),
    }

    return (
        <TableRow key={reportValue} className="contents">
            <TableCell
                className={`whitespace-normal text-sm py-4 border-b transition-colors ${isHovered ? "bg-muted/50" : ""}`}
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
                        className={`whitespace-normal py-4 border-b transition-colors ${isHovered ? "bg-muted/50" : ""}`}
                        {...cellProps}
                    >
                        {match ?
                            <div className="flex flex-col">
                                <p className="text-left text-base font-semibold">${match.guaranteedcomp.toLocaleString()}</p>
                                <p className="text-left text-xs text-muted-foreground">Base ${match.basesalary.toLocaleString()}</p>
                            </div>
                            : <div className="flex flex-col">
                                <p className="text-left text-base font-semibold text-muted-foreground">---</p>
                                <p className="text-left text-xs invisible">---</p>
                            </div>
                        }
                    </TableCell>
                )
            })}
        </TableRow>
    )
}
