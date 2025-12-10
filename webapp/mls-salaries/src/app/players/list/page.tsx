"use client"

import { RootState } from "@/lib/store/store"
import Link from "next/link"
import { useSelector } from "react-redux"

export default function PlayersList(){
    const allPlayers = useSelector((state: RootState) => state.players.data)

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-2">
            {allPlayers.map((player) => (
                <Link key={player.playerid} href={`/players/${player.playerid}`} className="hover:underline py-1">{(player.lastname ?? "") + " " + (player.firstname ?? "")}</Link>
            ))}
        </div>
    )
}