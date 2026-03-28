"use client"

import { Button } from "@/components/ui/button";
import { Player, PlayerRecord } from "@/lib/data/types";
import { CURRENT_YEAR } from "@/lib/globals";
import { useState } from "react";
import AddPlayersDialog from "./_components/add-players-dialog";
import { Card } from "@/components/ui/card";
import ComparePlayersHeader from "./_components/compare-players-table";
import ComparePlayersTable from "./_components/compare-players-table";

export type PlayerData = {
  player: Player,
  records: PlayerRecord[]
}

export type PlayerList = {
  data: [{stackID: "a", player: PlayerData | null},
  {stackID: "b", player: PlayerData | null},
  {stackID: "c", player: PlayerData | null},
  {stackID: "d", player: PlayerData | null}],
  numPlayers: number,
  min: string,
  max: string
}

export const initialPlayerList: PlayerList = {
  data: [{stackID: "a", player: null},
  {stackID: "b", player: null},
  {stackID: "c", player: null},
  {stackID: "d", player: null}],
  numPlayers: 0,
  min: CURRENT_YEAR,
  max: CURRENT_YEAR
}

export default function ComparePlayers() {
  const [playerList, setPlayerList] = useState<PlayerList>(initialPlayerList)
   
  const handleReset = () => {
    setPlayerList(initialPlayerList)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <AddPlayersDialog playerList={playerList} setPlayerList={setPlayerList}/>
        <Button variant="destructive" onClick={handleReset}>Reset</Button>
      </div>
      {playerList.numPlayers > 0 &&
      <Card className="flex flex-col w-full min-h-0 max-h-[70vh] overflow-x-hidden px-4">
        <ComparePlayersTable playerList={playerList} setPlayerList={setPlayerList}/>
      </Card>}
      
    </div>
    
  );
}