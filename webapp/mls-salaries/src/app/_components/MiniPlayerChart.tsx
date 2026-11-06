"use client"

import { Area, AreaChart, ResponsiveContainer } from "recharts"

type Datum = { report: string, guaranteedComp: number }

interface Props {
    data: Datum[]
    color: string
}

export default function MiniPlayerChart({ data, color }: Props){
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                <defs>
                    <linearGradient id="mini-player-chart-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.5}/>
                        <stop offset="95%" stopColor={color} stopOpacity={0.05}/>
                    </linearGradient>
                </defs>
                <Area
                    dataKey="guaranteedComp"
                    type="monotone"
                    stroke={color}
                    strokeWidth={2}
                    fill="url(#mini-player-chart-gradient)"
                    dot={false}
                    isAnimationActive={false}
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}
