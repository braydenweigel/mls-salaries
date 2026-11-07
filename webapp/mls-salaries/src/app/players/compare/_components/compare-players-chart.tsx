import { Fragment, useEffect, useState } from "react"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartConfig, ChartContainer, ChartLegend, ChartTooltip } from "@/components/ui/chart"
import { PlayerData, PlayerList } from "../page"
import { Area, AreaChart, CartesianGrid, Customized, ReferenceLine, TextProps, TooltipContentProps, XAxis, YAxis } from "recharts"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { reports } from "@/lib/globals"
import { compareColors as colors } from "@/lib/compare-players-utils"
import { cn, formatCompactCurrency } from "@/lib/utils"

const CHART_AREA_CLIP_ID = "compare-players-chart-area-clip"
const MOBILE_TICK_COUNT = 4

type ComparePlayersChartProps = {
    playerList: PlayerList
}

type Metric = "guarComp" | "baseSal"

const METRIC_OPTIONS: { value: Metric; label: string; shortLabel: string }[] = [
    { value: "guarComp", label: "Guaranteed comp.", shortLabel: "Guaranteed" },
    { value: "baseSal", label: "Base salary", shortLabel: "Base" },
]

type ComparePlayersChartData = {
    name_a: string | null,
    baseSal_a: number | null,
    guarComp_a: number | null,
    name_b: string | null,
    baseSal_b: number | null,
    guarComp_b: number | null,
    name_c: string | null,
    baseSal_c: number | null,
    guarComp_c: number | null,
    name_d: string | null,
    baseSal_d: number | null,
    guarComp_d: number | null
    report: string
}

const emptyRow: ComparePlayersChartData = {
    name_a: null,
    baseSal_a: null,
    guarComp_a: null,
    name_b: null,
    baseSal_b: null,
    guarComp_b: null,
    name_c: null,
    baseSal_c: null,
    guarComp_c: null,
    name_d: null,
    baseSal_d: null,
    guarComp_d: null,
    report: ""
}

