"use client"

import { Club, PlayerRecord } from "@/lib/data/types";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AddClubsDialog from "./_components/add-clubs-dialog";
import CompareClubsHeader from "./_components/compare-clubs-header";
import CompareClubsTable from "./_components/compare-clubs-table";
import CompareClubsChart from "./_components/compare-clubs-chart";
import { initialClubList } from "@/lib/clubs";
import { buildClubListFromIds, getClubIdsFromList } from "@/lib/compare-clubs-utils";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Check, Link2, Shield } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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


export default function CompareClubs() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [clubList, setClubList] = useState<ClubList>(() =>
    buildClubListFromIds(searchParams.get("clubs")?.split(",").filter(Boolean) ?? [])
  )
  const [addClubsOpen, setAddClubsOpen] = useState(false)
  const isInitialRender = useRef(true)
  const [copied, setCopied] = useState(false)

  // AddClubsDialog only renders while numClubs < 4; if a 4th club is added from
  // inside the (still open) dialog, it unmounts immediately without ever calling
  // onOpenChange(false), which would otherwise leave addClubsOpen stuck true with no
  // dialog left on screen - and the whole page permanently pointer-events-none below.
  useEffect(() => {
    if (clubList.numClubs >= 4) {
      setAddClubsOpen(false)
    }
  }, [clubList.numClubs])

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }

    const ids = getClubIdsFromList(clubList)
    const params = new URLSearchParams(searchParams.toString())
    if (ids.length > 0) {
      params.set("clubs", ids.join(","))
    } else {
      params.delete("clubs")
    }

    const query = params.toString()
    router.replace(query ? `/clubs/compare?${query}` : "/clubs/compare", { scroll: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubList])

  const handleReset = () => {
    setClubList(initialClubList)
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

  const isEmpty = clubList.numClubs === 0
  // AddClubsDialog (and the open dialog it renders) only exists in the tree while
  // numClubs < 4 - this must stay in sync with that so the guard below never gets stuck
  // on with no dialog actually present to interact with or close.
  const addClubsDialogVisible = addClubsOpen && clubList.numClubs < 4

  return (
    // pointer-events-none while the add-club dialog is open: don't rely on Radix's own
    // body-level pointer-events lock, which is implemented with a variable shared across
    // every Dialog instance in the app and can be left stuck/released early by React Strict
    // Mode's double-invoked effects or a Fast Refresh remount, letting clicks (e.g. a card's
    // remove button) reach through to the page behind the dialog. The dialog itself renders
    // via a portal to document.body, so it's not a DOM descendant of this div and is unaffected.
    <div className={cn("flex flex-col gap-4", addClubsDialogVisible && "pointer-events-none")}>
      <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/clubs" className="hover:underline">Clubs</Link>
        <span>/</span>
        <span className="text-foreground">Compare</span>
      </div>
      <div className="flex items-center justify-between gap-4 sm:items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Compare clubs</h1>
          <p className="hidden sm:block text-sm text-muted-foreground mt-1">
            Put up to four club payrolls side by side, each from any report.
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {clubList.data.map((entry) => (
          entry.club && (
            <CompareClubsHeader
              key={entry.stackID + entry.club.reportValue + entry.club.club.clubname}
              clubList={clubList}
              setClubList={setClubList}
              club={entry.club}
              id={entry.stackID}
            />
          )
        ))}
        {clubList.numClubs < 4 && (
          <AddClubsDialog
            clubList={clubList}
            setClubList={setClubList}
            open={addClubsOpen}
            setOpen={setAddClubsOpen}
            className={isEmpty ? "col-span-full" : undefined}
          />
        )}
      </div>

      {isEmpty ? (
        <Empty className="border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Shield/>
            </EmptyMedia>
            <EmptyTitle>Pick clubs to compare</EmptyTitle>
            <EmptyDescription>
              Add up to four clubs to compare their payrolls.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-4">
          <Card className="hidden sm:block">
            <CardHeader>
              <CardTitle>Roster payroll distribution</CardTitle>
              <CardDescription>
                Compares player pay across rosters, from lowest to highest earner. Hover any bar for details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompareClubsChart clubList={clubList}/>
            </CardContent>
          </Card>
          <CompareClubsTable clubList={clubList}/>
        </div>
      )}
    </div>
  );
}
