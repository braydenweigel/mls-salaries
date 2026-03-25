"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Club, PlayerRecord } from "@/lib/data/types";
import clubs from "@/lib/data/clubs.json"
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SelectReport from "@/components/lib/SelectReport";
import { CURRENT_YEAR, reports } from "@/lib/globals";
import { Card } from "@/components/ui/card";
import AddClubsDialog from "./_components/add-clubs-dialog";

export type ClubData = {
  club: Club,
  reportValue: string
  players: PlayerRecord[]
  baseSalary: number,
  guarComp: number
}

export type ClubList = {
  data: [{stackID: "a", club: ClubData | null},
  {stackID: "b", club: ClubData | null},
  {stackID: "c", club: ClubData | null},
  {stackID: "d", club: ClubData | null},
  {stackID: "e", club: ClubData | null}],
  numClubs: number
}

export const initialClubList: ClubList = {
  data: [{stackID: "a", club: null},
  {stackID: "b", club: null},
  {stackID: "c", club: null},
  {stackID: "d", club: null},
  {stackID: "e", club: null}],
  numClubs: 0
}

export default function CompareClubs() {
  const [clubList, setClubList] = useState<ClubList>(initialClubList)
 
  const handleReset = () => {
    setClubList(initialClubList)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <AddClubsDialog clubList={clubList} setClubList={setClubList}/>
        <Button variant="destructive" onClick={handleReset}>Reset</Button>
      </div>
      <Card>
        {clubList.data.map((club) => (
          <p key={club.stackID}>{club.club ? club.club?.club.clubname + " " + club.club?.reportValue : ""}</p>
        ))}
      </Card>
      <Card></Card>
    </div>
  );
  }