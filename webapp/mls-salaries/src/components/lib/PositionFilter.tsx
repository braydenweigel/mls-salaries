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
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

const POSITIONS = ["GK", "D", "D-M", "M-D", "M", "M-F", "F-M", "F"]

interface Props {
    value: string[]
    onChange: (value: string[]) => void
}

export function PositionFilter({ value, onChange }: Props) {
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={value.length ? "secondary" : "outline"} className={cn("text-xs md:text-sm", !value.length && "border-dashed")} onClick={() => setOpen(true)}>
                    <Plus className="size-4"/>
                    Position{value.length ? ` (${value.length})` : ""}
                </Button>
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