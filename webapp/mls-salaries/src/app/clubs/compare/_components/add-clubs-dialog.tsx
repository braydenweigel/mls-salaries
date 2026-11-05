import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ClubList } from "../page"
import { useEffect, useState } from "react"
import  clubs from "@/lib/data/clubs.json"
import { Club } from "@/lib/data/types"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import AddClubsItem from "./add-clubs-item"
import { initialClubList } from "@/lib/clubs"
import { cn } from "@/lib/utils"

type AddClubsDialogProps = {
    clubList: ClubList
    setClubList: React.Dispatch<React.SetStateAction<ClubList>>
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    className?: string
}

export default function AddClubsDialog({clubList, setClubList, open, setOpen, className}: AddClubsDialogProps){
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
                    <span className="text-sm font-semibold">{clubList.numClubs === 0 ? "Add your first club" : "Add club"}</span>
                    <span className="text-xs text-muted-foreground">{4 - clubList.numClubs} of 4 slots open</span>
                </button>
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
                {filteredClubs.length > 0 ? <div className="flex flex-col overflow-y-auto h-[60vh]">
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