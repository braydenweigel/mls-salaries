import { ClubReportsSelector, PlayerReportSelector } from "@/components/lib/report-selectors";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import records from "@/lib/data/records.json";
import clubsData from "@/lib/data/clubs.json";
import type { PlayerRecord, Club } from "@/lib/data/types";
import { filterRecordsByReport } from "@/lib/data/filters";
import { CURRENT_YEAR, reports, clubs as clubsObject } from "@/lib/globals";
import { isValidClub } from "@/lib/storeUtils";

export const metadata: Metadata = {
  title: "Home - MLS Salaries",
};

export default function Home() {
  const { year, season } = reports[CURRENT_YEAR];
  const playerRecords = filterRecordsByReport(records as PlayerRecord[], year, season);
  const allClubs = clubsData as Club[];

  const uniquePlayerCount = new Set(playerRecords.map((r) => r.playerid)).size;
  const uniqueClubCount = new Set(playerRecords.map((r) => r.club)).size;

  let topPlayer: PlayerRecord | null = null;
  for (const record of playerRecords) {
    if (!topPlayer || record.guaranteedcomp > topPlayer.guaranteedcomp) {
      topPlayer = record;
    }
  }
  const topPlayerName = topPlayer ? [topPlayer.firstname, topPlayer.lastname].filter(Boolean).join(" ") : ""
  const topPlayerClub = topPlayer ? isValidClub(allClubs, topPlayer.club) : null

  const clubTotals = structuredClone(clubsObject);
  for (const record of playerRecords) {
    clubTotals[record.club].totalGuarComp += record.guaranteedcomp;
  }
  let topClubId: string | null = null;
  for (const id of Object.keys(clubTotals)) {
    if (!topClubId || clubTotals[id].totalGuarComp > clubTotals[topClubId].totalGuarComp) {
      topClubId = id;
    }
  }

  const reportYears = Object.values(reports).map((r) => Number(r.year));
  const firstYear = Math.min(...reportYears);
  const lastYear = Math.max(...reportYears);

  return (
    <div className="space-y-8 pb-8">
      <div className="pt-2 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">mlssalaries.fyi</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Explore MLS player and club salaries from {firstYear} to {lastYear}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Seasons of data</CardDescription>
            <CardTitle className="text-2xl">{firstYear}&ndash;{lastYear}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>{year} {season} players</CardDescription>
            <CardTitle className="text-2xl">{uniquePlayerCount.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            across {uniqueClubCount} clubs
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Top earner, {year} {season}</CardDescription>
            {topPlayer ? (
              <CardTitle className="text-2xl">
                <Link href={`/players/${topPlayer.playerid}`} className="hover:underline">{topPlayerName}</Link>
              </CardTitle>
            ) : (
              <CardTitle className="text-2xl">&mdash;</CardTitle>
            )}
          </CardHeader>
          {topPlayer && (
            <CardContent className="text-xs text-muted-foreground">
              ${topPlayer.guaranteedcomp.toLocaleString()}{topPlayerClub ? ` • ${topPlayerClub.clubname}` : ""}
            </CardContent>
          )}
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Highest payroll, {year} {season}</CardDescription>
            {topClubId ? (
              <CardTitle className="text-2xl">
                <Link href={`/clubs/${topClubId}`} className="hover:underline">{clubsObject[topClubId].clubName}</Link>
              </CardTitle>
            ) : (
              <CardTitle className="text-2xl">&mdash;</CardTitle>
            )}
          </CardHeader>
          {topClubId && (
            <CardContent className="text-xs text-muted-foreground">
              ${clubTotals[topClubId].totalGuarComp.toLocaleString()} guaranteed comp
            </CardContent>
          )}
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Player salaries by year</CardTitle>
            <CardDescription>Browse every player&apos;s guaranteed compensation for a season</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <PlayerReportSelector />
            <div>
              <h4 className="text-sm font-medium">View an individual player&apos;s salary history:</h4>
              <p className="text-sm italic text-muted-foreground">
                <Link href="/players/f5LSPK" className="hover:underline">Lionel Messi</Link> • <Link href="/players/DcH4r4" className="hover:underline">Diego Chara</Link> • <Link href="/players/RshFkO" className="hover:underline">Darlington Nagbe</Link>
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t">
            <Link href="/players/compare" className="text-sm hover:underline">Compare multiple players &rarr;</Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Club salaries by year</CardTitle>
            <CardDescription>Compare total payroll across MLS clubs for a season</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ClubReportsSelector />
            <div>
              <h4 className="text-sm font-medium">View an individual club&apos;s salary history:</h4>
              <p className="text-sm italic text-muted-foreground">
                <Link href="/clubs/MIA" className="hover:underline">Inter Miami</Link> • <Link href="/clubs/LA" className="hover:underline">LA Galaxy</Link> • <Link href="/clubs/POR" className="hover:underline">Portland Timbers</Link>
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t">
            <Link href="/clubs/compare" className="text-sm hover:underline">Compare multiple clubs &rarr;</Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
