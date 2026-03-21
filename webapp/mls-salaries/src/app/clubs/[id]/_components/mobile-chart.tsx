"use client"

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis} from "recharts"

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

export default function MobileClubIDChart({
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
        <ChartContainer config={chartConfig} className="h-[55vh] w-full">
            <BarChart data={data} layout="vertical" margin={{left: 20}} height={800}>
                <YAxis 
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    hide
                />
                <XAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value: number) => {return `$${value.toLocaleString()}`}}
                    
                />

                <Bar 
                    dataKey="baseSal"
                    stackId="a"
                    fill={colors.bsColor}
                    barSize={20}
                />
                <Bar 
                    dataKey="guarComp"
                    stackId="a"
                    fill={colors.gcColor}
                    barSize={20}

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


