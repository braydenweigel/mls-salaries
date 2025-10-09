"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ReportSelectProps {
    reports: Object
    defaultReport: string
    onReportValueChange: (report: string) => void
}

export default function SelectReport({
    reports,
    defaultReport,
    onReportValueChange,
}: ReportSelectProps){

    return (
        <Select defaultValue={defaultReport} onValueChange={(value) => onReportValueChange(value)} >
          <SelectTrigger className="w-[180px]">
            <SelectValue/>
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            {Object.entries(reports)
              .sort((a, b) => Number(b[0]) - Number(a[0]))
              .map(([key, report]) => (
              <SelectItem key={key} value={key}>
                {report.year} {report.season}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
    )
}