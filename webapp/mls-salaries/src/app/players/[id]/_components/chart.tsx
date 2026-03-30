"use client"

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, XAxis, YAxis} from "recharts"
import { reports } from "@/lib/globals"
import React from "react"
import { report } from "process"

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

    const ticks = data.map(d => d.report)

    return (
        <ChartContainer config={chartConfig}>
            <AreaChart data={data} margin={{ right: 16}}>
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
                    fill={colors.primary}
                    fillOpacity={1}
                    stroke={colors.secondary}
                    stackId="a"
                />
                <Area 
                    dataKey="guaranteedComp"
                    type="linear"
                    fill={colors.primary}
                    fillOpacity={0.7}
                    stroke={colors.secondary}
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
    )
}

const CustomTick = ({ x, y, payload }: any) => {
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


