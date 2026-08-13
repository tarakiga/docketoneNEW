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
        /* A column layout, not a fixed block with a fixed-height chart inside:
           the legend wrapped to two rows at 375px and ate the plot, because the
           card height was fixed and the chart was told to fill 100% of it.
           Header shrinks, plot takes what is left. */
        <motion.div
            className="min-w-0 w-full flex flex-col bg-[var(--dk-surface)] p-3 sm:p-5 h-[360px] sm:h-[420px] rounded-2xl border border-[var(--dk-line)]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className="shrink-0 mb-2 sm:mb-4 min-w-0">
                <h3 className="text-[var(--dk-ink-soft)] uppercase tracking-widest text-[11px] sm:text-xs font-bold">Decay Projection (24h)</h3>
                {/* scrolls sideways on a narrow screen instead of wrapping and
                    stealing a second row from the plot */}
                <div className="mt-1.5 flex items-center gap-3 text-[11px] font-medium text-[var(--dk-ink-soft)] overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]{display:none}">
                    <span className="flex items-center gap-1 shrink-0"><span className="w-3 h-0.5 rounded bg-[var(--dk-tea)]"></span> Caffeine</span>
                    <span className="flex items-center gap-1 shrink-0"><span className="w-2 h-2 rounded-full bg-[var(--dk-tea)]"></span> Now</span>
                    <span className="flex items-center gap-1 shrink-0"><span className="w-3 border-t border-dashed border-[var(--dk-line-soft)]"></span> Bedtime</span>
                    <span className="flex items-center gap-1 shrink-0"><span className="w-3 border-t border-dashed border-[var(--dk-neg-ink)]"></span> Sleep line</span>
                </div>
            </div>

            <div className="flex-1 min-h-0 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 8, right: 8, left: -26, bottom: 0 }}>
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
                        /* 7 clock labels collided at 375px; 5 fit */
                        ticks={[0, 6, 12, 18, 24]}
                        tickFormatter={tickFmt}
                        stroke="var(--dk-ink-soft)"
                        fontSize={10}
                        minTickGap={8}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="var(--dk-ink-soft)"
                        fontSize={10}
                        width={34}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--dk-surface)',
                            border: '1px solid var(--dk-line)',
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
            </div>
        </motion.div>
    )
}
