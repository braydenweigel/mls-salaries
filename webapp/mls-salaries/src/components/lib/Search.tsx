"use client"

import * as React from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CommandDialog, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "../ui/command"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store/store"
import Link from "next/link"


export function SearchButton() {
    const [open, setOpen] = React.useState(false)


    const allClubs = useSelector((state: RootState) => state.clubs.data)
    const allPlayers = useSelector((state: RootState) => state.players.data)
    
  

  return (
    <>
        <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
          <Search className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Search</span>
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
