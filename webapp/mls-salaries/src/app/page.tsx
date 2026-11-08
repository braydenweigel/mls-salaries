import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import records from "@/lib/data/records.json";
import clubsData from "@/lib/data/clubs.json";
import type { PlayerRecord, Club } from "@/lib/data/types";
import { filterRecordsByReport, filterRecordsByPlayerID } from "@/lib/data/filters";
import { CURRENT_YEAR, reports, POSITION_LABELS } from "@/lib/globals";
import HeroSearch from "./_components/HeroSearch";
import MiniPlayerChart from "./_components/MiniPlayerChart";
import MiniComparePlayersChart from "./_components/MiniComparePlayersChart";
import MiniClubBarChart from "./_components/MiniClubBarChart";
import MiniCompareClubsChart from "./_components/MiniCompareClubsChart";

const POSITION_GROUPS = [
  { key: "F", label: "Forwards" },
  { key: "M", label: "Midfielders" },
  { key: "D", label: "Defenders" },
  { key: "GK", label: "Goalkeepers" },
];

const EXAMPLE_PLAYER_ID = "DcH4r4"; // Diego Chara
const EXAMPLE_COMPARE_PLAYER_IDS = [
  { id: "DcH4r4", key: "chara" },   // Diego Chara
  { id: "5kpuwp", key: "fagundez" }, // Diego Fagundez
  { id: "KNi915", key: "rossi" },   // Diego Rossi
];
const EXAMPLE_CLUB_ID = "POR"; // Portland Timbers
const EXAMPLE_COMPARE_CLUB_IDS = ["POR", "SEA", "CIN", "CLB"];
const COMPARE_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

