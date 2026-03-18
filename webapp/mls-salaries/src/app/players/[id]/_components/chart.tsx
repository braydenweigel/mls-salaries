"use client"

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis} from "recharts"
import { reports} from "@/lib/globals"

interface Props {
    data: {
        report: string,
        baseSalary: number,
        guaranteedComp: number,
        club: string,
        position: string
    }[]
    colors: {
        bsColor: string,
        gcColor: string
    }

}

export default function PlayerIDChart({
    data,
    colors
}: Props){
    const chartConfig: ChartConfig = {
        baseSalary: {
          label: "Base Salary",
          color: colors.bsColor,
        },
        guaranteedComp: {
          label: "Guaranteed Compensation",
          color: colors.gcColor,
        },
    } 

    return (
        <ChartContainer config={chartConfig}>
            <BarChart data={data}>
                <XAxis 
                    dataKey="report"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(key) => {return (reports[key].year + " " + reports[key].season)}}
                />
                <Bar 
                    dataKey="baseSalary"
                    stackId="a"
                    fill={colors.bsColor}
                />
                <Bar 
                    dataKey="guaranteedComp"
                    stackId="a"
                    fill={colors.gcColor}
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
            </BarChart>
        </ChartContainer>
    )
}


