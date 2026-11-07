"use client"

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, Customized, TextProps, XAxis, YAxis} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { reports } from "@/lib/globals"
import { formatCompactCurrency } from "@/lib/utils"
import React from "react"

const CHART_AREA_CLIP_ID = "player-chart-area-clip"
const CHART_AREA_GRADIENT_ID = "player-chart-area-gradient"

type ChartDatum = {
    report: string,
    baseSalary: number,
    guaranteedComp: number,
    club: string,
    position: string
}

interface Props {
    data: ChartDatum[],
    colors: {
        primary: string,
        secondary: string
    }
}

export default function PlayerIDChart({
    data,
    colors
}: Props){
    const isMobile = useIsMobile()
    const lastReport = data.length ? data[data.length - 1].report : ""
    const [selectedReport, setSelectedReport] = React.useState(lastReport)

    const selected = data.find(d => d.report === selectedReport) ?? data[data.length - 1]
    const selectedIndex = data.findIndex(d => d.report === selected?.report)
    const previousReport = selectedIndex > 0 ? data[selectedIndex - 1].report : null
    const nextReport = selectedIndex >= 0 && selectedIndex < data.length - 1 ? data[selectedIndex + 1].report : null

    const chartConfig: ChartConfig = {
        baseSalary: {
          label: "Base Salary",
          color: colors.primary,
        },
        guaranteedComp: {
          label: "Guaranteed Compensation",
          color: colors.primary,
        },
    }

    const ticks = isMobile
        ? [data[0], data[Math.floor((data.length - 1) / 2)], data[data.length - 1]]
            .filter(Boolean)
            .map(d => d.report)
        : data.map(d => d.report)

    const handleChartClick = (state: { activeLabel?: string | number }) => {
        if (!isMobile || state?.activeLabel === undefined || state.activeLabel === null) return

        const match = data.find(d => Number(d.report) === Number(state.activeLabel))
        if (match) setSelectedReport(match.report)
    }

    const renderDot = (dotProps: unknown): React.ReactElement => {
        const { cx, cy, payload } = dotProps as { cx?: number, cy?: number, payload?: ChartDatum }
        const isSelected = isMobile && payload?.report === selectedReport
        return <CustomDot cx={cx} cy={cy} color={colors.primary} isSelected={isSelected}/>
    }

    return (
        <Card className="py-4 gap-3 md:py-6 md:gap-6 my-4">
            <CardHeader className="px-4 md:px-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <CardTitle className="text-lg md:text-xl">Salary history</CardTitle>
                    <CardDescription className="hidden md:block">Each point is one report. Hover for details.</CardDescription>
                </div>
                <div className="flex items-center gap-4 text-xs md:text-sm text-muted-foreground shrink-0">
                    <span className="flex items-center gap-1.5">
                        <svg viewBox="0 0 16 10" className="h-2.5 w-4 shrink-0">
                            <line x1="0" y1="5" x2="16" y2="5" stroke={colors.primary} strokeWidth={2} strokeLinecap="round"/>
                        </svg>
                        <span className="md:hidden">Guaranteed</span>
                        <span className="hidden md:inline">Guaranteed comp.</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <svg viewBox="0 0 16 10" className="h-2.5 w-4 shrink-0">
                            <line x1="0" y1="5" x2="16" y2="5" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeDasharray="3 3"/>
                        </svg>
                        <span className="md:hidden">Base</span>
                        <span className="hidden md:inline">Base salary</span>
                    </span>
                </div>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
                {isMobile && selected && (
                    <div className="flex items-stretch gap-1 mb-3">
                        <Button
                            variant="outline"
                            className="h-auto w-7 shrink-0 rounded-md px-0"
                            onClick={() => previousReport && setSelectedReport(previousReport)}
                            disabled={!previousReport}
                            aria-label="Previous release"
                        >
                            <ChevronLeft className="size-4"/>
                        </Button>
                        <div className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
                            <span className="shrink-0 whitespace-nowrap font-semibold">{reports[selected.report].season} {reports[selected.report].year}</span>
                            <div className="flex flex-col items-end">
                                <span className="font-semibold">${selected.guaranteedComp.toLocaleString()}</span>
                                <span className="text-xs text-muted-foreground">Base ${selected.baseSalary.toLocaleString()}</span>
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
                <div className="player-salary-chart">
                    <style>{`
                        .player-salary-chart .recharts-area-area {
                            clip-path: url(#${CHART_AREA_CLIP_ID});
                        }
                    `}</style>
                    <ChartContainer config={chartConfig} className="aspect-auto h-40 md:h-56">
                        <AreaChart
                            data={data}
                            margin={{ right: isMobile ? 4 : 24, bottom: isMobile ? 0 : undefined}}
                            onClick={handleChartClick}
                        >
                            <Customized component={ChartAreaClipDefs}/>
                            <defs>
                                <linearGradient id={CHART_AREA_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={colors.primary} stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor={colors.primary} stopOpacity={0.4}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} fill="var(--secondary)" fillOpacity={1} ry={8}/>
                            <XAxis
                                dataKey="report"
                                type="number"
                                domain={['dataMin', 'dataMax']}
                                tickLine={false}
                                axisLine={false}
                                interval={0} // ensures all ticks show
                                ticks={ticks}
                                tick={isMobile ? <CustomTick compact ticks={ticks}/> : <CustomTick />}
                                height={isMobile ? 20 : undefined}
                            />
                            <YAxis
                                type="number"
                                tickLine={false}
                                axisLine={false}
                                width={isMobile ? 36 : 70}
                                tickCount={isMobile ? 3 : undefined}
                                tickFormatter={(value: number) => {return isMobile ? formatCompactCurrency(value) : `$${value.toLocaleString()}`}}
                                tick={{ fontSize: isMobile ? 9 : 10 }}
                            />
                            <Area
                                dataKey="guaranteedComp"
                                type="linear"
                                fill={`url(#${CHART_AREA_GRADIENT_ID})`}
                                stroke={colors.primary}
                                strokeWidth={2.5}
                                dot={(dotProps: unknown) => renderDot(dotProps) as React.ReactElement<SVGElement>}
                                activeDot={{ r: isMobile ? 4 : 5 }}
                            />
                            <Area
                                dataKey="baseSalary"
                                type="linear"
                                fill="none"
                                stroke={colors.primary}
                                strokeWidth={2.5}
                                strokeDasharray="5 5"
                                dot={(dotProps: unknown) => renderDot(dotProps) as React.ReactElement<SVGElement>}
                                activeDot={{ r: isMobile ? 4 : 5 }}
                            />
                            {!isMobile && (
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent
                                        className="min-w-24 gap-1 px-2 py-1 text-[10px] md:min-w-32 md:gap-1.5 md:px-2.5 md:py-1.5 md:text-xs"
                                        labelFormatter={(value) => {return (reports[value].year + " " + reports[value].season)}}
                                        formatter={(value, name, item) => {
                                            if (item.payload.baseSalary == 0 && item.payload.guaranteedComp == 0) return null

                                            if (name === "guaranteedComp"){
                                                return `Guaranteed Compensation: $${value.toLocaleString()}`
                                            }
                                            return `Base Salary: $${value.toLocaleString()}`
                                        }}
                                    />
                                    }
                                />
                            )}
                        </AreaChart>
                    </ChartContainer>
                </div>
                {isMobile && (
                    <p className="mt-2 text-xs text-foreground">Tap a release on the chart to see its numbers.</p>
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

type CustomDotProps = {
  cx?: number
  cy?: number
  payload?: ChartDatum
  color: string
  isSelected?: boolean
}

const CustomDot = ({ cx, cy, color, isSelected }: CustomDotProps) => {
  if (cx === undefined || cy === undefined) return <circle cx={0} cy={0} r={0} fill={color}/>

  return <circle cx={cx} cy={cy} r={isSelected ? 5 : 3} fill={color}/>
}

type CustomTickProps = TextProps & {
  x?: number
  y?: number
  payload?: {
    value: string | number
  }
  compact?: boolean
  ticks?: string[]
}

const CustomTick = ({ x, y, payload, compact, ticks }: CustomTickProps) => {
  if (!payload) return null

  const report = reports[String(payload.value)]

  if (!report) return null

  const seasonLabel = report.season === "Spring" ? "Spr" : report.season

  if (compact){
    let anchor: "start" | "middle" | "end" = "middle"
    if (ticks && ticks.length > 1){
      if (String(payload.value) === ticks[0]) anchor = "start"
      else if (String(payload.value) === ticks[ticks.length - 1]) anchor = "end"
    }

    return (
      <text x={x} y={y} dy="0.9em" textAnchor={anchor} className="fill-muted-foreground text-[10px]">
        {seasonLabel} &apos;{report.year.slice(2)}
      </text>
    )
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" dy="0.9em" className="fill-muted-foreground text-xs">
        {seasonLabel} &apos;{report.year.slice(2)}
      </text>
    </g>
  )
}

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    setIsMobile(media.matches);

    const listener = () => setIsMobile(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  return isMobile;
}
