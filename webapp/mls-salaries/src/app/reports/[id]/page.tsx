import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { reports } from "@/lib/globals";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const report = reports[id];

  return report
    ? { title: `${report.season} ${report.year} - MLS Salaries` }
    : { title: "Report Not Found - MLS Salaries" };
}

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = reports[id];

  if (!report) notFound();

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
        <span className="text-foreground">{report.season} {report.year}</span>
      </div>
      <h1 className="text-xl md:text-2xl font-bold">{report.season} {report.year}</h1>
    </div>
  );
}
