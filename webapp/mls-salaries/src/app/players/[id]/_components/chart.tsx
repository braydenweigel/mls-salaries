"use client"

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis} from "recharts"
import { reports} from "@/lib/globals"
import React from "react"

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
    const isMobile = useIsMobile()

    return (
        <ChartContainer config={chartConfig}>
            <BarChart data={data}>
                <XAxis 
                    dataKey="report"
                    tickLine={false}
                    axisLine={false}
                    interval={0} // ensures all ticks show
                    tickFormatter={(key) => {{return (isMobile ? "" : reports[key].year + " " + reports[key].season)}}}
                    tick={{ fontSize: 10 }}
                />
                <YAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    width={70}
                    tickFormatter={(value: number) => {return `$${value.toLocaleString()}`}}
                    tick={{ fontSize: 10 }}
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


