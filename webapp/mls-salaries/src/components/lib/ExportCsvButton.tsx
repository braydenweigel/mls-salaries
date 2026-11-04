"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Check, Copy, Download } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ExportCsvColumn<T> {
    key: keyof T
    label: string
    defaultVisible?: boolean
}

interface ExportCsvButtonProps<T> {
    data: T[]
    columns: ExportCsvColumn<T>[]
    filename?: string
    buttonLabel?: string
    buttonClassName?: string
    buttonVariant?: React.ComponentProps<typeof Button>["variant"]
    accentColor?: string
}

const PREVIEW_ROW_COUNT = 8

function formatCell(value: unknown): string {
    if (value === null || value === undefined) return ""
    return String(value)
}

function escapeCsvCell(value: string): string {
    if (/[",\n]/.test(value)) {
        return `"${value.replace(/"/g, '""')}"`
    }
    return value
}

export function buildCsv<T>(data: T[], columns: ExportCsvColumn<T>[]): string {
    const header = columns.map((col) => escapeCsvCell(col.label)).join(",")
    const rows = data.map((row) =>
        columns.map((col) => escapeCsvCell(formatCell(row[col.key]))).join(",")
    )
    return [header, ...rows].join("\n")
}

export function ExportCsvButton<T>({
    data,
    columns,
    filename = "export.csv",
    buttonLabel = "Export CSV",
    buttonClassName,
    buttonVariant = "outline",
    accentColor,
}: ExportCsvButtonProps<T>) {
    const [open, setOpen] = React.useState(false)
    const [visibleKeys, setVisibleKeys] = React.useState<Set<keyof T>>(
        () => new Set(columns.filter((c) => c.defaultVisible !== false).map((c) => c.key))
    )
    const [copied, setCopied] = React.useState(false)

    React.useEffect(() => {
        if (open) {
            setVisibleKeys(new Set(columns.filter((c) => c.defaultVisible !== false).map((c) => c.key)))
            setCopied(false)
        }
    }, [open, columns])

    const activeColumns = columns.filter((c) => visibleKeys.has(c.key))
    const csv = React.useMemo(() => buildCsv(data, activeColumns), [data, activeColumns])
    const previewRows = data.slice(0, PREVIEW_ROW_COUNT)

    const toggleColumn = (key: keyof T) => {
        setVisibleKeys((prev) => {
            const next = new Set(prev)
            if (next.has(key)) {
                if (next.size > 1) next.delete(key)
            } else {
                next.add(key)
            }
            return next
        })
    }

    const handleDownload = () => {
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(csv)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        } catch {
            // clipboard unavailable (e.g. insecure context); nothing to recover
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={buttonVariant} className={cn("text-xs md:text-sm", buttonClassName)}>
                    <Download className="size-4"/>
                    {buttonLabel}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Export CSV</DialogTitle>
                    <DialogDescription>
                        {data.length} row{data.length === 1 ? "" : "s"}. Choose the columns to include, then copy or download.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {columns.map((col) => (
                        <label key={String(col.key)} className="flex items-center gap-2 text-sm cursor-pointer">
                            <Checkbox
                                checked={visibleKeys.has(col.key)}
                                onCheckedChange={() => toggleColumn(col.key)}
                                style={accentColor && visibleKeys.has(col.key) ? { backgroundColor: accentColor, borderColor: accentColor } : undefined}
                            />
                            {col.label}
                        </label>
                    ))}
                </div>
                <div className="rounded-md border max-h-64 overflow-y-auto overflow-x-auto">
                    <Table className="text-xs">
                        <TableHeader>
                            <TableRow>
                                {activeColumns.map((col) => (
                                    <TableHead key={String(col.key)} className="whitespace-nowrap">
                                        {col.label}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {previewRows.length ? (
                                previewRows.map((row, i) => (
                                    <TableRow key={i}>
                                        {activeColumns.map((col) => (
                                            <TableCell key={String(col.key)} className="whitespace-nowrap">
                                                {formatCell(row[col.key])}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={activeColumns.length || 1} className="h-24 text-center text-muted-foreground">
                                        No data to preview.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                {data.length > PREVIEW_ROW_COUNT && (
                    <p className="-mt-2 text-xs text-muted-foreground">
                        Showing {PREVIEW_ROW_COUNT} of {data.length} rows.
                    </p>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={handleCopy} disabled={!activeColumns.length}>
                        {copied ? <Check className="size-4"/> : <Copy className="size-4"/>}
                        {copied ? "Copied" : "Copy CSV"}
                    </Button>
                    <Button
                        onClick={handleDownload}
                        disabled={!activeColumns.length}
                        style={accentColor ? { backgroundColor: accentColor } : undefined}
                    >
                        <Download className="size-4"/>
                        Download CSV
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
