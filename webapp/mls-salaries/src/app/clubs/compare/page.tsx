"use client"

import { Club, PlayerRecord } from "@/lib/data/types";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AddClubsDialog from "./_components/add-clubs-dialog";
import CompareClubsHeader from "./_components/compare-clubs-header";
import CompareClubsTable from "./_components/compare-clubs-table";
import CompareClubsChart from "./_components/compare-clubs-chart";
import { initialClubList } from "@/lib/clubs";
import { buildClubListFromIds, getClubIdsFromList } from "@/lib/compare-clubs-utils";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Shield } from "lucide-react";

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
  const headerScrollRef = useRef<HTMLDivElement>(null)

  const handleTableScroll = (scrollLeft: number) => {
    if (headerScrollRef.current) headerScrollRef.current.style.transform = `translateX(-${scrollLeft}px)`
  }

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

  const isEmpty = clubList.numClubs === 0

  return (
    <div className={`flex flex-col ${isEmpty ? "flex-1 min-h-0 items-center justify-center" : "gap-4"}`}>
      <div className={`flex items-center ${isEmpty ? "order-2 justify-center" : "order-1 justify-between"}`}>
        <AddClubsDialog clubList={clubList} setClubList={setClubList} open={addClubsOpen} setOpen={setAddClubsOpen}/>
        {!isEmpty && <Button variant="destructive" onClick={handleReset}>Reset</Button>}
      </div>
      <div className={isEmpty ? "order-1" : "order-2"}>
        {isEmpty ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Shield />
              </EmptyMedia>
              <EmptyTitle>No Clubs Added</EmptyTitle>
              <EmptyDescription>Add clubs to start comparing their stats.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex flex-col gap-4">
            <Card className="flex flex-col w-full min-h-0 h-[70vh] overflow-x-hidden gap-0">
              <div className="border-b pb-2">
                <div ref={headerScrollRef} className="flex flex-row w-full justify-start">
                  {clubList.data.map((club) => (
                    club.club ? <CompareClubsHeader key={club.stackID + club.club.reportValue + club.club.club.clubname} clubList={clubList} setClubList={setClubList} club={club.club} id={club.stackID}/> : null
                  ))}
                </div>
              </div>
              <CompareClubsTable clubList={clubList} onScroll={handleTableScroll}/>
            </Card>
            <Card className="hidden md:block">
              <CompareClubsChart clubList={clubList}/>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}