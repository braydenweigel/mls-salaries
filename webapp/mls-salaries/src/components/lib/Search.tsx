"use client"

import * as React from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import players from '@/lib/data/players.json'
import clubs from '@/lib/data/clubs.json'
import type { Player, Club } from "@/lib/data/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { usePathname } from "next/navigation"
import { useEffect } from "react"


export function SearchButton() {
    const [filter, setFilter] = React.useState("")
    const [open, setOpen] = React.useState(false)
    const pathname = usePathname()
    
    useEffect(() => {
        setOpen(false)
    }, [pathname])

    useEffect(() => {
        setFilter("")
    }, [open])
    


    const allClubs = clubs as Club[]
    const allPlayers = [...players].sort(
        (a, b) =>
            a.firstname.localeCompare(b.firstname) ||
            a.lastname.localeCompare(b.lastname)
    ) as Player[]

    const filteredClubs = allClubs.filter(club => {
        if (filter.length > 0){
            const f = filter.trim().toLowerCase()
            const clubName = club.clubname.toLowerCase()
            const clubID = club.clubid.toLowerCase()
            if (!clubName.includes(f) && !clubID.includes(f)) return false
        }
        return true
    })

    const filteredPlayers = allPlayers.filter(player => {
        if (filter.length > 0){
            const f = filter.trim().toLowerCase()
            const playerName = (player.lastname + " " + player.firstname).toLowerCase()
            if (!playerName.includes(f)) return false
        }
        return true
    })
    
    return (
    <>
        <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Search className=" h-[1.2rem] w-[1.2rem] scale-100 transition-all" />
                    <span>Search</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="h-[60vh] flex flex-col">
                <DialogHeader className="h-fit">
                    <DialogTitle className="text-left">Search</DialogTitle>
                    <Input 
                        placeholder="Search for Clubs or Players..."
                        value={filter}
                        onChange={(s) => {
                            setFilter(s.target.value)
                        }}
                    />
                </DialogHeader>
                {filteredClubs.length > 0 ? <div className="flex flex-col overflow-y-scroll min-h-[20vh] max-h-[40vh]">
                    <Label className="text-muted-foreground">Clubs</Label>
                    {filteredClubs.map((club) => (
                        <Link 
                            href={`/clubs/${club.clubid}`} 
                            className="hover:underline py-1" 
                            key={club.clubid}
                            prefetch={false}
                        >
                            {club.clubname}
                        </Link>
                    ))}
                </div> : null}
                {filteredPlayers.length > 0 ? <div className="flex flex-col overflow-y-scroll min-h-[20vh] max-h-[40vh]">
                    <Label className="text-muted-foreground">Players</Label>
                    {filteredPlayers.map((player) => (
                        <Link 
                            href={`/players/${player.playerid}`} 
                            className="hover:underline py-1" 
                            key={player.playerid}
                            prefetch={false}
                        >
                            {player.lastname + " " + player.firstname}
                        </Link>
                    ))}
                </div> : null}
                {filteredClubs.length == 0  && filteredPlayers.length == 0 ? <p className="text-muted-foreground text-center my-auto">No results</p> : null}
            </DialogContent>
        </Dialog>
    </>
    )
}
