"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"

export interface CaffeineControlsProps {
    amount: number
    setAmount: (v: number) => void
    time: string
    setTime: (v: string) => void
    halfLife: number
    setHalfLife: (v: number) => void
    sleepGoal: string
    setSleepGoal: (v: string) => void
}

const DRINK_PRESETS = [
    { name: "Coffee", caffeine: 95, icon: "☕" },
    { name: "Espresso", caffeine: 150, icon: "🍵" },
    { name: "Energy", caffeine: 200, icon: "🥤" },
    { name: "Tea", caffeine: 50, icon: "🫖" },
    { name: "Cola", caffeine: 35, icon: "🥫" },
    { name: "Dark choc", caffeine: 30, icon: "🍫" },
]

const SEC = "text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 font-mono"
const FIELD = "w-full bg-black/35 border border-white/10 rounded-xl px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 focus-visible:border-cyan-500/60"

export function CaffeineControls({
    amount, setAmount, time, setTime, halfLife, setHalfLife, sleepGoal, setSleepGoal,
}: CaffeineControlsProps) {
    return (
        <div className="space-y-7">
            {/* Drink selection — full-width row */}
            <div>
                <div className={`${SEC} mb-3`}>Select your drink</div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {DRINK_PRESETS.map((preset) => {
                        const on = amount === preset.caffeine
                        return (
                            <motion.button
                                key={preset.name}
                                whileHover={{ y: -3 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setAmount(preset.caffeine)}
                                className={`rounded-2xl border p-4 flex flex-col items-center gap-1.5 text-center transition-colors duration-300 ${on
                                    ? "bg-cyan-400/10 border-cyan-400 shadow-[0_0_22px_-6px_rgba(34,211,238,0.5)]"
                                    : "bg-white/[0.04] border-white/10 hover:border-cyan-400/40"}`}
                            >
                                <span className="text-3xl drop-shadow-lg">{preset.icon}</span>
                                <span className={`text-[13px] font-semibold ${on ? "text-cyan-100" : "text-slate-200"}`}>{preset.name}</span>
                                <span className="font-mono text-[11px] text-cyan-400">{preset.caffeine} mg</span>
                            </motion.button>
                        )
                    })}
                </div>
            </div>

            {/* Control bar */}
            <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-5 p-5 bg-black/25 rounded-2xl border border-white/5">
                <div className="space-y-2">
                    <label className={SEC}>Caffeine amount</label>
                    <div className="flex items-center gap-3">
                        <Slider
                            value={[amount]}
                            onValueChange={(v) => setAmount(v[0])}
                            max={600}
                            step={5}
                            className="flex-1 cursor-pointer"
                        />
                        <input
                            type="number"
                            min={0}
                            max={600}
                            value={amount}
                            onChange={(e) => setAmount(Math.max(0, Math.min(600, Number(e.target.value) || 0)))}
                            aria-label="Caffeine amount in milligrams"
                            className="w-16 bg-black/35 border border-cyan-500/30 rounded-lg px-1 py-1.5 text-center font-mono text-lg font-bold text-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className={SEC}>Consumed at</label>
                    <input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} className={FIELD} />
                </div>

                <div className="space-y-2">
                    <label className={SEC}>Metabolism</label>
                    <Select value={halfLife.toString()} onValueChange={(v) => setHalfLife(Number(v))}>
                        <SelectTrigger className="bg-black/35 border-white/10 text-slate-200 h-[42px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10 text-slate-200">
                            <SelectItem value="3">Fast (3 hrs)</SelectItem>
                            <SelectItem value="5">Average (5 hrs)</SelectItem>
                            <SelectItem value="7">Slow (7 hrs)</SelectItem>
                            <SelectItem value="9">Very Slow (9 hrs)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className={SEC}>Bedtime goal</label>
                    <input type="time" value={sleepGoal} onChange={(e) => setSleepGoal(e.target.value)} className={FIELD} />
                </div>
            </div>
        </div>
    )
}
