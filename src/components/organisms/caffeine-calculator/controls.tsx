"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { Minus, Plus, X } from "lucide-react"

export type Dose = {
    id: string
    name: string
    icon: string
    mg: number
    qty: number
    /** clock time, "HH:mm", always today (see resolveTime in index.tsx) */
    time: string
}

export interface CaffeineControlsProps {
    doses: Dose[]
    addDose: (name: string, icon: string, mg: number) => void
    setQty: (id: string, qty: number) => void
    setDoseTime: (id: string, time: string) => void
    removeDose: (id: string) => void
    halfLife: number
    setHalfLife: (v: number) => void
    sleepGoal: string
    setSleepGoal: (v: string) => void
}

const DRINK_PRESETS = [
    { name: "Coffee", mg: 95, icon: "☕" },
    { name: "Espresso", mg: 150, icon: "🍵" },
    { name: "Energy", mg: 200, icon: "🥤" },
    { name: "Tea", mg: 50, icon: "🫖" },
    { name: "Cola", mg: 35, icon: "🥫" },
    { name: "Dark choc", mg: 30, icon: "🍫" },
]

const SEC = "text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--dk-ink-soft)] font-mono"
const FIELD =
    "w-full min-w-0 bg-[var(--dk-surface)] border border-[var(--dk-line)] rounded-xl px-3 py-2.5 text-[var(--dk-ink)] text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dk-tea-ink)]"

