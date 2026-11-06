"use client"

import { Line, LineChart, ResponsiveContainer } from "recharts"

interface Props {
    data: Record<string, number | string>[]
    series: { key: string, color: string }[]
}

export default function MiniComparePlayersChart({ data, series }: Props){
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                {series.map((s) => (
                    <Line
                        key={s.key}
                        dataKey={s.key}
                        type="monotone"
                        stroke={s.color}
                        strokeWidth={2}
                        dot={false}
                        connectNulls
                        isAnimationActive={false}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    )
}
