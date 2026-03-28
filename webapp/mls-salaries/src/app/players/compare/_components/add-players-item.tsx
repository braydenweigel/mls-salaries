import { Button } from "@/components/ui/button"
import { Player } from "@/lib/data/types"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { PlayerList } from "../page"
import { addPlayerToList } from "@/lib/compare-players-utils"

type AddPlayersItemProps = {
    playerList: PlayerList
    setPlayerList: React.Dispatch<React.SetStateAction<PlayerList>>
    player: Player
}

export default function AddPlayersItem({playerList, setPlayerList, player}: AddPlayersItemProps){
    const isMobile = useIsMobile()

    const handleAddPlayer = () => {
        if (playerList.numPlayers < (isMobile ? 2 : 4)){
            setPlayerList(addPlayerToList(playerList, player))
        }
    }

    return (
        <div className="flex flex-row w-full items-center justify-between py-1">
            <p>{player.lastname} {player.firstname}</p>
            <div className="flex flex-row">
                <Button variant="outline" size="icon" disabled={!(playerList.numPlayers < (isMobile ? 2 : 4))} onClick={handleAddPlayer} className="mx-2"><Plus/></Button>
            </div>
        </div>
    )
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    setIsMobile(media.matches);

    const listener = () => setIsMobile(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  return isMobile;
}