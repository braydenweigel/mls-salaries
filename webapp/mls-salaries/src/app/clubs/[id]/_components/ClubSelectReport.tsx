"use client"

import SelectReport from "@/components/lib/SelectReport"
import { useRouter } from "next/navigation"

export default function ClubSelectReport({
  reports,
  defaultReport,
  clubId,
}: {
  reports: Record<string, { year: string; season: string }>
  defaultReport: string
  clubId: string
}) {
  const router = useRouter()

  function handleChange(report: string) {
    router.replace(`/clubs/${clubId}?year=${report}`)
  }

  return (
    <SelectReport
      reports={reports}
      defaultReport={defaultReport}
      onReportValueChange={handleChange}
    />
  )
}