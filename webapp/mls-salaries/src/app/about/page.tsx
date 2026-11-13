import { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "About - MLS Salaries",
};

export default function About() {
  return (
    <div className="flex flex-col gap-6 pb-8 max-w-2xl">
      <div className="hidden shrink-0 md:flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span className="text-foreground">About</span>
      </div>
      <div className="shrink-0">
        <h1 className="text-3xl md:text-4xl font-extrabold">About</h1>
      </div>

      <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
        mlssalaries.fyi is a site to view and compare MLS player salaries and club payrolls. All data is sourced from MLS Players Association Salary Guides,
        which are released twice per season in the Spring and Fall. mlssalaries.fyi contains every Fall Salary Guide since 2007, and every Spring Salary guide since 2025.
      </p>

      <hr className="border-t"/>

      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">Data</h2>
        <Link
          href="https://www.kaggle.com/datasets/braydenweigel77/mls-salary-reports"
          target="_blank"
          className="flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          Collection of Reports
          <ExternalLink className="size-3.5 shrink-0"/>
        </Link>
        <Link
          href="https://www.kaggle.com/datasets/braydenweigel77/mlssalaries-fyi-data"
          target="_blank"
          className="flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          Dataset used for mlssalaries.fyi
          <ExternalLink className="size-3.5 shrink-0"/>
        </Link>
      </div>
    </div>
  );
}