/** "14:30" -> "2:30 PM" in the reader's locale */
const clockOf = (hhmm: string) => {
    const [h, m] = (hhmm || "").split(":").map(Number)
    if (!Number.isFinite(h) || !Number.isFinite(m)) return ""
    const d = new Date()
    d.setHours(h, m, 0, 0)
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export function CaffeineControls({
    doses, addDose, setQty, setDoseTime, removeDose,
    halfLife, setHalfLife, sleepGoal, setSleepGoal,
}: CaffeineControlsProps) {
    const total = doses.reduce((s, d) => s + d.mg * d.qty, 0)

    return (
        <div className="space-y-6 min-w-0">
            {/* Add a drink. Tapping adds a dose rather than replacing the amount,
                so "three coffees today" is expressible, which was the whole
                point of the rebuild. */}
            <div className="min-w-0">
                <div className={`${SEC} mb-3`}>Tap what you drank</div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 min-w-0">
                    {DRINK_PRESETS.map(p => (
                        <motion.button
                            key={p.name}
                            whileTap={{ scale: 0.94 }}
                            onClick={() => addDose(p.name, p.icon, p.mg)}
                            aria-label={`Add ${p.name}, ${p.mg} milligrams`}
                            className="min-w-0 rounded-2xl border border-[var(--dk-line)] bg-[var(--dk-sunk)] p-2.5 sm:p-3 flex flex-col items-center gap-1 text-center transition-colors hover:border-[var(--dk-tea-ink)] hover:bg-[var(--dk-raised)]"
                        >
                            <span className="text-2xl sm:text-3xl leading-none">{p.icon}</span>
                            <span className="text-[12px] font-semibold text-[var(--dk-ink)] leading-tight break-words">{p.name}</span>
                            <span className="font-mono text-[10px] text-[var(--dk-tea-ink)]">{p.mg} mg</span>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Today's doses */}
            <div className="min-w-0">
                <div className="flex items-baseline justify-between gap-3 mb-2 flex-wrap">
                    <div className={SEC}>Today&apos;s intake</div>
                    <div className="font-mono text-[12px] text-[var(--dk-ink-soft)]">
                        {doses.length} {doses.length === 1 ? "drink" : "drinks"} ·{" "}
                        <span className="text-[var(--dk-tea-ink)] font-bold">{total} mg</span>
                    </div>
                </div>

                {doses.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-[var(--dk-line)] bg-[var(--dk-sunk)] px-4 py-6 text-center text-sm text-[var(--dk-ink-soft)]">
                        Nothing yet. Tap a drink above to start.
                    </p>
                ) : (
                    <div className="space-y-2 min-w-0">
                        <AnimatePresence initial={false}>
                            {doses.map(d => (
                                <motion.div
                                    key={d.id}
                                    layout
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="min-w-0 rounded-2xl border border-[var(--dk-line)] bg-[var(--dk-sunk)] p-3"
                                >
                                    {/* wraps on narrow screens instead of clipping */}
                                    <div className="flex items-center gap-3 flex-wrap min-w-0">
                                        <span className="text-2xl leading-none shrink-0">{d.icon}</span>

                                        <div className="min-w-0 flex-1 basis-24">
                                            <div className="text-sm font-bold text-[var(--dk-ink)] leading-tight break-words">{d.name}</div>
                                            <div className="font-mono text-[11px] text-[var(--dk-ink-soft)]">
                                                {d.mg * d.qty} mg · {clockOf(d.time)}
                                            </div>
                                        </div>

                                        {/* quantity, 44px targets so it is usable on a phone */}
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                onClick={() => setQty(d.id, d.qty - 1)}
                                                aria-label={`One fewer ${d.name}`}
                                                className="h-11 w-11 grid place-items-center rounded-xl border border-[var(--dk-line)] bg-[var(--dk-surface)] text-[var(--dk-ink)] hover:bg-[var(--dk-raised)]"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="w-8 text-center font-mono text-lg font-bold text-[var(--dk-tea-ink)] tabular-nums">
                                                {d.qty}
                                            </span>
                                            <button
                                                onClick={() => setQty(d.id, d.qty + 1)}
                                                aria-label={`One more ${d.name}`}
                                                className="h-11 w-11 grid place-items-center rounded-xl border border-[var(--dk-line)] bg-[var(--dk-surface)] text-[var(--dk-ink)] hover:bg-[var(--dk-raised)]"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeDose(d.id)}
                                            aria-label={`Remove ${d.name}`}
                                            className="h-11 w-11 shrink-0 grid place-items-center rounded-xl border border-[var(--dk-line)] bg-[var(--dk-surface)] text-[var(--dk-ink-soft)] hover:text-[var(--dk-neg-ink)] hover:border-[var(--dk-neg-ink)]"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {/* time only, the date is always today, so a
                                        datetime picker just added a field to skip past */}
                                    <label className="mt-2 flex items-center gap-2 min-w-0">
                                        <span className={`${SEC} shrink-0`}>At</span>
                                        <input
                                            type="time"
                                            value={d.time}
                                            onChange={e => setDoseTime(d.id, e.target.value)}
                                            aria-label={`Time you had the ${d.name}`}
                                            className={`${FIELD} py-1.5 text-[13px]`}
                                        />
                                    </label>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[var(--dk-sunk)] rounded-2xl border border-[var(--dk-line)] min-w-0">
                <div className="space-y-2 min-w-0">
                    <label className={SEC} htmlFor="metabolism">How fast do you clear it?</label>
                    <Select value={halfLife.toString()} onValueChange={v => setHalfLife(Number(v))}>
                        <SelectTrigger id="metabolism" className="min-w-0 bg-[var(--dk-surface)] border-[var(--dk-line)] text-[var(--dk-ink)] h-11">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--dk-sunk)] border-[var(--dk-line)] text-[var(--dk-ink)]">
                            <SelectItem value="3">Fast (3 hrs)</SelectItem>
                            <SelectItem value="5">Average (5 hrs)</SelectItem>
                            <SelectItem value="7">Slow (7 hrs)</SelectItem>
                            <SelectItem value="9">Very slow (9 hrs)</SelectItem>
                        </SelectContent>
                    </Select>
                    {/* the old version gave no way to answer this, so most people
                        left it on Average and the control earned nothing */}
                    <p className="text-[11px] leading-snug text-[var(--dk-ink-soft)]">
                        Smoking speeds it up. Pregnancy and the combined pill slow it a lot, often past 9 hrs.
                        Otherwise it is mostly genetics; Average is the safe guess.
                    </p>
                </div>

                <div className="space-y-2 min-w-0">
                    <label className={SEC} htmlFor="bedtime">Bedtime tonight</label>
                    <input
                        id="bedtime"
                        type="time"
                        value={sleepGoal}
                        onChange={e => setSleepGoal(e.target.value)}
                        className={`${FIELD} h-11`}
                    />
                </div>
            </div>
        </div>
    )
}
