"use client"

import { Button } from "@/components/ui/button";
import { Player, PlayerRecord } from "@/lib/data/types";
import { useState } from "react";
import AddPlayersDialog from "./_components/add-players-dialog";
import { Card } from "@/components/ui/card";
import ComparePlayersTable from "./_components/compare-players-table";
import ComparePlayersChart from "./_components/compare-players-chart";
import { initialPlayerList } from "@/lib/players";

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
      {playerList.numPlayers > 0 && <Card className="hidden md:block">
        <ComparePlayersChart playerList={playerList}/>
      </Card>}
      
    </div>
    
  );
}