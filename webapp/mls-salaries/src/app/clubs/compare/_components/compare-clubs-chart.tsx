import { PlayerRecord } from "@/lib/data/types"
import { ClubList } from "../page"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

type CompareClubsChartProps = {
    clubList: ClubList
}

type CompareClubsChartData = {
    name_a: string | null,
    baseSal_a: number | null,
    guarComp_a: number | null,
    name_b: string | null,
    baseSal_b: number | null,
    guarComp_b: number | null,
    name_c: string | null,
    baseSal_c: number | null,
    guarComp_c: number | null,
    name_d: string | null,
    baseSal_d: number | null,
    guarComp_d: number | null
}

const emptyRow: CompareClubsChartData = {
    name_a: null,
    baseSal_a: null,
    guarComp_a: null,
    name_b: null,
    baseSal_b: null,
    guarComp_b: null,
    name_c: null,
    baseSal_c: null,
    guarComp_c: null,
    name_d: null,
    baseSal_d: null,
    guarComp_d: null
}

export default function CompareClubsChart({clubList}: CompareClubsChartProps){
    const chartConfig: ChartConfig = {
        baseSal_a: { label: "Base Salary" }, guarComp_a: { label: "Guaranteed Compensation" },
        baseSal_b: { label: "Base Salary" }, guarComp_b: { label: "Guaranteed Compensation" },
        baseSal_c: { label: "Base Salary" }, guarComp_c: { label: "Guaranteed Compensation" },
        baseSal_d: { label: "Base Salary" }, guarComp_d: { label: "Guaranteed Compensation" },
    } 

    const data = formatChartData(clubList)

    return (
        <ChartContainer config={chartConfig} className="px-4">
            <BarChart data={data} barGap={0} barCategoryGap={0}>
                <XAxis
                    tick={false}
                />
                <YAxis 
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    width={80}
                    tickFormatter={(value: number) => {return `$${value.toLocaleString()}`}}
                />
                {clubList.data.map((club) => (
                    club.club && 
                        <>
                            <Bar
                                dataKey={`baseSal_${club.stackID}`}
                                stackId={club.stackID}
                                fill={club.club.club.colorprimary}
                            />
                            <Bar
                                dataKey={`guarComp_${club.stackID}`}
                                stackId={club.stackID}
                                fill={club.club.club.colorprimary}
                                fillOpacity={0.7}
                            />
                        </>
                ))}
                <ChartTooltip cursor={false} content={<ChartTooltipContent/>}/>
            </BarChart>
        </ChartContainer>
    )
}

function getMaxPlayers(clubList: ClubList){
    let max = 0

    for (const club of clubList.data){
        if (club.club && club.club.players.length > max){
            max = club.club.players.length
        }
    }

    return max
}

function formatChartData(clubList: ClubList){
    const maxPlayers = getMaxPlayers(clubList)
    const chartData: CompareClubsChartData[] = []

    for (let i = 0; i < maxPlayers; i++){
        let row: CompareClubsChartData = structuredClone(emptyRow)
        for (const club of clubList.data){
            if (club.club && club.club.players[i]){
                row[`name_${club.stackID}`] = club.club.players[i].firstname + " " + club.club.players[i].lastname

                let bS = 0
                let gC = 0

                if (!club.club.players[i].basesalary){
                bS = club.club.players[i].guaranteedcomp ?? 0
                } else {
                bS = club.club.players[i].basesalary
                gC = club.club.players[i].guaranteedcomp - club.club.players[i].basesalary
                }

                row[`baseSal_${club.stackID}`] = bS
                row[`guarComp_${club.stackID}`] = gC
            }
        }
        chartData.push(row)
    }

    return chartData.toReversed()
}
