import { Button } from "@/components/ui/button"
import { Player } from "@/lib/data/types"
import { Plus, X } from "lucide-react"
import { PlayerList } from "../page"
import { addPlayerToList, removePlayerFromList } from "@/lib/compare-players-utils"

type AddPlayersItemProps = {
    playerList: PlayerList
    setPlayerList: React.Dispatch<React.SetStateAction<PlayerList>>
    player: Player
}

export default function AddPlayersItem({playerList, setPlayerList, player}: AddPlayersItemProps){

    const existingEntry = playerList.data.find((d) => d.player?.player.playerid === player.playerid)

    const handleAddPlayer = () => {
        if (playerList.numPlayers < 4){
            setPlayerList(addPlayerToList(playerList, player))
        }
    }

    const handleRemovePlayer = () => {
        if (existingEntry) setPlayerList(removePlayerFromList(playerList, existingEntry.stackID))
    }

    return (
        <div className="flex flex-row w-full items-center justify-between py-0.5 md:py-1">
            <p className="text-sm md:text-base">{player.lastname} {player.firstname}</p>
            <div className="flex flex-row">
                {existingEntry ?
                    <Button variant="outline" size="icon" style={{borderColor: "var(--destructive)"}} onClick={handleRemovePlayer} className="size-7 md:size-9 mx-1 md:mx-2 [&_svg]:size-3.5 md:[&_svg]:size-4"><X color="var(--destructive)"/></Button>
                    : <Button variant="outline" size="icon" disabled={!(playerList.numPlayers < 4)} onClick={handleAddPlayer} className="size-7 md:size-9 mx-1 md:mx-2 [&_svg]:size-3.5 md:[&_svg]:size-4"><Plus/></Button>
                }
            </div>
        </div>
    )
}