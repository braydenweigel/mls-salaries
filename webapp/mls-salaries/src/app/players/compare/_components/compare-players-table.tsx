import React, { useEffect, useState } from "react"
import { PlayerData, PlayerList } from "../page"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { reports } from "@/lib/globals"



type ComparePlayersHeaderProps = {
    playerList: PlayerList
    setPlayerList: React.Dispatch<React.SetStateAction<PlayerList>>
    player: PlayerData
    id: "a" | "b" | "c" | "d"
}

type ComparePlayersTableProps = {
    playerList: PlayerList
    setPlayerList: React.Dispatch<React.SetStateAction<PlayerList>>
}

type ComparePlayersRowProps = {
    playerList: PlayerList
    reportValue: string
}

export default function ComparePlayersTable({playerList, setPlayerList}: ComparePlayersTableProps){
    const reportsList = []


    for (const key in reports){
        if (Number(key) >= Number(playerList.min) && Number(key) <= Number(playerList.max)){
            reportsList.push(key)
        }
    }

    reportsList.sort((a, b) => Number(b) - Number(a))
    console.log(reportsList)

    return (
        <Table className="px-4">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[120px] pb-2">Year</TableHead>
                    {playerList.data.map((p) => (
                        p.player ? 
                        <ComparePlayersHeader
                            key={p.stackID + p.player.player.playerid} 
                            playerList={playerList} setPlayerList={setPlayerList} 
                            player={p.player} id={p.stackID}/> 
                        : null
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody className="overflow-y-auto">
            {reportsList.map((report) => (
                <ComparePlayersRow key={report} playerList={playerList} reportValue={report}/>
            ))}
            </TableBody>
        </Table>
    )
}

function ComparePlayersHeader({playerList, setPlayerList, player, id}: ComparePlayersHeaderProps){

    const handlePlayerDelete = () => {
        // setClubList(removeClubFromList(clubList, id))
    }

    return (
        <TableHead className="max-w-full min-w-[50%] md:min-w-0 pb-2" style={{minWidth: `${100 / (playerList.numPlayers + 1)}%`}}>
            <div className="flex justify-around items-center ">
                <p className="font-semibold">{player.player.lastname} {player.player.firstname}</p>
                <Button variant="outline" size="icon-sm" style={{borderColor: "var(--destructive)"}} onClick={handlePlayerDelete}><X color="var(--destructive)"/></Button>
            </div>
        </TableHead>
    )
}

function ComparePlayersRow({playerList, reportValue}: ComparePlayersRowProps){
    const report = reports[reportValue]
    

    return (
        <TableRow key={reportValue}>
            <TableCell>{report.year} {report.season}</TableCell>
            {playerList.data.map((p) => {
                if (!p.player) return null

                const match = p.player.records.find((record) => record.recordyear === report.year && record.recordseason === report.season)
                
                return (
                    <TableCell key={p.player.player.playerid}>
                        {match ? 
                            <div className="flex flex-col">
                                <p className="text-center text-md font">${match.guaranteedcomp.toLocaleString()}</p>
                                <p className="text-center text-xs">${match.basesalary.toLocaleString()}</p>
                            </div>
                            : <p className="text-center">---</p>
                        }
                    </TableCell>
                )
            })}
        </TableRow>
    )
}

