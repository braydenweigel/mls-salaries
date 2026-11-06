import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { reports, POSITION_LABELS } from "@/lib/globals";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import records from "@/lib/data/records.json";
import clubsData from "@/lib/data/clubs.json";
import type { PlayerRecord, Club } from "@/lib/data/types";
import { filterRecordsByReport } from "@/lib/data/filters";
import { formatCompactCurrency } from "@/lib/utils";
import ReportPositionTable, { PositionRow } from "./_components/ReportPositionTable";

const POSITION_ORDER = ["GK", "D", "D-M", "M-D", "M", "M-F", "F-M", "F"];

function getInitials(name: string){
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function median(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function summarize(playerRecords: PlayerRecord[]){
    const players = playerRecords.length;
    const totalGuar = playerRecords.reduce((sum, r) => sum + r.guaranteedcomp, 0);
    const totalBase = playerRecords.reduce((sum, r) => sum + r.basesalary, 0);

    return {
        players,
        totalGuar,
        totalBase,
        avgGuar: players ? totalGuar / players : 0,
        avgBase: players ? totalBase / players : 0,
        medianGuar: median(playerRecords.map((r) => r.guaranteedcomp)),
        medianBase: median(playerRecords.map((r) => r.basesalary)),
    };
}

const reportKeysByDate = Object.keys(reports).sort((a, b) => Number(a) - Number(b));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const report = reports[id];

    return report
        ? { title: `${report.year} ${report.season} Report - MLS Salaries` }
        : { title: "Report Not Found - MLS Salaries" };
}

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const report = reports[id];

    if (!report) notFound();

    const clubsList = clubsData as Club[];
    const clubsMap = new Map(clubsList.map((club) => [club.clubid, club]));

    const reportIndex = reportKeysByDate.indexOf(id);
    const previousReportKey = reportIndex > 0 ? reportKeysByDate[reportIndex - 1] : null;
    const nextReportKey = reportIndex >= 0 && reportIndex < reportKeysByDate.length - 1 ? reportKeysByDate[reportIndex + 1] : null;
    const isLatest = nextReportKey === null;

    const playerRecords = filterRecordsByReport(records as PlayerRecord[], report.year, report.season);
    const totals = summarize(playerRecords);

    const presentPositions = new Set(playerRecords.map((r) => r.position));
    const positionKeys = POSITION_ORDER.filter((key) => presentPositions.has(key));
    const positionRows: PositionRow[] = positionKeys.map((key) => {
        const groupRecords = playerRecords.filter((r) => r.position === key);
        const summary = summarize(groupRecords);

        return { key, label: POSITION_LABELS[key] ?? key, ...summary };
    });
    const allPositionsRow: PositionRow = { key: "", label: "All positions", ...totals };

    const highestPaidPlayers = [...playerRecords]
        .sort((a, b) => b.guaranteedcomp - a.guaranteedcomp)
        .slice(0, 5);

    const clubTotals = new Map<string, number>();
    for (const record of playerRecords){
        clubTotals.set(record.club, (clubTotals.get(record.club) ?? 0) + record.guaranteedcomp);
    }
    const highestPayrolls = [...clubTotals.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    const maxPayroll = highestPayrolls.length ? highestPayrolls[0][1] : 0;

    return (
        <div>
            <div className="flex md:hidden items-center gap-1 text-sm font-medium text-muted-foreground mb-3">
                <Link href="/reports" className="flex items-center gap-0.5 hover:text-foreground">
                    <ChevronLeft className="size-4"/>
                    Reports
                </Link>
            </div>
            <div className="hidden shrink-0 md:flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                <Link href="/reports" className="hover:underline">Reports</Link>
                <span>/</span>
                <span className="text-foreground">{report.year} {report.season}</span>
            </div>

            <div className="flex items-start gap-2 mb-6">
                <Button variant="outline" size="icon" className="shrink-0" disabled={!previousReportKey} asChild={!!previousReportKey}>
                    {previousReportKey
                        ? <Link href={`/reports/${previousReportKey}`} aria-label="Previous report"><ChevronLeft/></Link>
                        : <ChevronLeft/>
                    }
                </Button>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl md:text-2xl font-bold">{report.year} {report.season} report</h1>
                        {isLatest && <Badge className="bg-green-600 text-white border-transparent">Latest</Badge>}
                    </div>
                </div>
                <Button variant="outline" size="icon" className="shrink-0" disabled={!nextReportKey} asChild={!!nextReportKey}>
                    {nextReportKey
                        ? <Link href={`/reports/${nextReportKey}`} aria-label="Next report"><ChevronRight/></Link>
                        : <ChevronRight/>
                    }
                </Button>
            </div>

            <div className="sm:hidden rounded-lg border divide-y">
                <SummaryRow label="Totals" guar={totals.totalGuar} base={totals.totalBase}/>
                <PlayersSummaryRow players={totals.players}/>
                <SummaryRow label="Average per player" guar={totals.avgGuar} base={totals.avgBase}/>
                <SummaryRow label="Median player" guar={totals.medianGuar} base={totals.medianBase}/>
            </div>

            <div className="hidden sm:grid gap-4 sm:grid-cols-4">
                <Card className="gap-3 py-4">
                    <CardHeader>
                        <CardTitle className="text-base">Totals</CardTitle>
                        <CardDescription>Guaranteed comp.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <p className="text-xl font-bold">${Math.round(totals.totalGuar).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                            Base <span className="font-medium text-foreground">${Math.round(totals.totalBase).toLocaleString()}</span>
                        </p>
                    </CardContent>
                </Card>
                <Card className="gap-3 py-4">
                    <CardHeader>
                        <CardTitle className="text-base">Players</CardTitle>
                        <CardDescription>In this release</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <p className="text-xl font-bold">{totals.players.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Across all positions</p>
                    </CardContent>
                </Card>
                <Card className="gap-3 py-4">
                    <CardHeader>
                        <CardTitle className="text-base">Average per player</CardTitle>
                        <CardDescription>Guaranteed comp.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <p className="text-xl font-bold">${Math.round(totals.avgGuar).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                            Base <span className="font-medium text-foreground">${Math.round(totals.avgBase).toLocaleString()}</span>
                        </p>
                    </CardContent>
                </Card>
                <Card className="gap-3 py-4">
                    <CardHeader>
                        <CardTitle className="text-base">Median player</CardTitle>
                        <CardDescription>Guaranteed comp.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <p className="text-xl font-bold">${Math.round(totals.medianGuar).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                            Base <span className="font-medium text-foreground">${Math.round(totals.medianBase).toLocaleString()}</span>
                        </p>
                    </CardContent>
                </Card>
            </div>

            <ReportPositionTable rows={positionRows} allPositions={allPositionsRow}/>

            <div className="my-4 grid gap-4 md:grid-cols-2">
                <Card className="min-w-0">
                    <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <CardTitle className="text-xl">Highest-paid players</CardTitle>
                        <CardDescription>Guaranteed comp.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col">
                        {highestPaidPlayers.map((player, index) => {
                            const club = clubsMap.get(player.club);
                            const positionLabel = POSITION_LABELS[player.position] ?? player.position;

                            return (
                                <div key={player.id} className="flex h-14 items-center gap-3">
                                    <span className="w-4 shrink-0 text-sm text-muted-foreground">{index + 1}</span>
                                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                                        {getInitials(`${player.firstname} ${player.lastname}`)}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <Link href={`/players/${player.playerid}`} className="font-semibold text-sm hover:underline">
                                            {player.firstname} {player.lastname}
                                        </Link>
                                        <p className="truncate text-xs text-muted-foreground">
                                            {club?.clubname ?? player.club} · {positionLabel}
                                        </p>
                                    </div>
                                    <span className="shrink-0 text-sm font-semibold">${player.guaranteedcomp.toLocaleString()}</span>
                                </div>
                            );
                        })}
                        <Button variant="outline" className="w-full mt-2" asChild>
                            <Link href={`/players?year=${id}`}>
                                See all players in {report.year} {report.season}
                                <ArrowRight className="size-4"/>
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="min-w-0">
                    <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <CardTitle className="text-xl">Highest club payrolls</CardTitle>
                        <CardDescription>Total guaranteed comp.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col">
                        {highestPayrolls.map(([clubid, total], index) => {
                            const club = clubsMap.get(clubid);
                            const widthPercent = maxPayroll ? (total / maxPayroll) * 100 : 0;

                            return (
                                <div key={clubid} className="flex h-14 items-center gap-3">
                                    <span className="w-4 shrink-0 text-sm text-muted-foreground">{index + 1}</span>
                                    <div className="min-w-0 flex-1">
                                        <Link href={`/clubs/${clubid}?year=${id}`} className="text-sm font-semibold hover:underline">
                                            {club?.clubname ?? clubid}
                                        </Link>
                                        <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                                            <div
                                                className="h-1.5 rounded-full bg-primary"
                                                style={{ width: `${widthPercent}%`, backgroundColor: club?.colorprimary }}
                                            />
                                        </div>
                                    </div>
                                    <span className="shrink-0 text-sm font-semibold">${Math.round(total).toLocaleString()}</span>
                                </div>
                            );
                        })}
                        <Button variant="outline" className="w-full mt-2" asChild>
                            <Link href={`/clubs?year=${id}`}>
                                See all clubs in {report.year} {report.season}
                                <ArrowRight className="size-4"/>
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <p className="my-4 text-xs text-muted-foreground">
                Guaranteed compensation is base salary plus signing and guaranteed bonuses, annualized over the contract. Medians are the middle player when sorted by pay. Source: MLS Players Association.
            </p>
        </div>
    );
}

function SummaryRow({ label, guar, base }: { label: string, guar: number, base: number }){
    return (
        <div className="flex items-center justify-between gap-3 px-4 py-3">
            <p className="text-sm font-semibold">{label}</p>
            <div className="shrink-0 text-right">
                <p className="text-base font-bold">{formatCompactCurrency(Math.round(guar))}</p>
                <p className="text-xs text-muted-foreground">Base {formatCompactCurrency(Math.round(base))}</p>
            </div>
        </div>
    );
}

function PlayersSummaryRow({ players }: { players: number }){
    return (
        <div className="flex items-center justify-between gap-3 px-4 py-3">
            <p className="text-sm font-semibold">Players</p>
            <p className="shrink-0 text-base font-bold">{players.toLocaleString()}</p>
        </div>
    );
}
