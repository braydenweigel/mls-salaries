"use client"

import SelectReport from "@/components/lib/SelectReport"
import { useRouter } from "next/navigation"

export default function ClubsSelectReport({
  reports,
  defaultReport,
}: {
  reports: any
  defaultReport: string
}) {
  const router = useRouter()

  function handleChange(report: string) {
    router.replace(`/clubs?year=${report}`)
  }

  return (
    <SelectReport
      reports={reports}
      defaultReport={defaultReport}
      onReportValueChange={handleChange}
    />
  )
}