function formatCompactCurrency(value: number): string {
  return `$${Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(Math.round(value))}`;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function getInitials(name: string){
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const metadata: Metadata = {
  title: "Home - MLS Salaries",
};

export default function Home() {
  const allRecords = records as PlayerRecord[];
  const allClubs = clubsData as Club[];
  const clubsMap = new Map(allClubs.map((c) => [c.clubid, c]));

  const reportYears = Object.values(reports).map((r) => Number(r.year));
  const firstYear = Math.min(...reportYears);

  const reportKeysByDate = Object.keys(reports).sort((a, b) => Number(a) - Number(b));
  const latestReportKey = CURRENT_YEAR;
  const latestReport = reports[latestReportKey];

  const latestRecords = filterRecordsByReport(allRecords, latestReport.year, latestReport.season);

  const topPlayers = [...latestRecords].sort((a, b) => b.guaranteedcomp - a.guaranteedcomp).slice(0, 5);
  const highestPaid = topPlayers[0];

  const clubTotalsMap = new Map<string, number>();
  for (const r of latestRecords) clubTotalsMap.set(r.club, (clubTotalsMap.get(r.club) ?? 0) + r.guaranteedcomp);
  const topClubs = [...clubTotalsMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxClubTotal = topClubs.length ? topClubs[0][1] : 0;

  const totalGuar = latestRecords.reduce((sum, r) => sum + r.guaranteedcomp, 0);
  const avgGuar = latestRecords.length ? totalGuar / latestRecords.length : 0;
  const medGuar = median(latestRecords.map((r) => r.guaranteedcomp));

  const positionSummary = POSITION_GROUPS.map((group) => {
    const recs = latestRecords.filter((r) => r.position.split("-")[0] === group.key);
    const count = recs.length;
    const avg = count ? recs.reduce((sum, r) => sum + r.guaranteedcomp, 0) / count : 0;
    const med = median(recs.map((r) => r.guaranteedcomp));
    return { ...group, avg, med };
  });

  const recentReportKeys = [...reportKeysByDate].reverse().slice(0, 6);

  // Player history example
  const examplePlayerRecords = filterRecordsByPlayerID(allRecords, EXAMPLE_PLAYER_ID)
    .slice()
    .sort((a, b) => {
      const ka = reportKeysByDate.findIndex((k) => reports[k].year === a.recordyear && reports[k].season === a.recordseason);
      const kb = reportKeysByDate.findIndex((k) => reports[k].year === b.recordyear && reports[k].season === b.recordseason);
      return ka - kb;
    });
  const exampleFirst = examplePlayerRecords[0];
  const exampleLatest = examplePlayerRecords[examplePlayerRecords.length - 1];
  const exampleClub = exampleLatest ? clubsMap.get(exampleLatest.club) : undefined;
  const exampleMultiplier = exampleFirst && exampleFirst.guaranteedcomp
    ? exampleLatest.guaranteedcomp / exampleFirst.guaranteedcomp
    : 0;
  const examplePlayerChartData = examplePlayerRecords.map((r) => ({
    report: `${r.recordyear}-${r.recordseason}`,
    guaranteedComp: r.guaranteedcomp,
  }));

  // Compare players example
  const compareSeries = EXAMPLE_COMPARE_PLAYER_IDS.map((p, index) => ({ key: p.key, color: COMPARE_COLORS[index] }));
  const comparePlayersData = EXAMPLE_COMPARE_PLAYER_IDS.map((p) => {
    const recs = filterRecordsByPlayerID(allRecords, p.id);
    const latest = recs[0];
    return { ...p, name: latest ? `${latest.firstname} ${latest.lastname}` : p.id, records: recs };
  });
  const compareReportKeySet = new Set<string>();
  for (const p of comparePlayersData){
    for (const r of p.records) compareReportKeySet.add(`${r.recordyear}-${r.recordseason}`);
  }
  const compareReportKeysSorted = reportKeysByDate
    .map((k) => `${reports[k].year}-${reports[k].season}`)
    .filter((k) => compareReportKeySet.has(k));
  const compareChartData = compareReportKeysSorted.map((reportKey) => {
    const [year, season] = reportKey.split("-");
    const row: Record<string, number | string> = { report: reportKey };
    for (const p of comparePlayersData){
      const match = p.records.find((r) => r.recordyear === year && r.recordseason === season);
      if (match) row[p.key] = match.guaranteedcomp;
    }
    return row;
  });

  // Club roster example
  const exampleClubInfo = clubsMap.get(EXAMPLE_CLUB_ID);
  const exampleClubRecords = latestRecords.filter((r) => r.club === EXAMPLE_CLUB_ID);
  const exampleClubTotal = exampleClubRecords.reduce((sum, r) => sum + r.guaranteedcomp, 0);
  const exampleClubSortedDesc = [...exampleClubRecords].sort((a, b) => b.guaranteedcomp - a.guaranteedcomp);
  const top2Share = exampleClubTotal
    ? Math.round((exampleClubSortedDesc.slice(0, 2).reduce((sum, r) => sum + r.guaranteedcomp, 0) / exampleClubTotal) * 100)
    : 0;
  const exampleClubChartData = [...exampleClubRecords]
    .sort((a, b) => a.guaranteedcomp - b.guaranteedcomp)
    .map((r) => ({ player: r.id, value: r.guaranteedcomp }));

  // Compare clubs example
  const compareClubsSeries = EXAMPLE_COMPARE_CLUB_IDS.map((id) => ({ key: id, color: clubsMap.get(id)?.colorprimary ?? "var(--primary)" }));
  const compareClubsTop5: Record<string, number[]> = {};
  for (const clubId of EXAMPLE_COMPARE_CLUB_IDS){
    compareClubsTop5[clubId] = latestRecords
      .filter((r) => r.club === clubId)
      .map((r) => r.guaranteedcomp)
      .sort((a, b) => b - a)
      .slice(0, 5);
  }
  const compareClubsChartData = [4, 3, 2, 1, 0].map((i) => {
    const row: Record<string, number | string> = { rank: `#${i + 1}` };
    for (const clubId of EXAMPLE_COMPARE_CLUB_IDS){
      if (compareClubsTop5[clubId][i] !== undefined) row[clubId] = compareClubsTop5[clubId][i];
    }
    return row;
  });

  return (
    <div className="space-y-16 pb-16">
      <section className="pt-6">
        <Link href={`/reports/${latestReportKey}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <Badge className="border-transparent bg-foreground text-background">New</Badge>
          {latestReport.season} {latestReport.year} salary report is live
          <ArrowRight className="size-3.5"/>
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Every MLS salary since {firstYear}, searchable and comparable.
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Base salary and guaranteed compensation for every rostered player, from every MLS Players Association report. Look up a player, dig into a club&apos;s payroll, or put them side by side.
            </p>
            <div className="mt-6">
              <HeroSearch/>
            </div>
          </div>

          <div className="divide-y rounded-xl border">
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <span className="text-sm text-muted-foreground">Highest paid</span>
              <div className="text-right">
                <Link href={`/players/${highestPaid.playerid}`} className="text-sm font-semibold hover:underline">{highestPaid.firstname} {highestPaid.lastname}</Link>
                <p className="text-xs text-muted-foreground">${highestPaid.guaranteedcomp.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <span className="text-sm text-muted-foreground">Latest report</span>
              <Link href={`/reports/${latestReportKey}`} className="text-sm font-semibold hover:underline">{latestReport.season} {latestReport.year}</Link>
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <span className="text-sm text-muted-foreground">History</span>
              <span className="text-sm font-semibold">{firstYear} &ndash; today</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-bold">Players</h2>
          <Link href="/players" className="text-sm hover:underline">Browse all players &rarr;</Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <PreviewCard
            path="/players"
            title="Salary table"
            description="Every player in a report, filterable by name, club and position."
            footerHref={`/players?year=${latestReportKey}`}
            footerLabel="See the full table"
          >
            <div className="divide-y rounded-lg border bg-muted/40">
              {topPlayers.map((p, index) => (
                <div key={p.id} className="flex items-center justify-between gap-2 px-2 py-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="w-3 shrink-0 text-xs text-muted-foreground">{index + 1}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-tight">{p.firstname} {p.lastname}</p>
                      <p className="truncate text-xs text-muted-foreground">{clubsMap.get(p.club)?.clubname ?? p.club}</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-semibold">${p.guaranteedcomp.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </PreviewCard>

          <PreviewCard
            path={`/players/${EXAMPLE_PLAYER_ID}`}
            title="Player history"
            description="A player's pay across every report they appear in."
            footerHref={`/players/${EXAMPLE_PLAYER_ID}`}
            footerLabel="View an individual player"
          >
            <div className="rounded-lg border bg-muted/40 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: exampleClub?.colorprimary ?? "var(--primary)" }}
                  >
                    {getInitials(`${exampleLatest.firstname} ${exampleLatest.lastname}`)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-tight">{exampleLatest.firstname} {exampleLatest.lastname}</p>
                    <p className="truncate text-xs text-muted-foreground">{exampleClub?.clubname ?? exampleLatest.club} &middot; {POSITION_LABELS[exampleLatest.position] ?? exampleLatest.position}</p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold">${exampleLatest.guaranteedcomp.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{exampleMultiplier.toFixed(1)}&times; since {exampleFirst.recordyear}</p>
                </div>
              </div>
              <div className="mt-3 h-28">
                <MiniPlayerChart data={examplePlayerChartData} color={exampleClub?.colorprimary ?? "var(--primary)"}/>
              </div>
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>{exampleFirst.recordseason} {exampleFirst.recordyear}</span>
                <span>{exampleLatest.recordseason} {exampleLatest.recordyear}</span>
              </div>
            </div>
          </PreviewCard>

          <PreviewCard
            path="/players/compare"
            title="Compare players"
            description="Chart up to four players' salaries against each other over time."
            footerHref="/players/compare"
            footerLabel="Start comparing"
          >
            <div className="rounded-lg border bg-muted/40 p-3">
              <div className="mb-2 flex flex-wrap gap-3">
                {comparePlayersData.map((p, index) => (
                  <span key={p.id} className="flex items-center gap-1.5 text-xs">
                    <span className="size-2 rounded-full" style={{ backgroundColor: COMPARE_COLORS[index] }}/>
                    {p.name}
                  </span>
                ))}
              </div>
              <div className="h-28">
                <MiniComparePlayersChart data={compareChartData} series={compareSeries}/>
              </div>
            </div>
          </PreviewCard>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-bold">Clubs</h2>
          <Link href="/clubs" className="text-sm hover:underline">Browse all clubs &rarr;</Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <PreviewCard
            path="/clubs"
            title="Club payrolls"
            description="Every club's total guaranteed comp. for a report, ranked."
            footerHref={`/clubs?year=${latestReportKey}`}
            footerLabel="See every club"
          >
            <div className="space-y-3 rounded-lg border bg-muted/40 p-3">
              {topClubs.map(([clubId, total]) => {
                const club = clubsMap.get(clubId);
                const widthPercent = maxClubTotal ? (total / maxClubTotal) * 100 : 0;
                return (
                  <div key={clubId}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{club?.clubname ?? clubId}</span>
                      <span className="font-semibold">${Math.round(total).toLocaleString()}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-background">
                      <div className="h-1.5 rounded-full" style={{ width: `${widthPercent}%`, backgroundColor: club?.colorprimary ?? "var(--primary)" }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </PreviewCard>

          <PreviewCard
            path={`/clubs/${EXAMPLE_CLUB_ID}`}
            title="Club roster"
            description="How a club's payroll is split across its roster."
            footerHref={`/clubs/${EXAMPLE_CLUB_ID}`}
            footerLabel="View an individual club"
          >
            <div className="rounded-lg border bg-muted/40 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: exampleClubInfo?.colorprimary ?? "var(--primary)" }}
                  >
                    {EXAMPLE_CLUB_ID}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-tight">{exampleClubInfo?.clubname ?? EXAMPLE_CLUB_ID}</p>
                    <p className="text-xs text-muted-foreground">Top 2 earn {top2Share}%</p>
                  </div>
                </div>
                <span className="shrink-0 text-sm font-semibold">${Math.round(exampleClubTotal).toLocaleString()}</span>
              </div>
              <div className="mt-3 h-28">
                <MiniClubBarChart data={exampleClubChartData} color={exampleClubInfo?.colorprimary ?? "var(--primary)"}/>
              </div>
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>Lowest paid</span>
                <span>Highest paid</span>
              </div>
            </div>
          </PreviewCard>

          <PreviewCard
            path="/clubs/compare"
            title="Compare clubs"
            description="Line up four payrolls and their top earners, rank by rank."
            footerHref="/clubs/compare"
            footerLabel="Start comparing"
          >
            <div className="rounded-lg border bg-muted/40 p-3">
              <div className="mb-2 flex flex-wrap gap-3">
                {EXAMPLE_COMPARE_CLUB_IDS.map((clubId) => (
                  <span key={clubId} className="flex items-center gap-1.5 text-xs">
                    <span className="size-2 rounded-full" style={{ backgroundColor: clubsMap.get(clubId)?.colorprimary ?? "var(--primary)" }}/>
                    {clubId}
                  </span>
                ))}
              </div>
              <div className="h-28">
                <MiniCompareClubsChart data={compareClubsChartData} series={compareClubsSeries}/>
              </div>
            </div>
          </PreviewCard>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-bold">Reports</h2>
          <Link href="/reports" className="text-sm hover:underline">Browse all reports &rarr;</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <PreviewCard
            path={`/reports/${latestReportKey}`}
            title="Report summary"
            description="League totals, averages and medians for one report, broken down by position."
            footerHref={`/reports/${latestReportKey}`}
            footerLabel="Read the latest report"
          >
            <div className="rounded-lg border bg-muted/40 p-3">
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-semibold">{latestReport.season} {latestReport.year}</span>
                <Badge className="border-transparent bg-green-600 text-white">Latest</Badge>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded-md border bg-background p-2">
                  <p className="flex min-h-8 items-start text-xs text-muted-foreground">Total guaranteed</p>
                  <p className="text-sm font-semibold">{formatCompactCurrency(totalGuar)}</p>
                </div>
                <div className="rounded-md border bg-background p-2">
                  <p className="flex min-h-8 items-start text-xs text-muted-foreground">Average</p>
                  <p className="text-sm font-semibold">{formatCompactCurrency(avgGuar)}</p>
                </div>
                <div className="rounded-md border bg-background p-2">
                  <p className="flex min-h-8 items-start text-xs text-muted-foreground">Median</p>
                  <p className="text-sm font-semibold">{formatCompactCurrency(medGuar)}</p>
                </div>
              </div>

              <div className="mt-3 divide-y">
                {positionSummary.map((p) => (
                  <div key={p.key} className="flex items-center justify-between gap-2 py-1.5 text-sm">
                    <span className="flex items-center gap-2">
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-background px-1 text-[10px] font-semibold">{p.key}</span>
                      {p.label}
                    </span>
                    <span className="flex flex-wrap justify-end gap-x-2 text-xs text-muted-foreground">
                      <span className="whitespace-nowrap">avg ${Math.round(p.avg).toLocaleString()}</span>
                      <span className="whitespace-nowrap">median ${Math.round(p.med).toLocaleString()}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </PreviewCard>

          <PreviewCard
            path="/reports"
            title="Every report"
            description={`Each MLSPA salary report since ${firstYear}, newest first.`}
            footerHref="/reports"
            footerLabel="Browse all reports"
          >
            <div className="divide-y rounded-lg border bg-muted/40">
              {recentReportKeys.map((key, index) => (
                <Link key={key} href={`/reports/${key}`} className="flex items-center justify-between gap-2 px-3 py-2 hover:bg-background">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <span className={`size-1.5 rounded-full ${index === 0 ? "bg-green-600" : "bg-muted-foreground"}`}/>
                    {reports[key].season} {reports[key].year}
                  </span>
                  {index === 0 && <span className="text-xs text-muted-foreground">Latest</span>}
                </Link>
              ))}
              <p className="px-3 py-2 text-xs text-muted-foreground">&hellip; and every report back to {firstYear}</p>
            </div>
          </PreviewCard>
        </div>
      </section>
    </div>
  );
}

function PreviewCard({ path, title, description, footerHref, footerLabel, children }: {
  path: string
  title: string
  description: string
  footerHref: string
  footerLabel: string
  children: ReactNode
}){
  return (
    <Card className="h-full gap-3 py-4">
      <CardHeader className="gap-1 px-4">
        <p className="font-mono text-xs text-muted-foreground">{path}</p>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-4">{children}</CardContent>
      <CardFooter className="mt-auto border-t px-4">
        <Link href={footerHref} className="text-sm hover:underline">{footerLabel} &rarr;</Link>
      </CardFooter>
    </Card>
  );
}
