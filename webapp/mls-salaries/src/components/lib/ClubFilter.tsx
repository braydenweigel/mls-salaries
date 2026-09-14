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

export function ClubFilter({
     value,
     onChange,
     clubs
}: {
    value: string[];
    onChange: (value: string[]) => void;
    clubs: string[]
}) {
    const [open, setOpen] = React.useState(false)
    const [selected, setSelected] = React.useState<string[]>(value)

    React.useEffect(() => {
        if (open) setSelected(value)
    }, [open, value])

    const toggle = (pos: string) => {
      setSelected((prev) =>
        prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos]
      )
    }

    const applyFilter = () => {
      onChange(selected)
      setOpen(false)
    }

    const clearFilter = () => {
      setSelected([])
      onChange([])
      setOpen(false)
    }

    clubs.sort()
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="text-xs md:text-sm" onClick={() => setOpen(true)}>Filter by Club</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select Clubs</DialogTitle>
                </DialogHeader> 
                <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
                    {clubs.map((club) => (
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