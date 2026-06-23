"use client"

import { motion } from "framer-motion"

export interface CaffeineStatusCardProps {
    currentLevel: number
    isSleepImpacted: boolean
    bedtimeLevel: number
    bedtimeLabel: string
    safeLabel: string
    safeIsPast: boolean
    threshold: number
}

const K = "text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 font-mono mb-2"
const TILE = "bg-black/35 border border-white/10 rounded-2xl p-5 flex flex-col justify-between"

export function CaffeineStatusCard({
    currentLevel, isSleepImpacted, bedtimeLevel, bedtimeLabel, safeLabel, safeIsPast, threshold,
}: CaffeineStatusCardProps) {
    const status = currentLevel > threshold ? "active" : currentLevel > 20 ? "moderate" : "clear"
    const loadColor = status === "active" ? "text-red-400" : status === "moderate" ? "text-orange-400" : "text-emerald-400"
    const loadDot = status === "active" ? "bg-red-500 animate-pulse" : status === "moderate" ? "bg-orange-400" : "bg-emerald-400"
    const loadText = status === "active" ? "System Active" : status === "moderate" ? "Winding Down" : "Ready for Sleep"

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div className={TILE} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className={K}>Current load</div>
                <div className={`text-5xl font-black tracking-tighter ${loadColor} flex items-baseline gap-1`}>
                    {currentLevel.toFixed(0)}<span className="text-lg text-slate-500 font-medium">mg</span>
                </div>
                <div className="flex items-center gap-2 mt-3 text-sm font-semibold text-slate-300">
                    <span className={`h-2.5 w-2.5 rounded-full ${loadDot}`} /> {loadText}
                </div>
            </motion.div>

            <motion.div className={TILE} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}>
                <div className={K}>At {bedtimeLabel} (bedtime)</div>
                <div className={`text-5xl font-black tracking-tighter flex items-baseline gap-1 ${isSleepImpacted ? "text-amber-400" : "text-emerald-400"}`}>
                    {bedtimeLevel.toFixed(0)}<span className="text-lg text-slate-500 font-medium">mg</span>
                </div>
                <div className="text-xs text-slate-400 mt-3">
                    {isSleepImpacted ? `above the ${threshold} mg sleep line` : `under the ${threshold} mg sleep line`}
                </div>
            </motion.div>

            <motion.div className={TILE} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.16 }}>
                <div className={K}>{safeIsPast ? "Cleared the sleep line" : "Safe to sleep"}</div>
                <div className="text-4xl font-bold font-mono tracking-tight text-cyan-300">{safeLabel}</div>
                <div className="text-xs text-slate-400 mt-3">when you drop under {threshold} mg</div>
            </motion.div>
        </div>
    )
}
