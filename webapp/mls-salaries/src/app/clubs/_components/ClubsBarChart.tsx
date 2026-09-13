"use client"

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

interface Props {
    data: {
        clubName: string,
        baseSal: number,
        guarComp: number
    }[]
}

export default function ClubsBarChart({
    data
}: Props){
    const chartConfig: ChartConfig = {
        baseSal: {
          label: "Base Salary",
          color: "#3b82f6",
        },
        guarComp: {
          label: "Guaranteed Compensation",
          color: "#3b82f6",
        },
    }

    return (
        <ChartContainer config={chartConfig}>
            <BarChart data={data}>
                <XAxis
                    dataKey="clubName"
                    tickLine={false}
                    axisLine={false}
                    interval={0} // ensures all ticks show
                    angle={-45}
                    textAnchor="end"
                    height={120} // add more height so labels fit
                    tick={{ fontSize: 12 }}
                />
                <YAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    width={80}
                    tickFormatter={(value: number) => {return `$${value.toLocaleString()}`}}
                />

                <Bar
                    dataKey="baseSal"
                    stackId="a"
                    fill="#3b82f6"
                />
                <Bar
                    dataKey="guarComp"
                    stackId="a"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent
                        formatter={(value, name, item) => {
                            if (item.payload.baseSal == 0 && item.payload.guarComp == 0) return null
                            const base = item?.payload?.baseSal ?? 0

                            if (name === "guarComp"){
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
