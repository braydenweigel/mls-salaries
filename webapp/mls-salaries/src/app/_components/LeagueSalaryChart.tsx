"use client"

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, Customized, TextProps, XAxis, YAxis} from "recharts"
import { reports } from "@/lib/globals"
import React from "react"

const CHART_AREA_CLIP_ID = "league-salary-chart-area-clip"

interface Props {
    data: {
        report: string,
        baseSalary: number,
        guaranteedComp: number
    }[]
}

export default function LeagueSalaryChart({
    data
}: Props){
    const chartConfig: ChartConfig = {
        baseSalary: {
          label: "Base Salary",
          color: "#3b82f6",
        },
        guaranteedComp: {
          label: "Guaranteed Compensation",
          color: "#3b82f6",
        },
    }

    const ticks: string[] = []
    data.map(d => {
        if (reports[d.report].season === "Fall"){
            ticks.push(d.report)
        }
    })

    return (
        <div className="league-salary-chart">
            <style>{`
                .league-salary-chart .recharts-area-area {
                    clip-path: url(#${CHART_AREA_CLIP_ID});
                }
            `}</style>
            <ChartContainer config={chartConfig} className="pt-2">
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
                        tick={<CustomTick />}
                    />
                    <YAxis
                        type="number"
                        tickLine={false}
                        axisLine={false}
                        width={70}
                        tickFormatter={(value: number) => {return `$${value.toLocaleString()}`}}
                        tick={{ fontSize: 10 }}
                    />
                    <Area
                        dataKey="baseSalary"
                        type="linear"
                        fill="#3b82f6"
                        fillOpacity={1}
                        stroke="#3b82f6"
                        stackId="a"
                    />
                    <Area
                        dataKey="guaranteedComp"
                        type="linear"
                        fill="#3b82f6"
                        fillOpacity={0.7}
                        stroke="#3b82f6"
                        stackId="a"
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent
                            labelFormatter={(value) => {return (reports[value].year + " " + reports[value].season)}}
                            formatter={(value, name, item) => {
                                if (item.payload.baseSalary == 0 && item.payload.guaranteedComp == 0) return null
                                const base = item?.payload?.baseSalary ?? 0

                                if (name === "guaranteedComp"){
                                    return `Guaranteed Compensation: $${(base + value).toLocaleString()}`
                                }
                                return `Base Salary: $${value.toLocaleString()}`
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
