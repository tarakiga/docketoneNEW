"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"
import { useMemo, useState } from "react"

type Lifestyle = "frugal" | "world" | "europe" | "namerica"

/**
 * Real per-capita primary energy, not a vague multiplier.
 *
 * This was Eco / Average / High at 0.7x / 1.0x / 1.5x of the world average,
 * a span of 56 to 120 GJ. Actual per-capita energy runs from about 10 GJ in
 * low-income countries to about 290 GJ in North America, so "High" understated
 * a US resident roughly threefold and the three options barely differed.
 * Naming real places and showing the figure makes the choice answerable and
 * the spread honest.
 */
const LIFESTYLES: { key: Lifestyle; emoji: string; label: string; gj: number; hint: string }[] = [
    { key: "frugal", emoji: "🌱", label: "Frugal", gj: 25, hint: "Low-income countries" },
    { key: "world", emoji: "🌍", label: "World avg", gj: 80, hint: "Everyone, averaged" },
    { key: "europe", emoji: "🏠", label: "W. Europe", gj: 150, hint: "Typical UK / EU" },
    { key: "namerica", emoji: "🚗", label: "N. America", gj: 290, hint: "US / Canada" },
]

export function LightningLifeCalculator() {
    const [age, setAge] = useState(25)
    const [lifestyle, setLifestyle] = useState<Lifestyle>("world")

    const results = useMemo(() => {
        const profile = LIFESTYLES.find(l => l.key === lifestyle) ?? LIFESTYLES[1]

        // Total per-capita primary energy: electricity, transport, heating, and
        // the industry behind everything bought. Not just the household meter.
        const lightningBoltEnergy = 1_000_000_000 // ~1 GJ per bolt

        const energyPerYear = profile.gj * 1_000_000_000
        const totalEnergy = energyPerYear * age
        const lightningStrikes = totalEnergy / lightningBoltEnergy

        return {
            lightningStrikes,
            totalEnergy,
            energyPerYear,
            homesForYear: Math.round(totalEnergy / 38_000_000_000),   // ~38 GJ ≈ a home's yearly electricity (~10,500 kWh)
            iPhoneBatteries: Math.round(totalEnergy / 46_800).toLocaleString(), // iPhone battery ~46.8 kJ
            tntEquivalent: Math.round(totalEnergy / 4_184_000).toLocaleString(), // TNT 4.184 MJ/kg
            carMiles: Math.round(totalEnergy / 3_600_000).toLocaleString(),      // car ~3.6 MJ/mile
        }
    }, [age, lifestyle])

    const formatEnergy = (joules: number) => {
        if (joules >= 1e12) return (joules / 1e12).toFixed(1) + "T joules"
        if (joules >= 1e9) return (joules / 1e9).toFixed(1) + "B joules"
        if (joules >= 1e6) return (joules / 1e6).toFixed(1) + "M joules"
        return joules.toLocaleString() + " joules"
    }

    const equivalents = [
        { ic: "🏠", nm: "Homes powered for one year", v: results.homesForYear.toLocaleString() },
        { ic: "📱", nm: "iPhone charges", v: results.iPhoneBatteries },
        { ic: "🚗", nm: "Miles driven by car", v: results.carMiles },
        { ic: "💣", nm: "Equivalent TNT", v: results.tntEquivalent, unit: "kg" },
    ]

    return (
        <motion.div
            className="w-full rounded-3xl p-5 md:p-8 border shadow-2xl relative overflow-hidden"
            style={{ background: "var(--dk-surface)", borderColor: "var(--dk-line)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
        >
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
                    <h2 className="text-2xl font-extrabold flex items-center gap-3" style={{ color: "var(--dk-ink)" }}><span className="text-3xl">⚡</span> Lightning-Powered Life</h2>
                    <span className="font-mono text-[11px] tracking-[0.14em] uppercase flex items-center gap-2" style={{ color: "var(--dk-tea-ink)" }}><span className="h-2 w-2 rounded-full animate-pulse" style={{ background: "var(--dk-tea)" }} /> Energy model</span>
                </div>

                {/* Inputs bar */}
                <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1.7fr] gap-5 p-5 border rounded-2xl mb-5" style={{ background: "var(--dk-sunk)", borderColor: "var(--dk-line)" }}>
                    <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] mb-1" style={{ color: "var(--dk-ink-soft)" }}>Your age</div>
                        <div className="font-mono font-bold text-sm mb-2" style={{ color: "var(--dk-tea-ink)" }}>{age} years</div>
                        <Slider value={[age]} onValueChange={(v) => setAge(v[0])} min={1} max={100} step={1} className="py-2" />
                    </div>
                    <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] mb-2" style={{ color: "var(--dk-ink-soft)" }}>Where you live</div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {LIFESTYLES.map((l) => {
                                const on = lifestyle === l.key
                                return (
                                    <button key={l.key} onClick={() => setLifestyle(l.key)}
                                        title={l.hint}
                                        className="min-w-0 rounded-xl border py-2.5 px-1 flex flex-col items-center gap-0.5 transition-colors"
                                        /* selected and unselected shared a background before, so the
                                           only cue was a border colour */
                                        style={on
                                            ? { background: "var(--dk-tea)", borderColor: "var(--dk-line)" }
                                            : { background: "var(--dk-raised)", borderColor: "var(--dk-line)" }}>
                                        <span className="text-xl leading-none">{l.emoji}</span>
                                        <span className="text-[11px] font-semibold leading-tight text-center break-words" style={{ color: on ? "var(--dk-on-tea)" : "var(--dk-ink-soft)" }}>{l.label}</span>
                                        <span className="font-mono text-[10px]" style={{ color: on ? "var(--dk-on-tea)" : "var(--dk-tea-ink)" }}>{l.gj} GJ</span>
                                    </button>
                                )
                            })}
                        </div>
                        <p className="text-[11px] leading-snug mt-2" style={{ color: "var(--dk-ink-soft)" }}>
                            Per person per year, counting transport, heating and the industry behind everything you buy. A lightning bolt is taken as 1 GJ, which is the middle of a wide range.
                        </p>
                    </div>
                </div>

                {/* Readout: figure + ticker list */}
                <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-5">
                    {/* Figure */}
                    <div className="rounded-2xl border p-7 flex flex-col justify-center"
                        style={{ background: "var(--dk-sunk)", borderColor: "var(--dk-line)" }}>
                        <div className="text-5xl">⚡</div>
                        <div className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none mt-2 break-words max-w-full" style={{ fontFamily: "var(--font-fredoka), cursive", color: "var(--dk-tea-ink)" }}>
                            {results.lightningStrikes.toLocaleString(undefined, { maximumFractionDigits: 0 })}<span className="text-2xl font-bold" style={{ color: "var(--dk-tea-ink)" }}> strikes</span>
                        </div>
                        <div className="text-sm mt-2" style={{ color: "var(--dk-ink-soft)" }}>of lightning to power your life so far</div>
                        <div className="grid grid-cols-2 gap-3 mt-5">
                            <div className="border rounded-xl p-3" style={{ background: "var(--dk-raised)", borderColor: "var(--dk-line)" }}>
                                <div className="font-mono text-[9px] uppercase tracking-[0.1em]" style={{ color: "var(--dk-ink-soft)" }}>Total energy</div>
                                <div className="font-mono font-bold text-[15px] mt-0.5" style={{ color: "var(--dk-ink)" }}>{formatEnergy(results.totalEnergy)}</div>
                            </div>
                            <div className="border rounded-xl p-3" style={{ background: "var(--dk-raised)", borderColor: "var(--dk-line)" }}>
                                <div className="font-mono text-[9px] uppercase tracking-[0.1em]" style={{ color: "var(--dk-ink-soft)" }}>Per year</div>
                                <div className="font-mono font-bold text-[15px] mt-0.5" style={{ color: "var(--dk-ink)" }}>{formatEnergy(results.energyPerYear)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Ticker list */}
                    <div className="border rounded-2xl px-6" style={{ background: "var(--dk-sunk)", borderColor: "var(--dk-line)" }}>
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] pt-5 pb-1" style={{ color: "var(--dk-ink-soft)" }}>That energy is equivalent to…</div>
                        {equivalents.map((e, i) => (
                            <div key={i} className="grid grid-cols-[44px_1fr_auto] items-center gap-2 sm:gap-4 py-4" style={i < equivalents.length - 1 ? { borderBottom: "1px solid var(--dk-line)" } : undefined}>
                                <span className="w-11 h-11 rounded-xl grid place-items-center text-[22px]" style={{ background: "var(--dk-raised)" }}>{e.ic}</span>
                                <span className="min-w-0 text-sm break-words" style={{ color: "var(--dk-ink-soft)" }}>{e.nm}</span>
                                <span className="min-w-0 font-mono font-bold text-lg sm:text-xl text-right leading-tight break-words" style={{ color: "var(--dk-ink)" }}>
                                    {e.v}{e.unit && <span className="block text-xs font-normal" style={{ color: "var(--dk-ink-soft)" }}>{e.unit}</span>}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end mt-5">
                    <ShareResult
                        title="My Lightning Power ⚡"
                        text={`My life has consumed ${results.lightningStrikes.toLocaleString(undefined, { maximumFractionDigits: 0 })} lightning strikes worth of energy - enough to power ${results.homesForYear.toLocaleString()} homes for a year! Calculate yours at Docket One.`}
                        className="border-none !bg-[var(--dk-tea)] hover:!bg-[var(--dk-tea)]/90 !text-[var(--dk-on-fill)]"
                    />
                </div>
            </div>
        </motion.div>
    )
}
