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

export const compareColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)"
]

function reportSortKey(record: PlayerRecord){
    return Number(record.recordyear) + (record.recordseason === "Fall" ? 0.5 : 0)
}

// Mirrors getSeasonRanges in /players/[id]/page.tsx, which splits a player's
// releases into separate ranges wherever there's a gap (e.g. a season out of the league).
function getPlayerSeasonRanges(playerRecords: PlayerRecord[]){
    const reportKeys = Object.keys(reports).sort((a, b) => Number(a) - Number(b))
    const ranges: { start: { year: string, season: string }, end: { year: string, season: string } }[] = []
    let current: { start: { year: string, season: string }, end: { year: string, season: string } } | null = null

    for (const key of reportKeys){
        const report = reports[key]
        const hasRecord = playerRecords.some((record) => record.recordyear === report.year && record.recordseason === report.season)

        if (hasRecord){
            current = current ? { start: current.start, end: report } : { start: report, end: report }
        } else if (current){
            ranges.push(current)
            current = null
        }
    }

    if (current) ranges.push(current)

    return ranges
        .map((range) => range.start.year === range.end.year && range.start.season === range.end.season
            ? `${range.start.year} ${range.start.season}`
            : `${range.start.year} ${range.start.season} – ${range.end.year} ${range.end.season}`)
        .join(", ")
}

export function getPlayerReleaseStats(player: PlayerData){
    const sorted = [...player.records].sort((a, b) => reportSortKey(a) - reportSortKey(b))
    const latest = sorted[sorted.length - 1]

    return {
        count: sorted.length,
        rangeLabel: getPlayerSeasonRanges(player.records),
        latestGuaranteed: latest.guaranteedcomp,
        // records.json has correctly ordered first/last names, unlike players.json
        displayName: `${latest.firstname} ${latest.lastname}`,
    }
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