"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"
import { useMemo, useState } from "react"

type Lifestyle = "low" | "average" | "high"

const LIFESTYLES: { key: Lifestyle; emoji: string; label: string }[] = [
    { key: "low", emoji: "🌱", label: "Eco" },
    { key: "average", emoji: "🏠", label: "Average" },
    { key: "high", emoji: "🚗", label: "High" },
]

export function LightningLifeCalculator() {
    const [age, setAge] = useState(25)
    const [lifestyle, setLifestyle] = useState<Lifestyle>("average")

    const results = useMemo(() => {
        const lifestyleMultipliers = { low: 0.7, average: 1.0, high: 1.5 }

        // Average total per-capita energy footprint (electricity + transport + heating + everything).
        // World per-capita primary energy is ~80 GJ/year. (Previously this was 80 MJ — 1000x too low.)
        const baseEnergyPerYear = 80_000_000_000 // 80 GJ
        const lightningBoltEnergy = 1_000_000_000 // ~1 GJ per bolt

        const energyPerYear = baseEnergyPerYear * lifestyleMultipliers[lifestyle]
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
            style={{ background: "#1d1442", borderColor: "#4a3f7a" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
        >
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
                    <h2 className="text-2xl font-extrabold flex items-center gap-3" style={{ color: "#ECEAE3" }}><span className="text-3xl">⚡</span> Lightning-Powered Life</h2>
                    <span className="font-mono text-[11px] tracking-[0.14em] uppercase flex items-center gap-2" style={{ color: "#29e0ff" }}><span className="h-2 w-2 rounded-full animate-pulse" style={{ background: "#29e0ff" }} /> Energy model</span>
                </div>

                {/* Inputs bar */}
                <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1.7fr] gap-5 p-5 border rounded-2xl mb-5" style={{ background: "#0c0824", borderColor: "#4a3f7a" }}>
                    <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] mb-1" style={{ color: "#b3aae0" }}>Your age</div>
                        <div className="font-mono font-bold text-sm mb-2" style={{ color: "#29e0ff" }}>{age} years</div>
                        <Slider value={[age]} onValueChange={(v) => setAge(v[0])} min={1} max={100} step={1} className="py-2" />
                    </div>
                    <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] mb-2" style={{ color: "#b3aae0" }}>Lifestyle energy usage</div>
                        <div className="grid grid-cols-3 gap-2.5">
                            {LIFESTYLES.map((l) => {
                                const on = lifestyle === l.key
                                return (
                                    <button key={l.key} onClick={() => setLifestyle(l.key)}
                                        className="rounded-xl border py-3 flex flex-col items-center gap-1 transition-colors"
                                        style={on ? { background: "#241a52", borderColor: "#29e0ff" } : { background: "#241a52", borderColor: "#4a3f7a" }}>
                                        <span className="text-2xl">{l.emoji}</span>
                                        <span className="text-xs font-semibold" style={{ color: on ? "#29e0ff" : "#b3aae0" }}>{l.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Readout: figure + ticker list */}
                <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-5">
                    {/* Figure */}
                    <div className="rounded-2xl border p-7 flex flex-col justify-center"
                        style={{ background: "#0c0824", borderColor: "#4a3f7a" }}>
                        <div className="text-5xl">⚡</div>
                        <div className="text-6xl font-black tracking-tight leading-none mt-2" style={{ fontFamily: "var(--font-bungee), cursive", color: "#29e0ff" }}>
                            {results.lightningStrikes.toLocaleString(undefined, { maximumFractionDigits: 0 })}<span className="text-2xl font-bold" style={{ color: "#29e0ff" }}> strikes</span>
                        </div>
                        <div className="text-sm mt-2" style={{ color: "#b3aae0" }}>of lightning to power your life so far</div>
                        <div className="grid grid-cols-2 gap-3 mt-5">
                            <div className="border rounded-xl p-3" style={{ background: "#241a52", borderColor: "#4a3f7a" }}>
                                <div className="font-mono text-[9px] uppercase tracking-[0.1em]" style={{ color: "#b3aae0" }}>Total energy</div>
                                <div className="font-mono font-bold text-[15px] mt-0.5" style={{ color: "#ECEAE3" }}>{formatEnergy(results.totalEnergy)}</div>
                            </div>
                            <div className="border rounded-xl p-3" style={{ background: "#241a52", borderColor: "#4a3f7a" }}>
                                <div className="font-mono text-[9px] uppercase tracking-[0.1em]" style={{ color: "#b3aae0" }}>Per year</div>
                                <div className="font-mono font-bold text-[15px] mt-0.5" style={{ color: "#ECEAE3" }}>{formatEnergy(results.energyPerYear)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Ticker list */}
                    <div className="border rounded-2xl px-6" style={{ background: "#0c0824", borderColor: "#4a3f7a" }}>
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] pt-5 pb-1" style={{ color: "#b3aae0" }}>That energy is equivalent to…</div>
                        {equivalents.map((e, i) => (
                            <div key={i} className="grid grid-cols-[44px_1fr_auto] items-center gap-4 py-4" style={i < equivalents.length - 1 ? { borderBottom: "1px solid #4a3f7a" } : undefined}>
                                <span className="w-11 h-11 rounded-xl grid place-items-center text-[22px]" style={{ background: "#241a52" }}>{e.ic}</span>
                                <span className="text-sm" style={{ color: "#b3aae0" }}>{e.nm}</span>
                                <span className="font-mono font-bold text-xl text-right leading-tight" style={{ color: "#ECEAE3" }}>
                                    {e.v}{e.unit && <span className="block text-xs font-normal" style={{ color: "#b3aae0" }}>{e.unit}</span>}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end mt-5">
                    <ShareResult
                        title="My Lightning Power ⚡"
                        text={`My life has consumed ${results.lightningStrikes.toLocaleString(undefined, { maximumFractionDigits: 0 })} lightning strikes worth of energy — enough to power ${results.homesForYear.toLocaleString()} homes for a year! Calculate yours at Docket One.`}
                        className="border-none !bg-[#29e0ff] hover:!bg-[#29e0ff]/90 !text-[#160e33]"
                    />
                </div>
            </div>
        </motion.div>
    )
}
