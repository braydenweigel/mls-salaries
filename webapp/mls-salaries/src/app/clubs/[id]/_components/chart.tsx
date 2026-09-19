"use client"

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Customized, XAxis, YAxis} from "recharts"

const CHART_BAR_CLIP_ID = "club-id-bar-chart-clip"

interface Props {
    data: {
        id: string,
        name: string,
        position: string,
        baseSal: number,
        guarComp: number
    }[]
    colors: {
        primary: string,
        secondary: string
    }

}

export default function ClubIDChart({
    data,
    colors
}: Props){
    const chartConfig: ChartConfig = {
        baseSal: {
          label: "Base Salary",
          color: colors.primary,
        },
        guarComp: {
          label: "Guaranteed Compensation",
          color: colors.secondary,
        },
    } 

    return (
        <div className="club-id-bar-chart">
            <style>{`
                .club-id-bar-chart .recharts-bar-rectangle {
                    clip-path: url(#${CHART_BAR_CLIP_ID});
                }
            `}</style>
            <ChartContainer config={chartConfig} className="">
                <BarChart data={data}>
                    <Customized component={ChartBarClipDefs}/>
                    <CartesianGrid vertical={false} fill="var(--secondary)" fillOpacity={1} ry={8}/>
                    <XAxis
                        dataKey="name"
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
                        fill={colors.primary}
                    />
                    <Bar
                        dataKey="guarComp"
                        stackId="a"
                        fill={colors.primary}
                        fillOpacity={0.7}

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
        </div>
    )
}

type ChartBarClipDefsProps = {
  offset?: { left: number, top: number, width: number, height: number }
}

const ChartBarClipDefs = ({ offset }: ChartBarClipDefsProps) => {
  if (!offset) return null

  return (
    <defs>
      <clipPath id={CHART_BAR_CLIP_ID}>
        <rect x={offset.left} y={offset.top} width={offset.width} height={offset.height} rx={8} ry={8}/>
      </clipPath>
    </defs>
  )
}


