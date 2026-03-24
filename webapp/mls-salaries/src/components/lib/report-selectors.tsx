"use client"

import { CURRENT_YEAR, reports } from "@/lib/globals";
import React from "react";
import { ButtonGroup } from "../ui/button-group";
import Link from "next/link";
import { Button } from "../ui/button";
import SelectReport from "./SelectReport";

export function PlayerReportSelector(){
    const [reportValuePlayers, setReportValuePlayers] = React.useState(CURRENT_YEAR)

    return (
        <ButtonGroup>
            <SelectReport onReportValueChange={(report) => setReportValuePlayers(report)} reports={reports} defaultReport={CURRENT_YEAR}/>
            <Button asChild><Link href={`/players?year=${reportValuePlayers}`}>Go</Link></Button>
        </ButtonGroup>
    )
}

export function ClubReportsSelector(){
    const [reportValueClubs, setReportValueClubs] = React.useState(CURRENT_YEAR)

    return (
        <ButtonGroup>
            <SelectReport onReportValueChange={(report) => setReportValueClubs(report)} reports={reports} defaultReport={CURRENT_YEAR}/>
            <Button asChild><Link href={`/clubs?year=${reportValueClubs}`}>Go</Link></Button>
        </ButtonGroup>
    )
}