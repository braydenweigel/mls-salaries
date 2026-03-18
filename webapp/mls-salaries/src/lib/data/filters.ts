import { PlayerRecord } from "./types";

export function filterRecordsByPlayerID(records: PlayerRecord[], id: string){
    return records.filter(records => {
        if (records.playerid != id) return false

        return true
    })
}

export function filterRecordsByReport(records: PlayerRecord[], year: string, season: string){
    return records.filter(records => {
        if (records.recordyear != year || records.recordseason != season) return false

        return true
    })
}

export function filterRecordsByReportAndClub(records: PlayerRecord[], year: string, season: string, club: string){
    return records.filter(record => {
        if (record.recordyear != year || record.recordseason != season || record.club != club) return false

        return true
    })
}