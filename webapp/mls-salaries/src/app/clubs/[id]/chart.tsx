"use client"

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, TooltipProps} from "recharts"
import { reports } from "@/lib/globals"

interface Props {
    data: {
        id: string,
        name: string,
        position: string,
        baseSal: number,
        guarComp: number
    }[]
    colors: {
        bsColor: string,
        gcColor: string
    }

}

export default function ClubIDChart({
    data,
    colors
}: Props){
    const chartConfig: ChartConfig = {
        baseSal: {
          label: "Base Salary",
          color: colors.bsColor,
        },
        guarComp: {
          label: "Guaranteed Compensation",
          color: colors.gcColor,
        },
    } 

    return (
        <ChartContainer config={chartConfig} className="">
            <BarChart data={data}>
                <XAxis 
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    interval={0} // ensures all ticks show
                    angle={-45}
                    textAnchor="end"
                    height={80} // add more height so labels fit
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
                    fill={colors.bsColor}
                />
                <Bar 
                    dataKey="guarComp"
                    stackId="a"
                    fill={colors.gcColor}

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

