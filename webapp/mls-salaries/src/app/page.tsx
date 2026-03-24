import { ClubReportsSelector, PlayerReportSelector } from "@/components/lib/report-selectors";
import { Field, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
    title: "Home - MLS Salaries"
}

export default function Home() {
  return (
   <div className="">
    <h1 className="text-center text-4xl font-extrabold">Welcome to mlssalaries.fyi</h1>
    <h1 className="text-center text-xl font-semibold">View MLS salaries from 2007 - 2025</h1>
    <div className="mt-6 space-x-2 content-center">
      <div className="justify-between">
        <Field>
          <FieldLabel className="text-xl font-semibold">Player salaries by year</FieldLabel>
          <PlayerReportSelector/>
        </Field>
        <div className="mt-2">
          <h4 className="text-lg font-medium">View an individual player&apos;s salaries:</h4>
          <h5 className="text-base italic">
            Suggested: <Link href="/players/f5LSPK" className="hover:underline">Lionel Messi</Link> • <Link href="/players/DcH4r4" className="hover:underline">Diego Chara</Link> • <Link href="/players/RshFkO" className="hover:underline">Darlington Nagbe</Link>
          </h5>
        </div>
      </div>
      <FieldSeparator className="my-4"/>
    </div>
    <div className="space-x-2 content-center">
      <div className="justify-between">
        <Field>
          <FieldLabel className="text-xl font-semibold">Club salaries by year</FieldLabel>
          <ClubReportsSelector/>
        </Field>
        <div className="mt-2">
          <h4 className="text-lg font-medium">View an individual club&apos;s salaries:</h4>
          <h5 className="text-base italic">
            Suggested: <Link href="/clubs/MIA" className="hover:underline">Inter Miami</Link> • <Link href="/clubs/LA" className="hover:underline">LA Galaxy</Link> • <Link href="/clubs/POR" className="hover:underline">Portland Timbers</Link>
          </h5>
        </div>
      </div>
      <FieldSeparator className="my-4"/>
    </div>

   </div>
    
  );
}
