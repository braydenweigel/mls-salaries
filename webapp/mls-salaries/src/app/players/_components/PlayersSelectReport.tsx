"use client"

import SelectReport from "@/components/lib/SelectReport"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PlayersSelectReport({
  reports,
  defaultReport,
}: {
  reports: Record<string, { year: string; season: string }>
  defaultReport: string
}) {
  const router = useRouter()

  function handleChange(report: string) {
    router.replace(`/players?year=${report}`)
  }

  const reportKeys = Object.keys(reports).sort((a, b) => Number(a) - Number(b))
  const currentIndex = reportKeys.indexOf(defaultReport)
  const prevKey = currentIndex > 0 ? reportKeys[currentIndex - 1] : null
  const nextKey = currentIndex >= 0 && currentIndex < reportKeys.length - 1 ? reportKeys[currentIndex + 1] : null

  return (
    <ButtonGroup className="w-full md:w-fit">
      <Button
        variant="outline"
        size="icon"
        className="shrink-0"
        onClick={() => prevKey && handleChange(prevKey)}
        disabled={!prevKey}
        aria-label="Previous report"
      >
        <ChevronLeft/>
      </Button>
      <SelectReport
        reports={reports}
        defaultReport={defaultReport}
        onReportValueChange={handleChange}
        icon={<Calendar className="size-4 text-muted-foreground"/>}
        className="flex-1 min-w-0 rounded-none text-xs md:flex-none md:w-[150px] md:text-sm"
      />
      <Button
        variant="outline"
        size="icon"
        className="shrink-0"
        onClick={() => nextKey && handleChange(nextKey)}
        disabled={!nextKey}
        aria-label="Next report"
      >
        <ChevronRight/>
      </Button>
    </ButtonGroup>
  )
}
