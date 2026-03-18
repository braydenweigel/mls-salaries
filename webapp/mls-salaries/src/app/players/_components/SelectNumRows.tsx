"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface RowsPerPageSelectProps {
    pageSize: number
    dataSize: number
    onPageSizeChange: (size: number) => void
}


export default function SelectNumRows({
    pageSize,
    dataSize,
    onPageSizeChange
}: RowsPerPageSelectProps){
    const options = [
        {size: 10, label: "10"},
        {size: 25, label: "25"},
        {size: 50, label: "50"},
        {size: 100, label: "100"},
        {size: dataSize, label: "All"},
    ]

    return (
        <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
            <SelectTrigger className="w-[80px] self-end">
                <SelectValue/>
             </SelectTrigger>
             <SelectContent>
                {options.map((size) => (
                    <SelectItem key={size.size} value={String(size.size)}>
                        {size.label}
                    </SelectItem>
                ))}
        </SelectContent>


        </Select>
    )
}