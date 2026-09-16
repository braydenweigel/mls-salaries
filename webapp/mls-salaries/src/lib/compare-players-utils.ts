import { PlayerData, PlayerList } from "@/app/players/compare/page";
import { Player, PlayerRecord } from "./data/types";
import { filterRecordsByPlayerID } from "./data/filters";
import records from "@/lib/data/records.json"
import players from "@/lib/data/players.json"
import { reports } from "./globals";
import { initialPlayerList } from "./players";

export function addPlayerToList(playerList: PlayerList, player: Player){
    const playerRecords = filterRecordsByPlayerID((records as PlayerRecord[]), player.playerid)
    let newMin = playerList.min
    let newMax = playerList.max

    const reportsList = Object.keys(reports).sort((a, b) => Number(a) - Number(b))

    for (const key of reportsList){//create array of player.records
        const report = reports[key]
        const match = playerRecords.find((record) => record.recordyear === report.year && record.recordseason === report.season)

        if (match){
            if (Number(key) <= Number(newMin)) newMin = key //check if report is new minimum

            if (playerList.numPlayers == 0) newMax = key //if this is the first player added, the last record added will always be the max
            if (playerList.numPlayers > 0 && Number(key) >= Number(newMax)) newMax = key //if the max is set from a previous player, set new max if this record is more recent

        }
    }

    const newPlayer: PlayerData = {
        player: player,
        records: playerRecords
    }
    

    const newList = structuredClone(playerList)
    newList.data[newList.numPlayers].player = newPlayer
    newList.numPlayers++
    newList.max = newMax
    newList.min = newMin

    return newList

}

export function buildPlayerListFromIds(playerIds: string[]): PlayerList {
    let newList = structuredClone(initialPlayerList)

    for (const playerId of playerIds) {
        if (newList.numPlayers >= newList.data.length) break

        const player = (players as Player[]).find((p) => p.playerid === playerId)
        if (player) newList = addPlayerToList(newList, player)
    }

    return newList
}

export function getPlayerIdsFromList(playerList: PlayerList): string[] {
    return playerList.data
        .filter((d) => d.player)
        .map((d) => d.player!.player.playerid)
}

export function removePlayerFromList(playerList: PlayerList, id: "a" | "b" | "c" | "d"){
    //get index of player and remove
    const index = playerList.data.findIndex(player => player.stackID === id)
    const tempList = structuredClone(playerList)
    tempList.data[index].player = null

    //get remaining clubs and repopulate list
    const players: PlayerData[] = []
    for (const player of tempList.data){
        if (player.player){
            players.push(structuredClone(player.player))
        }
    }

    let newList = structuredClone(initialPlayerList)
    for (let i = 0; i < players.length; i++){
        newList = addPlayerToList(newList, players[i].player)

    }
    newList.numPlayers = players.length

    return newList
}