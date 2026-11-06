"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import players from "@/lib/data/players.json"
import clubs from "@/lib/data/clubs.json"
import type { Player, Club } from "@/lib/data/types"

const allPlayers = players as Player[]
const allClubs = clubs as Club[]

export default function HeroSearch(){
    const router = useRouter()
    const [query, setQuery] = React.useState("")
    const [open, setOpen] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    const f = query.trim().toLowerCase()

    const matchedClubs = f.length === 0 ? [] : allClubs.filter((club) =>
        club.clubname.toLowerCase().includes(f) || club.clubid.toLowerCase().includes(f)
    ).slice(0, 4)

    const matchedPlayers = f.length === 0 ? [] : allPlayers.filter((player) =>
        `${player.lastname} ${player.firstname}`.toLowerCase().includes(f)
    ).slice(0, 4)

    const topHref = matchedPlayers.length > 0
        ? `/players/${matchedPlayers[0].playerid}`
        : matchedClubs.length > 0 ? `/clubs/${matchedClubs[0].clubid}` : null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (topHref) router.push(topHref)
    }

    return (
        <div ref={containerRef} className="relative w-full max-w-lg">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setOpen(true)}
                        placeholder="Search a player or club"
                        className="h-11 pl-9"
                    />
                </div>
                <Button type="submit" size="lg" className="h-11">Search</Button>
            </form>
            {open && f.length > 0 && (matchedPlayers.length > 0 || matchedClubs.length > 0) && (
                <div className="absolute z-20 mt-2 w-full rounded-lg border bg-popover shadow-md overflow-hidden">
                    {matchedPlayers.length > 0 && (
                        <div className="py-1">
                            <p className="px-3 py-1 text-xs font-medium text-muted-foreground">Players</p>
                            {matchedPlayers.map((player) => (
                                <button
                                    key={player.playerid}
                                    type="button"
                                    className="flex w-full items-center px-3 py-1.5 text-left text-sm hover:bg-muted"
                                    onClick={() => router.push(`/players/${player.playerid}`)}
                                >
                                    {player.lastname} {player.firstname}
                                </button>
                            ))}
                        </div>
                    )}
                    {matchedClubs.length > 0 && (
                        <div className="border-t py-1">
                            <p className="px-3 py-1 text-xs font-medium text-muted-foreground">Clubs</p>
                            {matchedClubs.map((club) => (
                                <button
                                    key={club.clubid}
                                    type="button"
                                    className="flex w-full items-center px-3 py-1.5 text-left text-sm hover:bg-muted"
                                    onClick={() => router.push(`/clubs/${club.clubid}`)}
                                >
                                    {club.clubname}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
