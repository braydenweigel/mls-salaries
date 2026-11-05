import { useEffect, useState } from "react"
import { PlayerList } from "../page"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import players from "@/lib/data/players.json"
import { Player } from "@/lib/data/types"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import AddPlayersItem from "./add-players-item"
import { initialPlayerList } from "@/lib/players"
import { cn } from "@/lib/utils"

type AddPlayersDialogProps = {
    playerList: PlayerList
    setPlayerList: React.Dispatch<React.SetStateAction<PlayerList>>
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    className?: string
}

export default function AddClubsDialog({playerList, setPlayerList, open, setOpen, className}: AddPlayersDialogProps){
    const [filter, setFilter] = useState("")

    const allPlayers = [...players].sort(
        (a, b) =>
            a.firstname.localeCompare(b.firstname) ||
            a.lastname.localeCompare(b.lastname)
    ) as Player[]
    const filteredPlayers = allPlayers.filter(player => {
        if (filter.length > 0){
            const f = filter.trim().toLowerCase()
            const playerName = (player.lastname + " " + player.firstname).toLowerCase()
            if (!playerName.includes(f)) return false
        }
        return true
    })

     const handleReset = () => {
        setPlayerList(initialPlayerList)
        setFilter("") 
    }

    useEffect(() => {
        setFilter("")
    }, [open])

    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        "flex h-full min-h-[108px] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-6 text-center transition-colors hover:bg-muted/50",
                        className
                    )}
                >
                    <span className="flex size-9 items-center justify-center rounded-full bg-muted">
                        <Plus className="size-4"/>
                    </span>
                    <span className="text-sm font-semibold">{playerList.numPlayers === 0 ? "Add your first player" : "Add player"}</span>
                    <span className="text-xs text-muted-foreground">{4 - playerList.numPlayers} of 4 slots open</span>
                </button>
            </DialogTrigger>
            <DialogContent className="h-[80vh] flex flex-col">
                <DialogHeader className="h-fit">
                    <DialogTitle className="text-left">Search</DialogTitle>
                    <Input 
                        placeholder="Search for Players..."
                        value={filter}
                        onChange={(s) => {
                            setFilter(s.target.value)
                        }}
                    />
                </DialogHeader>
                {filteredPlayers.length > 0 ? <div className="flex flex-col overflow-y-auto h-[60vh]">
                    {filteredPlayers.map((player) => (
                        <AddPlayersItem key={player.playerid} playerList={playerList} setPlayerList={setPlayerList} player={player}/>
                    ))}
                    </div> 
                    : <p className="text-muted-foreground text-center my-auto">No results</p>
                }
                <Button variant="destructive" onClick={handleReset} className="w-fit" size="sm">Reset</Button>
            </DialogContent>
        </Dialog>
    )
}