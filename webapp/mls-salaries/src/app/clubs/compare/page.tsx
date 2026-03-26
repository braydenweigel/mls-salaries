"use client"

import { Club, PlayerRecord } from "@/lib/data/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AddClubsDialog from "./_components/add-clubs-dialog";
import CompareClubsHeader from "./_components/compare-clubs-header";
import CompareClubsTable from "./_components/compare-clubs-table";

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
  {stackID: "d", club: ClubData | null}],
  numClubs: number
}

export const initialClubList: ClubList = {
  data: [{stackID: "a", club: null},
  {stackID: "b", club: null},
  {stackID: "c", club: null},
  {stackID: "d", club: null}],
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
      {clubList.numClubs > 0 ? <Card className="flex flex-col w-full min-h-0 h-[70vh]">
        <div className="flex flex-row w-full justify-around border-b-1 pb-2">
          {clubList.data.map((club) => (
            club.club ? <CompareClubsHeader key={club.stackID} clubList={clubList} setClubList={setClubList} club={club.club} id={club.stackID}/> : null
          ))}
        </div>
        <CompareClubsTable clubList={clubList}/>
      </Card> : null}
      {clubList.numClubs > 0 ? <Card>

      </Card> : null }
    </div>
  );
  }