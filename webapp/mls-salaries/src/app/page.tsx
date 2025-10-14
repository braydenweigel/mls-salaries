"use client"

import SelectReport from "@/components/lib/SelectReport";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { CURRENT_YEAR, reports } from "@/lib/globals";
import Link from "next/link";
import React from "react";

export default function Home() {
  const [reportValuePlayers, setReportValuePlayers] = React.useState(CURRENT_YEAR)
  const [reportValueClubs, setReportValueClubs] = React.useState(CURRENT_YEAR)

  return (
   <div className="">
    <h1 className="text-center text-4xl font-extrabold">View MLS salaries from 2007 - 2025</h1>
    <div className="mt-6 space-x-2 content-center">
      <div className="justify-between">
        <Field>
          <FieldLabel className="text-xl font-semibold">Player salaries by year</FieldLabel>
          <ButtonGroup>
            <SelectReport onReportValueChange={(report) => setReportValuePlayers(report)} reports={reports} defaultReport={CURRENT_YEAR}/>
            <Button asChild><Link href={`/players?year=${reportValuePlayers}`}>Go</Link></Button>
          </ButtonGroup>
        </Field>
        <div className="mt-2">
          <h4 className="text-lg font-medium">View an individual player's salaries:</h4>
          <h5 className="text-base italic">
            Suggested: <Link href="/players" className="hover:underline">Lionel Messi</Link> • <Link href="/players" className="hover:underline">Diego Chara</Link> • <Link href="/players" className="hover:underline">Darlington Nagbe</Link>
          </h5>
        </div>
      </div>
      <FieldSeparator className="my-4"/>
    </div>
    <div className="space-x-2 content-center">
      <div className="justify-between">
        <Field>
          <FieldLabel className="text-xl font-semibold">Club salaries by year</FieldLabel>
          <ButtonGroup>
            <SelectReport onReportValueChange={(report) => setReportValueClubs(report)} reports={reports} defaultReport={CURRENT_YEAR}/>
            <Button asChild><Link href={`/clubs?year=${reportValueClubs}`}>Go</Link></Button>
          </ButtonGroup>
        </Field>
        <div className="mt-2">
          <h4 className="text-lg font-medium">View an individual club's salaries:</h4>
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
