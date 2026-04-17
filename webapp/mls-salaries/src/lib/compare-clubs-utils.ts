import { ClubData, ClubList,} from "@/app/clubs/compare/page";
import { Club, PlayerRecord } from "./data/types";
import { reports } from "./globals";
import { filterRecordsByReportAndClub } from "./data/filters";
import records from "@/lib/data/records.json"
import { formatData, initialClubList } from "./clubs";

export function addClubToList(clubList: ClubList, reportValue: string, club: Club): ClubList{

    //get club info
    const year = reports[reportValue].year
    const season = reports[reportValue].season

    const clubRecords = filterRecordsByReportAndClub((records as PlayerRecord[]), year, season, club.clubid)
    clubRecords.sort((a,b) => b.guaranteedcomp - a.guaranteedcomp)

    const { totalBaseSal, totalGuarComp } = formatData(clubRecords, year, season, reportValue)

    //create new club
    const newClub: ClubData = {
        club: club,
        reportValue: reportValue,
        players: clubRecords,
        baseSalary: totalBaseSal,
        guarComp: totalGuarComp
    }

    const newList = structuredClone(clubList)
    newList.data[newList.numClubs].club = newClub
    newList.numClubs++

    return newList
}

export function removeClubFromList(clubList: ClubList, id: "a" | "b" | "c" | "d"): ClubList{
    //get index of club and remove
    const index = clubList.data.findIndex(club => club.stackID === id)
    const tempList = structuredClone(clubList)
    tempList.data[index].club = null

    //get remaining clubs and repopulate list
    const clubs: ClubData[] = []
    for (const club of tempList.data){
        if (club.club){
            clubs.push(structuredClone(club.club))
        }
    }

    const newList = structuredClone(initialClubList)
    for (let i = 0; i < clubs.length; i++){
        newList.data[i].club = clubs[i]
    }
    newList.numClubs = clubs.length

    return newList
}

export function updateClubReportValue(clubList: ClubList, reportValue: string, club: Club, id: "a" | "b" | "c" | "d"): ClubList{
    //get new club info with updated reportValue
    const year = reports[reportValue].year
    const season = reports[reportValue].season

    const clubRecords = filterRecordsByReportAndClub((records as PlayerRecord[]), year, season, club.clubid)
    clubRecords.sort((a,b) => b.guaranteedcomp - a.guaranteedcomp)

    const { totalBaseSal, totalGuarComp } = formatData(clubRecords, year, season, reportValue)

    const newClub: ClubData = {
        club: club,
        reportValue: reportValue,
        players: clubRecords,
        baseSalary: totalBaseSal,
        guarComp: totalGuarComp
    }


    //get index of club to update
    const index = clubList.data.findIndex(club => club.stackID === id)

    //update club with new info
    const newList = structuredClone(clubList)
    newList.data[index].club = newClub

    return newList
}