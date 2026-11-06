import { ClubReportsSelector, PlayerReportSelector } from "@/components/lib/report-selectors";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";
import { reports } from "@/lib/globals";

export const metadata: Metadata = {
  title: "Home - MLS Salaries",
};

export default function Home() {
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
