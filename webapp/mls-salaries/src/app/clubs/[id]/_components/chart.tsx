"use client"

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, Customized, XAxis, YAxis} from "recharts"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { formatCompactCurrency } from "@/lib/utils"
import React from "react"

const CHART_BAR_CLIP_ID = "club-id-bar-chart-clip"

type ChartDatum = {
    id: string,
    name: string,
    position: string,
    baseSal: number,
    guarComp: number
}

interface Props {
    data: ChartDatum[]
    colors: {
        primary: string,
        secondary: string
    }

}

export default function ClubIDChart({
    data,
    colors
}: Props){
    const isMobile = useIsMobile()
    const lastName = data.length ? data[data.length - 1].name : ""
    const [selectedName, setSelectedName] = React.useState(lastName)

    const selected = data.find(d => d.name === selectedName) ?? data[data.length - 1]
    const selectedIndex = data.findIndex(d => d.name === selected?.name)
    const previousName = selectedIndex > 0 ? data[selectedIndex - 1].name : null
    const nextName = selectedIndex >= 0 && selectedIndex < data.length - 1 ? data[selectedIndex + 1].name : null

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

    const handleChartClick = (state: { activeLabel?: string | number }) => {
        if (!isMobile || state?.activeLabel === undefined || state.activeLabel === null) return

        const match = data.find(d => d.name === state.activeLabel)
        if (match) setSelectedName(match.name)
    }

    return (
        <div className="club-id-bar-chart">
            <CardHeader className="px-0 mb-4">
                <CardTitle className="text-lg md:text-xl">Roster salaries</CardTitle>
                <CardDescription>Base salary and guaranteed compensation by player.</CardDescription>
            </CardHeader>
            {isMobile && selected && (
                <div className="flex items-stretch gap-1 mb-3">
                    <Button
                        variant="outline"
                        className="h-auto w-7 shrink-0 rounded-md px-0"
                        onClick={() => previousName && setSelectedName(previousName)}
                        disabled={!previousName}
                        aria-label="Previous player"
                    >
                        <ChevronLeft className="size-4"/>
                    </Button>
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
                        <span className="min-w-0 truncate font-semibold">{selected.name}</span>
                        <div className="flex shrink-0 flex-col items-end">
                            <span className="font-semibold">${(selected.baseSal + selected.guarComp).toLocaleString()}</span>
                            <span className="text-xs text-muted-foreground">Base ${selected.baseSal.toLocaleString()}</span>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="h-auto w-7 shrink-0 rounded-md px-0"
                        onClick={() => nextName && setSelectedName(nextName)}
                        disabled={!nextName}
                        aria-label="Next player"
                    >
                        <ChevronRight className="size-4"/>
                    </Button>
                </div>
            )}
            <style>{`
                .club-id-bar-chart .recharts-bar-rectangle {
                    clip-path: url(#${CHART_BAR_CLIP_ID});
                }
            `}</style>
            <ChartContainer config={chartConfig} className={isMobile ? "aspect-auto h-48" : "aspect-auto h-[360px]"}>
                <BarChart data={data} onClick={handleChartClick}>
                    <Customized component={ChartBarClipDefs}/>
                    <CartesianGrid vertical={false} fill="var(--secondary)" fillOpacity={1} ry={8}/>
                    <XAxis
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        interval={0} // ensures all ticks show
                        angle={-45}
                        textAnchor="end"
                        height={isMobile ? 20 : 70}
                        tick={isMobile ? false : { fontSize: 12 }}
                        tickFormatter={(value: string) => {
                            const parts = value.trim().split(/\s+/)
                            return parts[parts.length - 1]
                        }}
                    />
                    <YAxis
                        type="number"
                        tickLine={false}
                        axisLine={false}
                        width={isMobile ? 50 : 80}
                        tickFormatter={(value: number) => {return isMobile ? formatCompactCurrency(value) : `$${value.toLocaleString()}`}}
                        tick={{ fontSize: isMobile ? 10 : 12 }}
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
                    {!isMobile && (
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent

                                formatter={(value, name, item) => {
                                    if (item.payload.baseSal == 0 && item.payload.guarComp == 0) return null
                                    const base = item?.payload?.baseSal ?? 0

                                    if (name === "guarComp"){
                                        return `Guaranteed Compensation: $${(base + value).toLocaleString()}`
                                    }
                                    return `Base Salary: $${value!.toLocaleString()}`
                                }}
                            />
                            }
                        />
                    )}
                    <ChartLegend content={<ChartLegendContent payload={[]}/>}/>
                </BarChart>
            </ChartContainer>
            {isMobile && (
                <p className="mt-2 text-xs text-foreground">Tap a player on the chart to see their numbers.</p>
            )}
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
