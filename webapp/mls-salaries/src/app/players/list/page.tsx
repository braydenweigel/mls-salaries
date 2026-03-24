import Link from "next/link"
import players from "@/lib/data/players.json"
import type { Player } from "@/lib/data/types"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "All Players List - MLS Salaries"
}

export default function PlayersList(){
    const allPlayers = [...players].sort(
        (a, b) =>
            a.firstname.localeCompare(b.firstname) ||
            a.lastname.localeCompare(b.lastname)
    ) as Player[]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-2">
            {allPlayers.map((player) => (
                <Link key={player.playerid} href={`/players/${player.playerid}`} className="hover:underline py-1">{(player.lastname ?? "") + " " + (player.firstname ?? "")}</Link>
            ))}
        </div>
    )
}