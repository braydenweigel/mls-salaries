import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { ArrowRight } from "lucide-react"
import { Fragment } from "react"

export type ReportsListRow = {
    reportKey: string
    year: string
    season: string
}

interface Props {
    rows: ReportsListRow[]
}

export default function ReportsList({ rows }: Props){
    return (
        <div className="my-4">
            <h2 className="text-xl font-semibold">All reports</h2>
            <p className="text-sm text-muted-foreground">Jump to the full salary report for any season</p>
            <div className="mt-3">
                {rows.map((row, index) => (
                    <Fragment key={row.reportKey}>
                        {index > 0 && <Separator/>}
                        <Link
                            href={`/reports/${row.reportKey}`}
                            className="flex items-center justify-between px-3 py-3 text-sm hover:bg-muted"
                        >
                            <span className="font-medium">{row.season} {row.year}</span>
                            <ArrowRight className="size-4 text-muted-foreground"/>
                        </Link>
                    </Fragment>
                ))}
            </div>
        </div>
    )
}
