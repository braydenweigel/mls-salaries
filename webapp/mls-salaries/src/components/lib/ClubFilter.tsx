"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

const CLUBS = [
    "Austin FC","Atlanta United","Charlotte FC","Chicago Fire","Chivas USA","FC Cincinnati",
    "Columbus Crew","Colorado Rapids","FC Dallas","DC United","Houston Dynamo",
    "Sporting Kansas City","LA Galaxy","LAFC","Inter Miami","Minnesota United",
    "CF Montreal","Nashville SC","New England Revolution","New York City FC",
    "New York Red Bulls","Orlando City SC","Philadelphia Union","Portland Timbers","Real Salt Lake",
    "St. Louis City SC","San Diego FC","Seattle Sounders FC","San Jose Earthquakes","Toronto FC",
    "Vancouver Whitecaps"
]

export function ClubFilter({ column }: { column: any }) {
    const [open, setOpen] = React.useState(false)
    const currentFilter = (column?.getFilterValue() as string[]) ?? []
    const [selected, setSelected] = React.useState<string[]>(currentFilter)
  
    const toggle = (pos: string) => {
      setSelected((prev) =>
        prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos]
      )
    }
  
    const applyFilter = () => {
      column.setFilterValue(selected.length ? selected : undefined)
      setOpen(false)
    }
  
    const clearFilter = () => {
      setSelected([])
      column.setFilterValue(undefined)
      setOpen(false)
    }
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setOpen(true)}>Filter by Club</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select Clubs</DialogTitle>
                </DialogHeader> 
                <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
                    {CLUBS.map((club) => (
                        <label key={club} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                            checked={selected.includes(club)}
                            onCheckedChange={() => toggle(club)}
                        />
                        <span>{club}</span>
                        </label>
                    ))}
                </div>       
                <DialogFooter className="mt-4 flex justify-between">
                    <Button variant="ghost" onClick={clearFilter}>Clear</Button>
                    <Button onClick={applyFilter}>Apply</Button>
                </DialogFooter>                
            </DialogContent>
        </Dialog>
    )
}