export default function ComparePlayersChart({playerList}: ComparePlayersChartProps){
    const [metric, setMetric] = useState<Metric>("guarComp")
    const [selectedReport, setSelectedReport] = useState<string | null>(null)
    const isMobile = useIsMobile()

    const chartConfig: ChartConfig = {
        baseSal_a: { label: "Base Salary" }, guarComp_a: { label: "Guaranteed Compensation" },
        baseSal_b: { label: "Base Salary" }, guarComp_b: { label: "Guaranteed Compensation" },
        baseSal_c: { label: "Base Salary" }, guarComp_c: { label: "Guaranteed Compensation" },
        baseSal_d: { label: "Base Salary" }, guarComp_d: { label: "Guaranteed Compensation" },
    }

    const data = formatChartData(playerList)
    const ticks: string[] = []
    data.map(d => {
        if (reports[d.report].season === "Fall"){
            ticks.push(d.report)
        }
    })
    const xTicks = isMobile ? thinTicks(ticks, MOBILE_TICK_COUNT) : ticks

    // Default to the most recent release; fall back to it again if the current
    // selection falls out of range (e.g. after removing a player changes the data span).
    const activeReport = selectedReport && data.some((d) => d.report === selectedReport)
        ? selectedReport
        : data[data.length - 1]?.report ?? null
    const activeReportInfo = activeReport ? reports[activeReport] : null
    const activeRow = data.find((d) => d.report === activeReport)
    const metricLabel = metric === "guarComp" ? "Guaranteed comp." : "Base salary"

    const activeIndex = data.findIndex((d) => d.report === activeReport)
    const previousReport = activeIndex > 0 ? data[activeIndex - 1].report : null
    const nextReport = activeIndex >= 0 && activeIndex < data.length - 1 ? data[activeIndex + 1].report : null

    const activeEntries = activeRow
        ? playerList.data
            .map((entry, index) => {
                if (!entry.player) return null
                const name = activeRow[`name_${entry.stackID}` as keyof ComparePlayersChartData] as string | null
                const value = activeRow[`${metric}_${entry.stackID}` as keyof ComparePlayersChartData] as number | null
                if (name === null || value === null) return null
                return { name, value, color: colors[index] }
            })
            .filter((entry): entry is { name: string; value: number; color: string } => entry !== null)
            .sort((a, b) => b.value - a.value)
        : []

    return (
      <Card>
          <CardHeader className="px-3 sm:px-6">
              <CardTitle>Salary over time</CardTitle>
              <CardDescription className="hidden sm:block">
                  {metric === "guarComp" ? "Guaranteed compensation" : "Base salary"} by release. Gaps mean the player wasn&apos;t in that report.
              </CardDescription>
              <CardAction>
                  <div className="flex items-center gap-1 rounded-md bg-muted p-1">
                      {METRIC_OPTIONS.map((option) => (
                          <button
                              key={option.value}
                              type="button"
                              onClick={() => setMetric(option.value)}
                              className={cn(
                                  "rounded-sm px-3 py-1.5 text-xs font-medium transition-colors",
                                  metric === option.value ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                              )}
                          >
                              <span className="hidden sm:inline">{option.label}</span>
                              <span className="sm:hidden">{option.shortLabel}</span>
                          </button>
                      ))}
                  </div>
              </CardAction>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
              {isMobile && activeReportInfo && (
                  <div className="mb-3 flex items-stretch gap-1">
                      <Button
                          variant="outline"
                          className="h-auto w-7 shrink-0 rounded-md px-0"
                          onClick={() => previousReport && setSelectedReport(previousReport)}
                          disabled={!previousReport}
                          aria-label="Previous release"
                      >
                          <ChevronLeft className="size-4"/>
                      </Button>
                      <div className="min-w-0 flex-1 rounded-lg border bg-muted p-3">
                          <p className="text-xs mb-2">
                              {activeReportInfo.year} {activeReportInfo.season} · {metricLabel}
                          </p>
                          <div className="flex flex-col gap-1.5">
                              {activeEntries.map((entry) => (
                                  <div key={entry.name} className="flex items-center justify-between gap-2 text-sm">
                                      <span className="flex items-center gap-1.5 min-w-0">
                                          <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: entry.color }}/>
                                          <span className="truncate">{entry.name}</span>
                                      </span>
                                      <span className="font-semibold tabular-nums shrink-0">${entry.value.toLocaleString()}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                      <Button
                          variant="outline"
                          className="h-auto w-7 shrink-0 rounded-md px-0"
                          onClick={() => nextReport && setSelectedReport(nextReport)}
                          disabled={!nextReport}
                          aria-label="Next release"
                      >
                          <ChevronRight className="size-4"/>
                      </Button>
                  </div>
              )}
              <div className="compare-players-chart">
                  <style>{`
                      .compare-players-chart .recharts-area-area {
                          clip-path: url(#${CHART_AREA_CLIP_ID});
                      }
                  `}</style>
                  <ChartContainer config={chartConfig} className="px-0 sm:px-4 aspect-auto h-[220px] sm:h-[280px] pt-2">
                      <AreaChart
                          data={data}
                          margin={{ right: 16}}
                          onClick={(state) => {
                              if (state?.activeLabel !== undefined && state.activeLabel !== null) {
                                  setSelectedReport(String(state.activeLabel))
                              }
                          }}
                      >
                          <Customized component={ChartAreaClipDefs}/>
                          <CartesianGrid vertical={false} fill="var(--secondary)" fillOpacity={1} ry={8}/>
                          <XAxis
                              dataKey="report"
                              type="number"
                              domain={['dataMin', 'dataMax']}
                              tickLine={false}
                              axisLine={false}
                              interval={0} // ensures all ticks show
                              ticks={xTicks}
                              tick={<CustomTick yearOnly={isMobile}/>}
                          />
                          <YAxis
                              type="number"
                              tickLine={false}
                              axisLine={false}
                              width={isMobile ? 48 : 80}
                              tickFormatter={(value: number) => isMobile ? formatCompactCurrency(value) : `$${value.toLocaleString()}`}
                          />
                          {isMobile && activeReport && (
                              <ReferenceLine x={Number(activeReport)} stroke="var(--border)" strokeWidth={1}/>
                          )}
                          {playerList.data.map((player, index) => (
                              player.player &&
                                  <Fragment key={player.stackID}>
                                      <Area
                                          dataKey={`${metric}_${player.stackID}`}
                                          type="linear"
                                          stroke={colors[index]}
                                          strokeWidth={2}
                                          fill={colors[index]}
                                          fillOpacity={0}
                                          dot={<CustomDot color={colors[index]} activeReport={isMobile ? activeReport : null}/>}
                                          connectNulls={false}
                                      />
                                  </Fragment>
                          ))}
                          {!isMobile && <ChartTooltip cursor={false} content={<CustomTooltip metric={metric}/>}/>}
                          {!isMobile && <ChartLegend content={<CustomLegend players={playerList.data}/>}/>}
                      </AreaChart>
                  </ChartContainer>
              </div>
              {isMobile && (
                  <p className="text-xs text-muted-foreground mt-2">
                      Tap the chart to pick a report. Gaps mean the player wasn&apos;t in that report.
                  </p>
              )}
          </CardContent>
      </Card>
    )
}

type ChartAreaClipDefsProps = {
  offset?: { left: number, top: number, width: number, height: number }
}

const ChartAreaClipDefs = ({ offset }: ChartAreaClipDefsProps) => {
  if (!offset) return null

  return (
    <defs>
      <clipPath id={CHART_AREA_CLIP_ID}>
        <rect x={offset.left} y={offset.top} width={offset.width} height={offset.height} rx={8} ry={8}/>
      </clipPath>
    </defs>
  )
}

function thinTicks(allTicks: string[], maxCount: number){
    if (allTicks.length <= maxCount) return allTicks

    const step = (allTicks.length - 1) / (maxCount - 1)
    const thinned = new Set<string>()
    for (let i = 0; i < maxCount; i++){
        thinned.add(allTicks[Math.round(i * step)])
    }
    return [...thinned]
}

function formatChartData(playerList: PlayerList){
    const chartData: ComparePlayersChartData[] = []

    const reportsList = []
    for (const key in reports){
        if (Number(key) >= Number(playerList.min) && Number(key) <= Number(playerList.max)){
            reportsList.push(key)
        }
    }
    reportsList.sort((a, b) => Number(b) - Number(a))

    for (const key of reportsList){
        if (Number(key) >= Number(playerList.min) && Number(key) <= Number(playerList.max)){
            const row: ComparePlayersChartData = structuredClone(emptyRow)
            row.report = key

            for (const player of playerList.data){
                if (player.player) {
                    const report = reports[key]
                    const match = player.player.records.find((record) => record.recordyear === report.year && record.recordseason === report.season)

                    if (match){
                        row[`name_${player.stackID}`] = match.firstname + " " + match.lastname

                        let bS = 0
                        let gC = 0

                        if (!match.basesalary){
                            bS = match.guaranteedcomp ?? 0
                        } else {
                            bS = match.basesalary
                            gC = match.guaranteedcomp - match.basesalary
                        }

                        row[`baseSal_${player.stackID}`] = bS
                        row[`guarComp_${player.stackID}`] = gC + bS

                    }
                }

            }
            chartData.push(row)
        }
    }
    return chartData.toReversed()
}

type CustomTooltipEntry = {
  dataKey?: string
  color?: string
  payload?: ComparePlayersChartData
}

type CustomTooltipProps = Partial<TooltipContentProps<number, string>> & {
  metric: "guarComp" | "baseSal"
}

const CustomTooltip = ({ active, payload, metric }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-background border rounded-md p-2 shadow">
      {payload?.[0]?.payload && (() => {
        const reportKey = payload[0].payload.report
        const reportInfo = reports[reportKey]

        if (!reportInfo) return null

        return (
          <div className="font-semibold mb-1">
            {reportInfo.year} {reportInfo.season}
          </div>
        )
      })()}
      {payload.map((entry, index) => {
        const e = entry as CustomTooltipEntry

        const dataKey = e.dataKey
        if (!dataKey) return null

        // extract suffix (a, b, c, d)
        const suffix = dataKey.split("_")[1]

        const row = e.payload
        if (!row) return null

        const name = row[`name_${suffix}` as keyof ComparePlayersChartData] as string | null
        const value = row[`${metric}_${suffix}` as keyof ComparePlayersChartData] as number | null

        if (name === null || value === null) return null

        return (
          <div key={index} className="flex items-center gap-2">
            {/* color box */}
            <div
              className="w-3 h-3 rounded-xs"
              style={{ backgroundColor: entry.color }}
            />

            <div className="flex flex-row w-full justify-between">
              <p>{name}:&nbsp;</p> <p> ${value.toLocaleString()}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

type PlayerEntry = {
  stackID: string
  player: PlayerData | null
}

type CustomLegendProps = {
  players: PlayerEntry[]
}

const CustomLegend = ({ players }: CustomLegendProps) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center pt-4">
      {players.map((player: { stackID: string, player: PlayerData | null}, index) =>
        player.player ? (
          <div
            key={player.stackID}
            className="flex items-center gap-2"
          >
            {/* color box */}
            <div
              className="w-3 h-3 rounded-xs"
              style={{ backgroundColor: colors[index] }}
            />

            {/* player name */}
            <span>{player.player.records[0]?.firstname} {player.player.records[0]?.lastname}</span>
          </div>
        ) : null
      )}
    </div>
  )
}

type CustomDotProps = {
  cx?: number
  cy?: number
  payload?: ComparePlayersChartData
  color: string
  activeReport: string | null
}

const CustomDot = ({ cx, cy, payload, color, activeReport }: CustomDotProps) => {
  if (cx === undefined || cy === undefined) return null

  const isActive = activeReport !== null && payload?.report === activeReport

  return (
    <circle
      cx={cx}
      cy={cy}
      r={isActive ? 5 : 4}
      fill={isActive ? color : "var(--background)"}
      stroke={color}
      strokeWidth={2}
    />
  )
}

type CustomTickProps = TextProps & {
  x?: number
  y?: number
  payload?: {
    value: string | number
  }
  yearOnly?: boolean
}

const CustomTick = ({ x, y, payload, yearOnly }: CustomTickProps) => {
  if (!payload) return null
  const report = reports[String(payload.value)]

  if (!report) return null

  if (yearOnly){
    return (
      <g transform={`translate(${x},${y})`}>
        <text textAnchor="middle" dy="0.9em" className="fill-muted-foreground text-xs">
          {report.year}
        </text>
      </g>
    )
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" className="fill-muted-foreground">
        <tspan x="0" dy="0.4em">{report.year}</tspan>
        <tspan x="0" dy="1.2em">{report.season}</tspan>
      </text>
    </g>
  )
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");
    setIsMobile(media.matches);

    const listener = () => setIsMobile(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  return isMobile;
}
