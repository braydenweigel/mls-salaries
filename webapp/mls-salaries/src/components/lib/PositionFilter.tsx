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

const POSITIONS = ["GK", "D", "D-M", "M-D", "M", "M-F", "F-M", "F"]

export function PositionFilter({ column }: { column: any }) {
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
                <Button variant="outline" onClick={() => setOpen(true)}>Filter by Position</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select Positions</DialogTitle>
                </DialogHeader> 
                <div className="flex flex-col gap-2">
                    {POSITIONS.map((pos) => (
                        <label key={pos} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                            checked={selected.includes(pos)}
                            onCheckedChange={() => toggle(pos)}
                        />
                        <span>{pos}</span>
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