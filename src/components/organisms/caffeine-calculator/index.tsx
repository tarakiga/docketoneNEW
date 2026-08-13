"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { motion } from "framer-motion"
import { AlertTriangle, Moon } from "lucide-react"
import { useMemo, useState } from "react"
import { CaffeineControls, type Dose } from "./controls"
import { CaffeineDecayChart } from "./decay-chart"
import { CaffeineStatusCard } from "./status-card"

// Caffeine level (mg) at/above which sleep onset is commonly disrupted.
const SLEEP_THRESHOLD = 50
const HOUR = 3_600_000

const fmtClock = (ms: number) =>
    new Date(ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

/** Date -> "HH:mm" for a time input. */
const localTime = (d: Date) =>
    `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`

/**
 * A clock time is always today, nobody logs yesterday's coffee, so the date
 * picker was dead weight. The one case that needs care is after midnight: at
 * 00:30, a drink logged at 23:00 means last night, not 22.5 hours from now.
 * A time in the future is therefore read as yesterday.
 */
const resolveTime = (hhmm: string, now = new Date()) => {
    const [h, m] = hhmm.split(":").map(Number)
    if (!Number.isFinite(h) || !Number.isFinite(m)) return NaN
    const d = new Date(now)
    d.setHours(h, m, 0, 0)
    if (d.getTime() > now.getTime() + 60_000) d.setDate(d.getDate() - 1)
    return d.getTime()
}

let seq = 0
const nextId = () => `dose-${++seq}`

export function CaffeineCalculatorPremium() {
    const [doses, setDoses] = useState<Dose[]>(() => [
        { id: nextId(), name: "Coffee", icon: "☕", mg: 95, qty: 1, time: localTime(new Date()) },
    ])
    const [halfLife, setHalfLife] = useState<number>(5)
    const [sleepGoal, setSleepGoal] = useState<string>("22:00")

    const addDose = (name: string, icon: string, mg: number) =>
        setDoses(prev => [...prev, { id: nextId(), name, icon, mg, qty: 1, time: localTime(new Date()) }])

    const setQty = (id: string, qty: number) =>
        setDoses(prev =>
            // dropping to zero removes the row rather than leaving a 0 mg entry
            qty <= 0 ? prev.filter(d => d.id !== id)
                : prev.map(d => (d.id === id ? { ...d, qty: Math.min(20, qty) } : d)),
        )

    const setDoseTime = (id: string, time: string) =>
        setDoses(prev => prev.map(d => (d.id === id ? { ...d, time } : d)))

    const removeDose = (id: string) => setDoses(prev => prev.filter(d => d.id !== id))

    const result = useMemo(() => {
        const parsed = doses
            .map(d => ({ ms: resolveTime(d.time), mg: d.mg * d.qty }))
            .filter(d => Number.isFinite(d.ms) && d.mg > 0)
        if (!parsed.length) return null

        /**
         * Each dose decays independently from the moment it was taken; the level
         * at any instant is their sum. A dose contributes nothing before it is
         * drunk, which is what makes the curve step up rather than just fall.
         */
        const levelAt = (ms: number) =>
            parsed.reduce(
                (sum, d) => (ms < d.ms ? sum : sum + d.mg * Math.pow(0.5, (ms - d.ms) / HOUR / halfLife)),
                0,
            )

        const firstMs = Math.min(...parsed.map(d => d.ms))
        const lastMs = Math.max(...parsed.map(d => d.ms))
        const now = Date.now()
        const totalMg = parsed.reduce((s, d) => s + d.mg, 0)

        // Bedtime is the next occurrence of the chosen clock time after the last drink.
        const [sh, sm] = sleepGoal.split(":").map(Number)
        const sleepDate = new Date(lastMs)
        sleepDate.setHours(sh || 0, sm || 0, 0, 0)
        if (sleepDate.getTime() < lastMs) sleepDate.setDate(sleepDate.getDate() + 1)
        const bedtimeMs = sleepDate.getTime()

        const bedtimeLevel = levelAt(bedtimeMs)
        const isSleepImpacted = bedtimeLevel > SLEEP_THRESHOLD

        /**
         * With one dose this inverts to a log. With several overlapping curves
         * there is no closed form, so step forward until the sum crosses the
         * threshold, 5-minute resolution over 48h, which is finer than the
         * answer is meaningful to anyway.
         */
        const scanFrom = Math.max(now, lastMs)
        let safeMs = scanFrom
        if (levelAt(scanFrom) > SLEEP_THRESHOLD) {
            const STEP = 5 * 60_000
            const LIMIT = scanFrom + 48 * HOUR
            let t = scanFrom
            while (t < LIMIT && levelAt(t) > SLEEP_THRESHOLD) t += STEP
            safeMs = t
        }
        const safeIsPast = safeMs <= now

        // 24h window from the first drink, so the whole day is visible.
        const data: { hour: number; caffeine: number }[] = []
        for (let i = 0; i <= 24; i++) {
            data.push({ hour: i, caffeine: +levelAt(firstMs + i * HOUR).toFixed(1) })
        }

        const asHours = (ms: number) => (ms - firstMs) / HOUR
        const inRange = (h: number) => h >= 0 && h <= 24
        const hoursNow = asHours(now)
        const hoursBed = asHours(bedtimeMs)

        return {
            data,
            baseTime: firstMs,
            markers: {
                now: inRange(hoursNow) ? +hoursNow.toFixed(2) : null,
                bedtime: inRange(hoursBed) ? +hoursBed.toFixed(2) : null,
            },
            currentLevel: Math.max(0, levelAt(now)),
            bedtimeLevel: Math.max(0, bedtimeLevel),
            bedtimeLabel: fmtClock(bedtimeMs),
            isSleepImpacted,
            safeLabel: fmtClock(safeMs),
            safeIsPast,
            threshold: SLEEP_THRESHOLD,
            totalMg,
            drinkCount: doses.length,
        }
    }, [doses, halfLife, sleepGoal])

    const recommendation = !result
        ? ""
        : result.isSleepImpacted
            ? `You'll still be above the ~${result.threshold} mg sleep-disruption mark at bedtime (≈${result.bedtimeLevel.toFixed(0)} mg). Consider a later bedtime, or cut caffeine off earlier next time.`
            : `You should be under ~${result.threshold} mg by bedtime. Caffeine is unlikely to keep you up.`

    return (
        <motion.div
            /* On a phone this card sat inside .almanac-screen, which is already a
               bordered, padded card, three nested boxes cost 102px of a 375px
               screen before anything was drawn, squeezing the chart to 196px.
               The duplicate chrome is dropped below sm and restored above it. */
            className="w-full min-w-0 relative overflow-hidden p-0 sm:p-6 md:p-8 rounded-none sm:rounded-3xl border-0 sm:border sm:border-[var(--dk-line)] bg-transparent sm:bg-[var(--dk-sunk)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className="relative z-10 space-y-6 min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-[var(--dk-ink)] flex items-center gap-3 min-w-0">
                        <span className="text-2xl sm:text-3xl shrink-0">☕</span>
                        <span className="break-words">Caffeine Half-Life</span>
                    </h2>
                    <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--dk-tea-ink)] flex items-center gap-2 shrink-0">
                        <span className="h-2 w-2 rounded-full bg-[var(--dk-tea)] animate-pulse" /> Live model
                    </span>
                </div>

                <CaffeineControls
                    doses={doses}
                    addDose={addDose}
                    setQty={setQty}
                    setDoseTime={setDoseTime}
                    removeDose={removeDose}
                    halfLife={halfLife}
                    setHalfLife={setHalfLife}
                    sleepGoal={sleepGoal}
                    setSleepGoal={setSleepGoal}
                />

                {result ? (
                    <>
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

                        <div className={`rounded-2xl px-4 sm:px-5 py-4 border-l-4 min-w-0 ${result.isSleepImpacted
                            ? "bg-[var(--dk-neg)]/10 border-l-[var(--dk-neg-ink)]"
                            : "bg-[var(--dk-pos)]/10 border-l-[var(--dk-pos-ink)]"}`}>
                            <div className="font-bold text-[var(--dk-ink)] mb-1 flex items-center gap-2">
                                {result.isSleepImpacted
                                    ? <AlertTriangle className="w-5 h-5 shrink-0 text-[var(--dk-neg-ink)]" />
                                    : <Moon className="w-5 h-5 shrink-0 text-[var(--dk-pos-ink)]" />}
                                {result.isSleepImpacted ? "Sleep Warning" : "Sleep Safe"}
                            </div>
                            <p className="text-sm text-[var(--dk-ink)] leading-relaxed break-words">{recommendation}</p>
                        </div>

                        <div className="flex justify-end min-w-0">
                            <ShareResult
                                title="Caffeine Status"
                                text={`${result.drinkCount} ${result.drinkCount === 1 ? "drink" : "drinks"} and ${result.totalMg}mg later, I'm running on ${result.currentLevel.toFixed(0)}mg of caffeine. At bedtime I'll still have ~${result.bedtimeLevel.toFixed(0)}mg, sleep forecast: ${result.isSleepImpacted ? "Risky" : "Safe"}. Calculated via Docket One.`}
                            />
                        </div>
                    </>
                ) : (
                    <p className="rounded-2xl border border-dashed border-[var(--dk-line)] px-4 py-8 text-center text-sm text-[var(--dk-ink-soft)]">
                        Add a drink above and the forecast appears here.
                    </p>
                )}
            </div>
        </motion.div>
    )
}
