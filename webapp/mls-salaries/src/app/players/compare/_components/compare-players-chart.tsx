import { ChartConfig, ChartContainer, ChartLegend, ChartTooltip } from "@/components/ui/chart"
import { PlayerData, PlayerList } from "../page"
import { Bar, BarChart, TooltipProps, XAxis, YAxis } from "recharts"
import { reports } from "@/lib/globals"

type ComparePlayersChartProps = {
    playerList: PlayerList
}

const colors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)"
]

type ComparePlayersChartData = {
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
    report: string
}

const emptyRow: ComparePlayersChartData = {
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
    guarComp_d: null,
    report: ""
}

export default function ComparePlayersChart({playerList}: ComparePlayersChartProps){
    const chartConfig: ChartConfig = {
        baseSal_a: { label: "Base Salary" }, guarComp_a: { label: "Guaranteed Compensation" },
        baseSal_b: { label: "Base Salary" }, guarComp_b: { label: "Guaranteed Compensation" },
        baseSal_c: { label: "Base Salary" }, guarComp_c: { label: "Guaranteed Compensation" },
        baseSal_d: { label: "Base Salary" }, guarComp_d: { label: "Guaranteed Compensation" },
    } 

    const data = formatChartData(playerList)

    return (
    <ChartContainer config={chartConfig} className="px-4">
        <BarChart data={data}>
            <XAxis 
                dataKey="report"
                tickLine={false}
                axisLine={false}
                interval={0} // ensures all ticks show
                tickFormatter={(key) => {{return (reports[key].year + " " + reports[key].season)}}}
                tick={{ fontSize: 10 }}
            />
            <YAxis 
                type="number"
                tickLine={false}
                axisLine={false}
                width={80}
                tickFormatter={(value: number) => {return `$${value.toLocaleString()}`}}
            />
            {playerList.data.map((player, index) => (
                player.player && 
                    <>
                        <Bar
                            dataKey={`baseSal_${player.stackID}`}
                            stackId={player.stackID}
                            fill={colors[index]}
                        />
                        <Bar
                            dataKey={`guarComp_${player.stackID}`}
                            stackId={player.stackID}
                            fill={colors[index]}
                            fillOpacity={0.7}
                        />
                    </>
            ))}
            <ChartTooltip cursor={false} content={<CustomTooltip/>}/>
            <ChartLegend content={<CustomLegend players={playerList.data}/>}/>
        </BarChart>
    </ChartContainer>
    )
}

function formatChartData(playerList: PlayerList){
    const chartData: ComparePlayersChartData[] = []

    const reportsList = []
    for (const key in reports){
        if (Number(key) >= Number(playerList.min) && Number(key) <= Number(playerList.max)){
            reportsList.push(key)
        }
    }
    reportsList.sort((a, b) => Number(b) - Number(a))

    for (const key of reportsList){
        if (Number(key) >= Number(playerList.min) && Number(key) <= Number(playerList.max)){
            const row: ComparePlayersChartData = structuredClone(emptyRow)
            row.report = key

            for (const player of playerList.data){
                if (player.player) {
                    const report = reports[key]
                    const match = player.player.records.find((record) => record.recordyear === report.year && record.recordseason === report.season)

                    if (match){
                        row[`name_${player.stackID}`] = player.player.player.lastname + " " + player.player.player.firstname

                        let bS = 0
                        let gC = 0

                        if (!match.basesalary){
                            bS = match.guaranteedcomp ?? 0
                        } else {
                            bS = match.basesalary
                            gC = match.guaranteedcomp - match.basesalary
                        }

                        row[`baseSal_${player.stackID}`] = bS
                        row[`guarComp_${player.stackID}`] = gC

                    }
                }
                    
            }
            chartData.push(row)
        }
    }
    return chartData.toReversed()
}

type CustomTooltipEntry = {
  dataKey?: string
  color?: string
  payload?: ComparePlayersChartData
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-background border rounded-md p-2 shadow">
      {payload.map((entry, index) => {
        const e = entry as CustomTooltipEntry

        const dataKey = e.dataKey
        if (!dataKey) return null

        // extract suffix (a, b, c, d)
        const suffix = dataKey.split("_")[1]

        const row = e.payload
        if (!row) return null

        const name = row[`name_${suffix}` as keyof ComparePlayersChartData] as string | null
        const base = row[`baseSal_${suffix}` as keyof ComparePlayersChartData] as number | null
        const guar = row[`guarComp_${suffix}` as keyof ComparePlayersChartData] as number | null

        const total = (base ?? 0) + (guar ?? 0) 

        // Only show once per player (avoid duplicate base/guar entries)
        if (!dataKey.startsWith("guarComp")) return null

        return (
          <div key={index} className="flex items-center gap-2">
            {/* color box */}
            <div
              className="w-3 h-3 rounded-xs"
              style={{ backgroundColor: entry.color }}
            />

            <div className="flex flex-row w-full justify-between">
              <p>{name}:&nbsp;</p> <p> ${total.toLocaleString()}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

type PlayerEntry = {
  stackID: string
  player: PlayerData | null
}

type CustomLegendProps = {
  players: PlayerEntry[]
}

const CustomLegend = ({ players }: CustomLegendProps) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {players.map((player: { stackID: string, player: PlayerData | null}, index) =>
        player.player ? (
          <div
            key={player.stackID}
            className="flex items-center gap-2"
          >
            {/* color box */}
            <div
              className="w-3 h-3 rounded-xs"
              style={{ backgroundColor: colors[index] }}
            />

            {/* club name */}
            <span>{player.player.player.lastname} {player.player.player.firstname}</span>
          </div>
        ) : null
      )}
    </div>
  )
}