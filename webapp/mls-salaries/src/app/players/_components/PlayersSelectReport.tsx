"use client"

import SelectReport from "@/components/lib/SelectReport"
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

  return (
    <SelectReport
      reports={reports}
      defaultReport={defaultReport}
      onReportValueChange={handleChange}
    />
  )
}