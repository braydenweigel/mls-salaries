import { PlayerData, PlayerList } from "@/app/players/compare/page";
import { Player, PlayerRecord } from "./data/types";
import { filterRecordsByPlayerID } from "./data/filters";
import records from "@/lib/data/records.json"
import { reports } from "./globals";

export function addPlayerToList(playerList: PlayerList, player: Player){
    const playerRecords = filterRecordsByPlayerID((records as PlayerRecord[]), player.playerid)
    const newRecords: (PlayerRecord | null)[] = []
    let newMin = playerList.min
    let newMax = playerList.max
    
    for (const key in reports){//create array of player.records
        const report = reports[key]
        const match = playerRecords.find((record) => record.recordyear === report.year && record.recordseason === report.season)

        if (match){
            if (Number(key) < Number(playerList.min)) newMin = key //check if report is new minimum

            if (playerList.numPlayers == 0) newMax = key //if this is the first player added, the last record added will always be the max
            if (playerList.numPlayers > 0 && Number(key) > Number(playerList.max)) newMax = key //if the max is set from a previous player, set new max if this record is more recent

            newRecords.push(match)
        } else {
            newRecords.push(null)
        }
    }

    const newPlayer: PlayerData = {
        player: player,
        records: newRecords
    }

    const newList = structuredClone(playerList)
    newList.data[newList.numPlayers].player = newPlayer
    newList.numPlayers++

    return newList

}