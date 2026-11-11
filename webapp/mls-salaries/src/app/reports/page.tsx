import { Metadata } from "next";
import Link from "next/link";
import records from "@/lib/data/records.json";
import type { PlayerRecord } from "@/lib/data/types";
import { reports } from "@/lib/globals";
import LeagueSalaryChart from "../_components/LeagueSalaryChart";
import LeagueSalaryTable from "../_components/LeagueSalaryTable";
import LeagueAverageChart from "../_components/LeagueAverageChart";
import ReportsList from "../_components/ReportsList";

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export const metadata: Metadata = {
  title: "Reports - MLS Salaries",
};

export default function Reports() {
  const valuesByReport = new Map<string, { base: number[]; guar: number[] }>();
  for (const record of records as PlayerRecord[]) {
    const key = `${record.recordyear}-${record.recordseason}`;
    const entry = valuesByReport.get(key) ?? { base: [], guar: [] };
    entry.base.push(record.basesalary);
    entry.guar.push(record.guaranteedcomp);
    valuesByReport.set(key, entry);
  }

  const reportRows = Object.entries(reports)
    .map(([reportKey, { year: reportYear, season: reportSeason }]) => {
      const entry = valuesByReport.get(`${reportYear}-${reportSeason}`) ?? { base: [], guar: [] };
      const count = entry.base.length;
      const totalBase = entry.base.reduce((sum, v) => sum + v, 0);
      const totalGuar = entry.guar.reduce((sum, v) => sum + v, 0);

      return {
        reportKey,
        year: reportYear,
        season: reportSeason,
        totalBase,
        totalGuar,
        avgBase: count ? totalBase / count : 0,
        avgGuar: count ? totalGuar / count : 0,
        medianBase: median(entry.base),
        medianGuar: median(entry.guar),
      };
    })
    .sort((a, b) => Number(b.reportKey) - Number(a.reportKey));

  const chartData = reportRows
    .map((row) => ({
      report: row.reportKey,
      baseSalary: row.totalBase,
      guaranteedComp: row.totalGuar,
    }))
    .sort((a, b) => Number(a.report) - Number(b.report));

  const averageChartData = [...reportRows].sort((a, b) => Number(a.reportKey) - Number(b.reportKey));

  return (
    <div className="min-h-0 pb-8">
      <div className="hidden shrink-0 md:flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span className="text-foreground">Reports</span>
      </div>
      <div className="shrink-0 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">Reports</h1>
        <p className="hidden md:block text-sm text-muted-foreground mt-1">
          League-wide salary trends across every MLS report
        </p>
      </div>

      <LeagueSalaryTable rows={reportRows} />

      <LeagueSalaryChart data={chartData} />

      <LeagueAverageChart data={averageChartData} />

      <ReportsList rows={reportRows} />
    </div>
  );
}
