"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { motion } from "framer-motion"
import { AlertTriangle, Moon } from "lucide-react"
import { useMemo, useState } from "react"
import { CaffeineControls } from "./controls"
import { CaffeineDecayChart } from "./decay-chart"
import { CaffeineStatusCard } from "./status-card"

// Caffeine level (mg) at/above which sleep onset is commonly disrupted.
const SLEEP_THRESHOLD = 50

const fmtClock = (ms: number) =>
    new Date(ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

export function CaffeineCalculatorPremium() {
    const [amount, setAmount] = useState<number>(95)
    const [time, setTime] = useState<string>(() => {
        const now = new Date()
        return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
    })
    const [halfLife, setHalfLife] = useState<number>(5)
    const [sleepGoal, setSleepGoal] = useState<string>("22:00")

    const result = useMemo(() => {
        if (!time) return null

        const consumptionDate = new Date(time)
        const baseTime = consumptionDate.getTime()
        if (Number.isNaN(baseTime)) return null

        const now = new Date()
        const hoursSince = (now.getTime() - baseTime) / 3_600_000
        const levelAt = (h: number) => amount * Math.pow(0.5, h / halfLife)

        const currentLevel = hoursSince > 0 ? levelAt(hoursSince) : amount

        const [sh, sm] = sleepGoal.split(":").map(Number)
        const sleepDate = new Date(consumptionDate)
        sleepDate.setHours(sh, sm, 0, 0)
        if (sleepDate.getTime() < baseTime) sleepDate.setDate(sleepDate.getDate() + 1)
        const hoursUntilBedtime = (sleepDate.getTime() - baseTime) / 3_600_000

        const bedtimeLevel = levelAt(hoursUntilBedtime)
        const isSleepImpacted = bedtimeLevel > SLEEP_THRESHOLD

        const safeMs =
            amount > SLEEP_THRESHOLD
                ? baseTime + halfLife * Math.log2(amount / SLEEP_THRESHOLD) * 3_600_000
                : baseTime
        const safeLabel = fmtClock(safeMs)
        const safeIsPast = safeMs <= now.getTime()

        const data: { hour: number; caffeine: number }[] = []
        for (let i = 0; i <= 24; i++) data.push({ hour: i, caffeine: +levelAt(i).toFixed(1) })

        const inRange = (h: number) => h >= 0 && h <= 24
        const markers = {
            now: inRange(hoursSince) ? +hoursSince.toFixed(2) : null,
            bedtime: inRange(hoursUntilBedtime) ? +hoursUntilBedtime.toFixed(2) : null,
        }

        return {
            data, baseTime, markers,
            currentLevel: Math.max(0, currentLevel),
            bedtimeLevel: Math.max(0, bedtimeLevel),
            bedtimeLabel: fmtClock(sleepDate.getTime()),
            isSleepImpacted, safeLabel, safeIsPast,
            threshold: SLEEP_THRESHOLD,
        }
    }, [amount, halfLife, sleepGoal, time])

    if (!result) return null

    const recommendation = result.isSleepImpacted
        ? `You'll still be above the ~${result.threshold} mg sleep-disruption mark at bedtime (≈${result.bedtimeLevel.toFixed(0)} mg). Consider a later bedtime, or cut caffeine off earlier next time.`
        : `You should be under ~${result.threshold} mg by bedtime - caffeine is unlikely to keep you up.`

    return (
        <motion.div
            className="w-full bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-5 md:p-8 shadow-2xl border border-white/5 overflow-hidden relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Dynamic Background Mesh */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-15%] right-[-8%] w-[45%] h-[55%] bg-cyan-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-15%] left-[-8%] w-[45%] h-[55%] bg-indigo-600/15 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 space-y-7">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="text-3xl">☕</span> Caffeine Half-Life
                    </h2>
                    <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-cyan-400 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" /> Live model
                    </span>
                </div>

                <CaffeineControls
                    amount={amount} setAmount={setAmount}
                    time={time} setTime={setTime}
                    halfLife={halfLife} setHalfLife={setHalfLife}
                    sleepGoal={sleepGoal} setSleepGoal={setSleepGoal}
                />

                <CaffeineStatusCard
                    currentLevel={result.currentLevel}
                    isSleepImpacted={result.isSleepImpacted}
                    bedtimeLevel={result.bedtimeLevel}
                    bedtimeLabel={result.bedtimeLabel}
                    safeLabel={result.safeLabel}
                    safeIsPast={result.safeIsPast}
                    threshold={result.threshold}
                />

                <CaffeineDecayChart
                    data={result.data}
                    baseTime={result.baseTime}
                    markers={result.markers}
                    threshold={result.threshold}
                />

                {/* Recommendation banner */}
                <div className={`rounded-2xl px-5 py-4 border-l-4 ${result.isSleepImpacted
                    ? "bg-red-500/10 border-l-red-500"
                    : "bg-emerald-500/10 border-l-emerald-500"}`}>
                    <div className="font-bold text-white mb-1 flex items-center gap-2">
                        {result.isSleepImpacted ? <AlertTriangle className="w-5 h-5 text-red-400" /> : <Moon className="w-5 h-5 text-emerald-400" />}
                        {result.isSleepImpacted ? "Sleep Warning" : "Sleep Safe"}
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{recommendation}</p>
                </div>

                <div className="flex justify-end">
                    <ShareResult
                        title="Caffeine Status"
                        text={`I'm running on ${result.currentLevel.toFixed(0)}mg of caffeine. At bedtime I'll still have ~${result.bedtimeLevel.toFixed(0)}mg - sleep forecast: ${result.isSleepImpacted ? "Risky" : "Safe"}. Calculated via Docket One.`}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white border-none shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                    />
                </div>
            </div>
        </motion.div>
    )
}
