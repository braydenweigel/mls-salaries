import { Fragment, useState } from "react"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartLegend, ChartTooltip } from "@/components/ui/chart"
import { PlayerData, PlayerList } from "../page"
import { Area, AreaChart, CartesianGrid, Customized, TextProps, TooltipProps, XAxis, YAxis } from "recharts"
import { reports } from "@/lib/globals"
import { compareColors as colors } from "@/lib/compare-players-utils"
import { cn } from "@/lib/utils"

const CHART_AREA_CLIP_ID = "compare-players-chart-area-clip"

type ComparePlayersChartProps = {
    playerList: PlayerList
}

type Metric = "guarComp" | "baseSal"

const METRIC_OPTIONS: { value: Metric; label: string }[] = [
    { value: "guarComp", label: "Guaranteed comp." },
    { value: "baseSal", label: "Base salary" },
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

    return (
      <Card className="hidden md:block">
          <CardHeader>
              <CardTitle>Salary over time</CardTitle>
              <CardDescription>
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
                              {option.label}
                          </button>
                      ))}
                  </div>
              </CardAction>
          </CardHeader>
          <CardContent>
              <div className="compare-players-chart">
                  <style>{`
                      .compare-players-chart .recharts-area-area {
                          clip-path: url(#${CHART_AREA_CLIP_ID});
                      }
                  `}</style>
                  <ChartContainer config={chartConfig} className="px-4 aspect-auto h-[280px] pt-2">
                      <AreaChart data={data} margin={{ right: 16}}>
                          <Customized component={ChartAreaClipDefs}/>
                          <CartesianGrid vertical={false} fill="var(--secondary)" fillOpacity={1} ry={8}/>
                          <XAxis
                              dataKey="report"
                              type="number"
                              domain={['dataMin', 'dataMax']}
                              tickLine={false}
                              axisLine={false}
                              interval={0} // ensures all ticks show
                              ticks={ticks}
                              tick={<CustomTick/>}
                          />
                          <YAxis
                              type="number"
                              tickLine={false}
                              axisLine={false}
                              width={80}
                              tickFormatter={(value: number) => {return `$${value.toLocaleString()}`}}
                          />
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
                                          dot={{ r: 4 }}
                                          connectNulls={false}
                                      />
                                  </Fragment>
                          ))}
                          <ChartTooltip cursor={false} content={<CustomTooltip metric={metric}/>}/>
                          <ChartLegend content={<CustomLegend players={playerList.data}/>}/>
                      </AreaChart>
                  </ChartContainer>
              </div>
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

type CustomTooltipProps = TooltipProps<number, string> & {
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

type CustomTickProps = TextProps & {
  x?: number
  y?: number
  payload?: {
    value: string | number
  }
}

const CustomTick = ({ x, y, payload }: CustomTickProps) => {
  if (!payload) return null
  const report = reports[String(payload.value)]

  if (!report) return null

  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" className="fill-muted-foreground">
        <tspan x="0" dy="0.4em">{report.year}</tspan>
        <tspan x="0" dy="1.2em">{report.season}</tspan>
      </text>
    </g>
  )
}