"use client"

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, Customized, TextProps, XAxis, YAxis} from "recharts"
import { reports } from "@/lib/globals"
import { formatCompactCurrency } from "@/lib/utils"
import React from "react"

const CHART_AREA_CLIP_ID = "player-chart-area-clip"

interface Props {
    data: {
        report: string,
        baseSalary: number,
        guaranteedComp: number,
        club: string,
        position: string
    }[],
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
    const chartConfig: ChartConfig = {
        baseSalary: {
          label: "Base Salary",
          color: colors.primary,
        },
        guaranteedComp: {
          label: "Guaranteed Compensation",
          color: colors.primary + "B3",
        },
    } 

    const ticks: string[] = []
    data.map(d => {
        if (reports[d.report].season === "Fall"){
            ticks.push(d.report)
        } 
    })

    return (
        <div className="player-salary-chart">
            <style>{`
                .player-salary-chart .recharts-area-area {
                    clip-path: url(#${CHART_AREA_CLIP_ID});
                }
            `}</style>
            <ChartContainer config={chartConfig} className="h-40 md:h-auto">
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
                        tick={isMobile ? false : <CustomTick />}
                    />
                    <YAxis
                        type="number"
                        tickLine={false}
                        axisLine={false}
                        width={isMobile ? 36 : 70}
                        tickFormatter={(value: number) => {return isMobile ? formatCompactCurrency(value) : `$${value.toLocaleString()}`}}
                        tick={{ fontSize: isMobile ? 9 : 10 }}
                    />
                    <Area
                        dataKey="baseSalary"
                        type="linear"
                        fill={colors.primary}
                        fillOpacity={1}
                        stroke={colors.primary}
                        stackId="a"
                    />
                    <Area
                        dataKey="guaranteedComp"
                        type="linear"
                        fill={colors.primary}
                        fillOpacity={0.7}
                        stroke={colors.primary}
                        stackId="a"
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent
                            className="min-w-24 gap-1 px-2 py-1 text-[10px] md:min-w-32 md:gap-1.5 md:px-2.5 md:py-1.5 md:text-xs"
                            labelFormatter={(value) => {return (reports[value].year + " " + reports[value].season)}}
                            formatter={(value, name, item) => {
                                if (item.payload.baseSalary == 0 && item.payload.guaranteedComp == 0) return null
                                const base = item?.payload?.baseSalary ?? 0

                                if (name === "guaranteedComp"){
                                    return `${isMobile ? "Total" : "Guaranteed Compensation"}: $${(base + value).toLocaleString()}`
                                }
                                return `${isMobile ? "Base" : "Base Salary"}: $${value.toLocaleString()}`
                            }}
                        />
                        }
                    />
                    <ChartLegend content={<ChartLegendContent/>}/>
                </AreaChart>
            </ChartContainer>
        </div>
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
      <text textAnchor="middle">
        <tspan x="0" dy="0.4em">{report.year}</tspan>
        <tspan x="0" dy="1.2em">{report.season}</tspan>
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

