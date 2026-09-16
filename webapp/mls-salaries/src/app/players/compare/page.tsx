"use client"

import { Button } from "@/components/ui/button";
import { Player, PlayerRecord } from "@/lib/data/types";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AddPlayersDialog from "./_components/add-players-dialog";
import { Card } from "@/components/ui/card";
import ComparePlayersTable from "./_components/compare-players-table";
import ComparePlayersChart from "./_components/compare-players-chart";
import { initialPlayerList } from "@/lib/players";
import { buildPlayerListFromIds, getPlayerIdsFromList } from "@/lib/compare-players-utils";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Users } from "lucide-react";

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
  const router = useRouter()
  const searchParams = useSearchParams()

  const [playerList, setPlayerList] = useState<PlayerList>(() =>
    buildPlayerListFromIds(searchParams.get("players")?.split(",").filter(Boolean) ?? [])
  )
  const [addPlayersOpen, setAddPlayersOpen] = useState(false)
  const isInitialRender = useRef(true)

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }

    const ids = getPlayerIdsFromList(playerList)
    const params = new URLSearchParams(searchParams.toString())
    if (ids.length > 0) {
      params.set("players", ids.join(","))
    } else {
      params.delete("players")
    }

    const query = params.toString()
    router.replace(query ? `/players/compare?${query}` : "/players/compare", { scroll: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerList])

  const handleReset = () => {
    setPlayerList(initialPlayerList)
  }

  const isEmpty = playerList.numPlayers === 0

  return (
    <div className={`flex flex-col ${isEmpty ? "flex-1 min-h-0 items-center justify-center" : "gap-4"}`}>
      <div className={`flex items-center ${isEmpty ? "order-2 justify-center" : "order-1 justify-between"}`}>
        <AddPlayersDialog playerList={playerList} setPlayerList={setPlayerList} open={addPlayersOpen} setOpen={setAddPlayersOpen}/>
        {!isEmpty && <Button variant="destructive" onClick={handleReset}>Reset</Button>}
      </div>
      <div className={isEmpty ? "order-1" : "order-2"}>
        {isEmpty ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Users />
              </EmptyMedia>
              <EmptyTitle>No Players Added</EmptyTitle>
              <EmptyDescription>Add players to start comparing their stats.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex flex-col gap-4">
            <Card className="flex flex-col w-full min-h-0 max-h-[70vh] overflow-x-auto px-4">
              <ComparePlayersTable playerList={playerList} setPlayerList={setPlayerList}/>
            </Card>
            <Card className="hidden md:block">
              <ComparePlayersChart playerList={playerList}/>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}