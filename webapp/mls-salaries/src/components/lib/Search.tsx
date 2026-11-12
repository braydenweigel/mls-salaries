"use client"

import * as React from "react"
import { Search } from "lucide-react"

import Link from "next/link"
import players from '@/lib/data/players.json'
import clubs from '@/lib/data/clubs.json'
import type { Player, Club } from "@/lib/data/types"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { usePathname, useRouter } from "next/navigation"

const allClubs = clubs as Club[]
const allPlayers = [...players].sort(
    (a, b) =>
        a.firstname.localeCompare(b.firstname) ||
        a.lastname.localeCompare(b.lastname)
) as Player[]

function useFilteredResults(filter: string) {
    const f = filter.trim().toLowerCase()

    const filteredClubs = f.length === 0 ? [] : allClubs.filter(club => {
        const clubName = club.clubname.toLowerCase()
        const clubID = club.clubid.toLowerCase()
        return clubName.includes(f) || clubID.includes(f)
    }).slice(0, 4)

    const filteredPlayers = f.length === 0 ? [] : allPlayers.filter(player => {
        const playerName = (player.lastname + " " + player.firstname).toLowerCase()
        return playerName.includes(f)
    }).slice(0, 4)

    return { filteredClubs, filteredPlayers }
}

function useCloseOnOutsideClick(ref: React.RefObject<HTMLElement | null>, close: () => void) {
    React.useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) close()
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [ref, close])
}

function SearchResultsContent({
    filteredPlayers,
    filteredClubs,
    onNavigate,
}: {
    filteredPlayers: Player[]
    filteredClubs: Club[]
    onNavigate: () => void
}) {
    return (
        <>
            {filteredPlayers.length > 0 && (
                <div className="py-1">
                    <p className="px-3 py-1 text-xs font-medium text-muted-foreground">Players</p>
                    {filteredPlayers.map((player) => (
                        <Link
                            href={`/players/${player.playerid}`}
                            className="flex w-full items-center px-3 py-1.5 text-left text-sm hover:bg-muted"
                            key={player.playerid}
                            prefetch={false}
                            onClick={onNavigate}
                        >
                            {player.lastname} {player.firstname}
                        </Link>
                    ))}
                </div>
            )}
            {filteredClubs.length > 0 && (
                <div className="border-t py-1">
                    <p className="px-3 py-1 text-xs font-medium text-muted-foreground">Clubs</p>
                    {filteredClubs.map((club) => (
                        <Link
                            href={`/clubs/${club.clubid}`}
                            className="flex w-full items-center px-3 py-1.5 text-left text-sm hover:bg-muted"
                            key={club.clubid}
                            prefetch={false}
                            onClick={onNavigate}
                        >
                            {club.clubname}
                        </Link>
                    ))}
                </div>
            )}
        </>
    )
}

function DesktopSearch() {
    const [filter, setFilter] = React.useState("")
    const [open, setOpen] = React.useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const containerRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        setOpen(false)
        setFilter("")
    }, [pathname])

    useCloseOnOutsideClick(containerRef, () => setOpen(false))

    const { filteredClubs, filteredPlayers } = useFilteredResults(filter)
    const showResults = open && filter.trim().length > 0 && (filteredPlayers.length > 0 || filteredClubs.length > 0)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setOpen(false)
        const trimmed = filter.trim()
        router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search")
    }

    return (
        <div ref={containerRef} className={`relative ${open ? "w-64 md:w-72" : "w-48 md:w-64"}`}>
            <form onSubmit={handleSubmit}>
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    onFocus={() => setOpen(true)}
                    placeholder="Search..."
                    className="pl-8"
                />
            </form>
            {showResults && (
                <div className="absolute z-20 mt-2 w-full rounded-lg border bg-popover shadow-md overflow-hidden">
                    <SearchResultsContent filteredPlayers={filteredPlayers} filteredClubs={filteredClubs} onNavigate={() => setOpen(false)}/>
                </div>
            )}
        </div>
    )
}

function MobileSearch() {
    const [open, setOpen] = React.useState(false)
    const [filter, setFilter] = React.useState("")
    const pathname = usePathname()
    const router = useRouter()
    const containerRef = React.useRef<HTMLDivElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        setOpen(false)
        setFilter("")
    }, [pathname])

    React.useEffect(() => {
        if (open) inputRef.current?.focus()
    }, [open])

    useCloseOnOutsideClick(containerRef, () => setOpen(false))

    const { filteredClubs, filteredPlayers } = useFilteredResults(filter)
    const showResults = filter.trim().length > 0 && (filteredPlayers.length > 0 || filteredClubs.length > 0)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setOpen(false)
        const trimmed = filter.trim()
        router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search")
    }

    return (
        <div ref={containerRef} className="relative">
            <Button variant="outline" size="icon" onClick={() => setOpen((v) => !v)} aria-label="Search">
                <Search className="h-[1.2rem] w-[1.2rem]"/>
            </Button>
            {open && (
                <div
                    className="fixed inset-0 z-10 bg-black/50"
                    onClick={() => setOpen(false)}
                    aria-hidden="true"
                />
            )}
            {open && (
                <div className="absolute right-0 z-20 mt-2 w-72">
                    <form onSubmit={handleSubmit}>
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                ref={inputRef}
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                placeholder="Search..."
                                className="bg-popover pl-8 shadow-md dark:bg-popover"
                            />
                        </div>
                    </form>
                    {showResults && (
                        <div className="mt-2 rounded-lg border bg-popover shadow-md overflow-hidden">
                            <SearchResultsContent filteredPlayers={filteredPlayers} filteredClubs={filteredClubs} onNavigate={() => setOpen(false)}/>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export function SearchButton() {
    return (
        <>
            <div className="hidden sm:block"><DesktopSearch/></div>
            <div className="sm:hidden"><MobileSearch/></div>
        </>
    )
}
