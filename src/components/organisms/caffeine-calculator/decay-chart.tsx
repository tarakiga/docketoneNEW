"use client"

import { motion } from "framer-motion"
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type ChartPoint = { hour: number; caffeine: number }

export interface CaffeineChartProps {
    data: ChartPoint[]
    baseTime: number
    markers: { now: number | null; bedtime: number | null }
    threshold: number
}

const fmtClock = (ms: number) =>
    new Date(ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

export function CaffeineDecayChart({ data, baseTime, markers, threshold }: CaffeineChartProps) {
    if (!data.length) return null

    const tickFmt = (h: number) => fmtClock(baseTime + h * 3_600_000)

    return (
        <motion.div
            className="bg-black/40 backdrop-blur-xl p-6 h-[400px] w-full rounded-2xl border border-white/10 shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className="mb-6 flex justify-between items-center flex-wrap gap-2">
                <h3 className="text-slate-400 uppercase tracking-widest text-xs font-bold">Decay Projection (24h)</h3>
                <div className="flex items-center gap-3 text-xs font-medium text-slate-400 flex-wrap">
                    <div className="flex items-center gap-1"><span className="w-3 h-0.5 rounded bg-cyan-400"></span> Caffeine</div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_currentColor]"></span> Now</div>
                    <div className="flex items-center gap-1"><span className="w-3 border-t border-dashed border-white/60"></span> Bedtime</div>
                    <div className="flex items-center gap-1"><span className="w-3 border-t border-dashed border-red-400"></span> Sleep line</div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="100%" maxHeight={320}>
                <AreaChart data={data} margin={{ top: 10, right: 14, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorCaffeineNeon" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff12" />
                    <XAxis
                        dataKey="hour"
                        type="number"
                        domain={[0, 24]}
                        ticks={[0, 4, 8, 12, 16, 20, 24]}
                        tickFormatter={tickFmt}
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(5, 5, 10, 0.9)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 4px 30px rgba(0,0,0,0.8)'
                        }}
                        itemStyle={{ color: '#e2e8f0' }}
                        labelStyle={{ color: '#22d3ee', fontWeight: 'bold', marginBottom: '8px' }}
                        labelFormatter={(h) => tickFmt(Number(h))}
                        formatter={(v) => [`${v} mg`, 'Caffeine']}
                    />

                    {/* Sleep-disruption threshold (horizontal) */}
                    <ReferenceLine
                        y={threshold}
                        stroke="#f87171"
                        strokeDasharray="4 4"
                        strokeOpacity={0.7}
                        label={{ value: `${threshold}mg`, fill: "#f87171", fontSize: 10, position: "insideTopLeft" }}
                    />

                    {/* Bedtime (vertical) */}
                    {markers.bedtime !== null && (
                        <ReferenceLine
                            x={markers.bedtime}
                            stroke="#ffffff66"
                            strokeDasharray="3 3"
                            label={{ value: "Bedtime", fill: "#ffffff99", fontSize: 10, position: "insideTopRight" }}
                        />
                    )}

                    {/* Now (vertical) */}
                    {markers.now !== null && (
                        <ReferenceLine
                            x={markers.now}
                            stroke="#22d3ee"
                            strokeWidth={2}
                            label={{ value: "Now", fill: "#22d3ee", fontSize: 10, position: "insideBottomLeft" }}
                        />
                    )}

                    <Area
                        type="monotone"
                        dataKey="caffeine"
                        stroke="#22d3ee"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorCaffeineNeon)"
                        animationDuration={1500}
                        animationEasing="ease-out"
                        filter="drop-shadow(0 0 6px rgba(34,211,238,0.3))"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    )
}
