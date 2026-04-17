import { TableClubPlayers } from "@/app/clubs/[id]/_components/clubPlayerTableColumns"
import { PlayerRecord } from "./data/types"
import { ClubList } from "@/app/clubs/compare/page"

export function formatData(clubRecords: PlayerRecord[], year: string, season: string, reportValue: string){
  let totalBaseSal = 0
  let totalGuarComp = 0
  const data: TableClubPlayers[] = []

  for (const record of clubRecords){
    if (record.recordyear === year && record.recordseason === season){
      totalBaseSal += record.basesalary
      totalGuarComp += record.guaranteedcomp

      let name = ""
      if (!record.firstname){
        name = record.lastname
      } else if (!record.lastname){
        name = record.firstname
      } else {
        name = record.firstname + " " + record.lastname
      }

      data.push({
        id: record.playerid,
        name: name,
        position: record.position,
        baseSal: record.basesalary,
        guarComp: record.guaranteedcomp,
        reportYear: reportValue
      })
    }
  }

  data.sort((a,b) => b.guarComp - a.guarComp)

  return { 
    data: data,
    totalBaseSal: totalBaseSal,
    totalGuarComp: totalGuarComp
  }
}

export const initialClubList: ClubList = {
  data: [{stackID: "a", club: null},
  {stackID: "b", club: null},
  {stackID: "c", club: null},
  {stackID: "d", club: null}],
  numClubs: 0
}