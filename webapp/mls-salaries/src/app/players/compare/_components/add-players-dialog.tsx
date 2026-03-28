import { useEffect, useState } from "react"
import { initialPlayerList, PlayerList } from "../page"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import players from "@/lib/data/players.json"
import { Player } from "@/lib/data/types"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import AddPlayerssItem from "./add-players-item"
import AddPlayersItem from "./add-players-item"

type AddPlayersDialogProps = {
    playerList: PlayerList
    setPlayerList: React.Dispatch<React.SetStateAction<PlayerList>>
}

export default function AddClubsDialog({playerList, setPlayerList}: AddPlayersDialogProps){
    const [open, setOpen] = useState(false)
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
                <Button variant="outline">
                    <Plus className=" h-[1.2rem] w-[1.2rem] scale-100 transition-all" />
                    <span>Add Player</span>
                </Button>
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