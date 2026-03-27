import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ClubList, initialClubList } from "../page"
import { useEffect, useState } from "react"
import  clubs from "@/lib/data/clubs.json"
import { Club } from "@/lib/data/types"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import AddClubsItem from "./add-clubs-item"

type AddClubsDialogProps = {
    clubList: ClubList
    setClubList: React.Dispatch<React.SetStateAction<ClubList>>
}

export default function AddClubsDialog({clubList, setClubList}: AddClubsDialogProps){
    const [open, setOpen] = useState(false)
    const [filter, setFilter] = useState("")

    const allClubs = clubs as Club[]
    const filteredClubs = allClubs.filter(club => {
        if (filter.length > 0){
        const f = filter.trim().toLowerCase()
        const clubName = club.clubname.toLowerCase()
        const clubID = club.clubid.toLowerCase()
        if (!clubName.includes(f) && !clubID.includes(f)) return false
        }
        return true
    })

    const handleReset = () => {
        setClubList(initialClubList)
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
                    <span>Add Club</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="h-[80vh] flex flex-col">
              <DialogHeader className="h-fit">
                    <DialogTitle className="text-left">Search</DialogTitle>
                    <Input 
                        placeholder="Search for Clubs..."
                        value={filter}
                        onChange={(s) => {
                            setFilter(s.target.value)
                        }}
                    />
                </DialogHeader>
                {filteredClubs.length > 0 ? <div className="flex flex-col overflow-y-scroll max-h-[60vh]">
                    {filteredClubs.map((club) => (
                        <AddClubsItem key={club.clubid} club={club} clubList={clubList} setClubList={setClubList}/>
                    ))}
                  </div> 
                  : <p className="text-muted-foreground text-center my-auto">No results</p>
                }
                <Button variant="destructive" onClick={handleReset} className="w-fit" size="sm">Reset</Button>
            </DialogContent>
        </Dialog>
    )
}