import { ClubData, ClubList } from "../page"
import { ChartConfig, ChartContainer, ChartLegend, ChartTooltip, } from "@/components/ui/chart"
import { Bar, BarChart, TooltipProps, XAxis, YAxis } from "recharts"

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
            <BarChart data={data} barGap={0}>
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
                <ChartTooltip cursor={false} content={<CustomTooltip/>}/>
                <ChartLegend content={<CustomLegend clubs={clubList.data}/>}/>
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
        const row: CompareClubsChartData = structuredClone(emptyRow)
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

type CustomTooltipEntry = {
  dataKey?: string
  color?: string
  payload?: CompareClubsChartData
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

        const name = row[`name_${suffix}` as keyof CompareClubsChartData] as string | null
        const base = row[`baseSal_${suffix}` as keyof CompareClubsChartData] as number | null
        const guar = row[`guarComp_${suffix}` as keyof CompareClubsChartData] as number | null

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

type ClubEntry = {
  stackID: string
  club: ClubData | null
}

type CustomLegendProps = {
  clubs: ClubEntry[]
}

const CustomLegend = ({ clubs }: CustomLegendProps) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {clubs.map((club: { stackID: string, club: ClubData | null}) =>
        club.club ? (
          <div
            key={club.stackID}
            className="flex items-center gap-2"
          >
            {/* color box */}
            <div
              className="w-3 h-3 rounded-xs"
              style={{ backgroundColor: club.club.club.colorprimary }}
            />

            {/* club name */}
            <span>{club.club.club.clubname}</span>
          </div>
        ) : null
      )}
    </div>
  )
}