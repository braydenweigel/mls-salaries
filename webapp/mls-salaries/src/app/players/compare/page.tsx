"use client"

import { Button } from "@/components/ui/button";
import { Player, PlayerRecord } from "@/lib/data/types";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AddPlayersDialog from "./_components/add-players-dialog";
import ComparePlayersTable from "./_components/compare-players-table";
import ComparePlayersChart from "./_components/compare-players-chart";
import { PlayerSummaryCard } from "./_components/player-summary-card";
import { initialPlayerList } from "@/lib/players";
import { buildPlayerListFromIds, compareColors, getPlayerIdsFromList, removePlayerFromList } from "@/lib/compare-players-utils";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Check, LineChart, Link2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const PRESET_COMPARISONS: { label: string; ids: string[] }[] = [
  { label: "Chara vs. Fagundez vs. Rossi", ids: ["DcH4r4", "5kpuwp", "KNi915"] },
  { label: "Mukhtar vs. Rossi", ids: ["up30uj", "KNi915"] },
]

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

  // AddPlayersDialog only renders while numPlayers < 4; if a 4th player is added from
  // inside the (still open) dialog, it unmounts immediately without ever calling
  // onOpenChange(false), which would otherwise leave addPlayersOpen stuck true with no
  // dialog left on screen - and the whole page permanently pointer-events-none below.
  useEffect(() => {
    if (playerList.numPlayers >= 4) {
      setAddPlayersOpen(false)
    }
  }, [playerList.numPlayers])

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

  const [copied, setCopied] = useState(false)

  const handleReset = () => {
    setPlayerList(initialPlayerList)
  }

  const handleRemovePlayer = (id: "a" | "b" | "c" | "d") => {
    setPlayerList(removePlayerFromList(playerList, id))
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable, ignore
    }
  }

  const isEmpty = playerList.numPlayers === 0
  // AddPlayersDialog (and the open dialog it renders) only exists in the tree while
  // numPlayers < 4 - this must stay in sync with that so the guard below never gets stuck
  // on with no dialog actually present to interact with or close.
  const addPlayersDialogVisible = addPlayersOpen && playerList.numPlayers < 4

  return (
    // pointer-events-none while the add-player dialog is open: don't rely on Radix's own
    // body-level pointer-events lock, which is implemented with a variable shared across
    // every Dialog instance in the app and can be left stuck/released early by React Strict
    // Mode's double-invoked effects or a Fast Refresh remount, letting clicks (e.g. a card's
    // remove button) reach through to the page behind the dialog. The dialog itself renders
    // via a portal to document.body, so it's not a DOM descendant of this div and is unaffected.
    <div className={cn("flex flex-col gap-4", addPlayersDialogVisible && "pointer-events-none")}>
      <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/players" className="hover:underline">Players</Link>
        <span>/</span>
        <span className="text-foreground">Compare</span>
      </div>
      <div className="flex items-center justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Compare players</h1>
          <p className="hidden sm:block text-sm text-muted-foreground mt-1">
            See up to four players&apos; salaries side by side.
          </p>
        </div>
        {!isEmpty && (
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" onClick={handleReset} className="text-xs md:text-sm">Clear all</Button>
            <Button variant="outline" onClick={handleCopyLink} className="hidden sm:flex text-xs md:text-sm">
              {copied ? <Check className="size-4"/> : <Link2 className="size-4"/>}
              {copied ? "Copied" : "Copy link"}
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-3">
        {playerList.data.map((entry, index) => (
          entry.player && (
            <PlayerSummaryCard
              key={entry.stackID}
              player={entry.player}
              color={compareColors[index]}
              onRemove={() => handleRemovePlayer(entry.stackID)}
            />
          )
        ))}
        {playerList.numPlayers < 4 && (
          <AddPlayersDialog
            playerList={playerList}
            setPlayerList={setPlayerList}
            open={addPlayersOpen}
            setOpen={setAddPlayersOpen}
            className={isEmpty ? "col-span-full" : undefined}
          />
        )}
      </div>

      {isEmpty ? (
        <Empty className="border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LineChart/>
            </EmptyMedia>
            <EmptyTitle>Pick players to compare</EmptyTitle>
            <EmptyDescription>
              Add up to four players to chart their salaries over time.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-4">
          <ComparePlayersChart playerList={playerList}/>
          <ComparePlayersTable playerList={playerList}/>
        </div>
      )}
    </div>
  );
}