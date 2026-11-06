"use client"

import { Bar, BarChart, Cell, ResponsiveContainer } from "recharts"

interface Props {
    data: { player: string, value: number }[]
    color: string
}

export default function MiniClubBarChart({ data, color }: Props){
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                <Bar dataKey="value" radius={[2, 2, 0, 0]} isAnimationActive={false}>
                    {data.map((entry, index) => (
                        <Cell key={entry.player} fill={color} fillOpacity={0.25 + (0.75 * index) / Math.max(data.length - 1, 1)}/>
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}
