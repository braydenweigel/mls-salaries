"use client"

import * as React from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CommandDialog, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "../ui/command"
import Link from "next/link"
import players from '@/lib/data/players.json'
import clubs from '@/lib/data/clubs.json'
import type { Player, Club } from "@/lib/data/types"


export function SearchButton() {
    const [open, setOpen] = React.useState(false)


    const allClubs = clubs as Club[]
    const allPlayers = [...players].sort(
        (a, b) =>
            a.firstname.localeCompare(b.firstname) ||
            a.lastname.localeCompare(b.lastname)
    ) as Player[]
    
    return (
    <>
        <Button variant="outline"  onClick={() => setOpen(true)}>
            <Search className=" h-[1.2rem] w-[1.2rem] scale-100 transition-all" />
            <span>Search</span>
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen} className="h-2/3">
            <CommandInput placeholder="Search"/>
            {/* {<CommandEmpty className="p-2 justify-self-center" id="no-results">No results.</CommandEmpty>} */}
            <p className="p-2 text-muted-foreground text-sm" >Clubs</p>
            <CommandList className="max-h-1/3">
                <CommandGroup className="max-h-1/3">
                    {allClubs.map((club) => (
                        <CommandItem key={club.clubid}><Link href={`/clubs/${club.clubid}`} className="hover:underline" onClick={() => setOpen(false)}>{club.clubname}</Link></CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
            <CommandSeparator/>
            <p className="p-2 text-muted-foreground text-sm">Players</p>
            <CommandList className="h-2/3">
                <CommandGroup className="">
                    {allPlayers.map((player) => (
                        <CommandItem key={player.playerid}><Link href={`/players/${player.playerid}`} className="hover:underline" onClick={() => setOpen(false)}>{(player.lastname ?? "") + " " + (player.firstname ?? "")}</Link></CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    </>
    )
}
