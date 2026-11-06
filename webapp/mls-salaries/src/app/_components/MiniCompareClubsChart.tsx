"use client"

import { Bar, BarChart, ResponsiveContainer } from "recharts"

interface Props {
    data: Record<string, number | string>[]
    series: { key: string, color: string }[]
}

export default function MiniCompareClubsChart({ data, series }: Props){
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }} barGap={2}>
                {series.map((s) => (
                    <Bar key={s.key} dataKey={s.key} fill={s.color} radius={[2, 2, 0, 0]} isAnimationActive={false}/>
                ))}
            </BarChart>
        </ResponsiveContainer>
    )
}
