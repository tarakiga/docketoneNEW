"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"
import { useMemo, useState } from "react"

export function PowerFootprintCalculator() {
    const [population, setPopulation] = useState(1_000_000)
    const [kwhPerCapita, setKwhPerCapita] = useState(12000)

    const r = useMemo(() => {
        // Power density (W/m²) — standard land-use figures incl. spacing.
        const densitySolar = 10
        const densityWind = 3
        const densityNuclear = 800

        const totalKwhYear = population * kwhPerCapita
        const avgPowerWatts = (totalKwhYear * 1000) / (365 * 24) // average watts

        const km2 = (density: number) => (avgPowerWatts / density) / 1e6
        const landSolar = km2(densitySolar)
        const landWind = km2(densityWind)
        const landNuclear = km2(densityNuclear)

        return { avgPowerWatts, landSolar, landWind, landNuclear }
    }, [population, kwhPerCapita])

    const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 1 })
    const gw = (r.avgPowerWatts / 1e9).toLocaleString(undefined, { maximumFractionDigits: 2 })
    const efficiency = Math.round(r.landWind / r.landNuclear)
    const cityLabel = population > 8_000_000 ? "New York City" : population > 3_000_000 ? "Los Angeles" : population > 1_000_000 ? "Dallas" : "a small town"

    // Square ratios are constant (areas ∝ 1/density), so sizes are fixed; only the km² labels change.
    const SQ = { wind: 248, solar: 136, nuclear: 15 }

    const SLIDER_LBL = "font-mono text-[10px] uppercase tracking-[0.1em] text-[#b3aae0]"
    const SLIDER_VAL = "font-mono text-[13px] text-[#ECEAE3] font-bold"

    return (
        <motion.div
            className="w-full rounded-3xl p-5 md:p-8 border shadow-2xl relative overflow-hidden"
            style={{ background: "#1d1442", borderColor: "#4a3f7a" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
        >
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
                    <h2 className="text-2xl font-extrabold text-[#ECEAE3] flex items-center gap-3"><span className="text-3xl">🔌</span> Energy Land Footprint</h2>
                    <span className="font-mono text-[11px] tracking-[0.14em] uppercase flex items-center gap-2" style={{ color: "#29e0ff" }}><span className="h-2 w-2 rounded-full animate-pulse" style={{ background: "#29e0ff" }} /> Power-density model</span>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-5 md:gap-6 p-5 border rounded-2xl mb-6 items-center" style={{ background: "#0c0824", borderColor: "#4a3f7a" }}>
                    <div>
                        <div className="flex justify-between items-baseline"><span className={SLIDER_LBL}>Population</span><span className={SLIDER_VAL}>{population.toLocaleString()}</span></div>
                        <Slider value={[population]} onValueChange={(v) => setPopulation(v[0])} min={10000} max={10000000} step={10000} className="py-3" />
                        <div className="text-[11px] text-[#b3aae0]">Like {cityLabel}</div>
                    </div>
                    <div>
                        <div className="flex justify-between items-baseline"><span className={SLIDER_LBL}>kWh / person / yr</span><span className={SLIDER_VAL}>{kwhPerCapita.toLocaleString()}</span></div>
                        <Slider value={[kwhPerCapita]} onValueChange={(v) => setKwhPerCapita(v[0])} min={3000} max={20000} step={500} className="py-3" />
                        <div className="text-[11px] text-[#b3aae0]">Global avg ~3.5k · US avg ~12k</div>
                    </div>
                    <div className="md:pl-6 md:border-l text-center" style={{ borderColor: "#4a3f7a" }}>
                        <div className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#b3aae0]">Avg demand</div>
                        <div className="font-mono font-bold text-2xl mt-1" style={{ fontFamily: "var(--font-bungee), cursive", color: "#29e0ff" }}>{gw} GW</div>
                    </div>
                </div>

                {/* Stats + map */}
                <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-5">
                    {/* Left: stats + insight */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3.5 rounded-2xl p-4 border" style={{ background: "#241a52", borderColor: "#4a3f7a" }}>
                            <span className="text-2xl">☀️</span>
                            <div><div className="text-[13px] font-semibold text-[#ECEAE3]">Solar PV</div><div className="font-mono text-[10px] text-[#b3aae0]">10 W/m²</div></div>
                            <span className="ml-auto text-2xl font-extrabold" style={{ color: "#ffd23c" }}>{fmt(r.landSolar)} <span className="text-sm">km²</span></span>
                        </div>
                        <div className="flex items-center gap-3.5 rounded-2xl p-4 border" style={{ background: "#241a52", borderColor: "#4a3f7a" }}>
                            <span className="text-2xl">💨</span>
                            <div><div className="text-[13px] font-semibold text-[#ECEAE3]">Wind</div><div className="font-mono text-[10px] text-[#b3aae0]">3 W/m²</div></div>
                            <span className="ml-auto text-2xl font-extrabold" style={{ color: "#29e0ff" }}>{fmt(r.landWind)} <span className="text-sm">km²</span></span>
                        </div>
                        <div className="flex items-center gap-3.5 rounded-2xl p-4 border" style={{ background: "#241a52", borderColor: "#4a3f7a" }}>
                            <span className="text-2xl">⚛️</span>
                            <div><div className="text-[13px] font-semibold text-[#ECEAE3]">Nuclear</div><div className="font-mono text-[10px] text-[#b3aae0]">800 W/m²</div></div>
                            <span className="ml-auto text-2xl font-extrabold" style={{ color: "#86efac" }}>{fmt(r.landNuclear)} <span className="text-sm">km²</span></span>
                        </div>
                        <div className="rounded-2xl p-4 border text-[12.5px] leading-relaxed text-[#b3aae0]" style={{ background: "#241a52", borderColor: "#4a3f7a" }}>
                            Squares are sized by <b className="text-[#ECEAE3]">actual land area</b>. Nuclear&apos;s plot is the tiny green dot — about <b className="text-[#ECEAE3]">{efficiency.toLocaleString()}× less land</b> than wind.
                        </div>
                    </div>

                    {/* Right: footprint map */}
                    <div className="border rounded-2xl p-5" style={{ background: "#0c0824", borderColor: "#4a3f7a" }}>
                        <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#b3aae0]">Footprint to scale</h3>
                        <p className="text-[11px] text-[#b3aae0] mb-3.5">Each square&apos;s area is proportional to the km² needed.</p>
                        <div
                            className="relative h-[300px] rounded-xl border"
                            style={{ borderColor: "#4a3f7a", backgroundImage: "linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)", backgroundSize: "24px 24px" }}
                        >
                            <div className="absolute rounded-md" style={{ left: 18, bottom: 18, width: SQ.wind, height: SQ.wind, background: "rgba(41,224,255,.18)", border: "2px solid #29e0ff" }} />
                            <div className="absolute rounded-md" style={{ left: 18, bottom: 18, width: SQ.solar, height: SQ.solar, background: "rgba(255,210,60,.28)", border: "2px solid #ffd23c" }} />
                            <div className="absolute rounded-md" style={{ left: 18, bottom: 18, width: SQ.nuclear, height: SQ.nuclear, background: "#86efac", border: "2px solid #86efac" }} />
                            <span className="absolute font-mono text-[11px] font-bold" style={{ color: "#29e0ff", right: 14, top: 14 }}>Wind {fmt(r.landWind)}<span className="block text-[9px] text-[#b3aae0] font-normal">km²</span></span>
                            <span className="absolute font-mono text-[11px] font-bold" style={{ color: "#ffd23c", left: 18 + SQ.solar + 10, bottom: 18 + SQ.solar - 24 }}>Solar {fmt(r.landSolar)}<span className="block text-[9px] text-[#b3aae0] font-normal">km²</span></span>
                            <span className="absolute font-mono text-[11px] font-bold" style={{ color: "#86efac", left: 18 + SQ.nuclear + 10, bottom: 14 }}>⚛ {fmt(r.landNuclear)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-5">
                    <ShareResult
                        title="Energy Land Footprint 🦶"
                        text={`To power ${population.toLocaleString()} people you'd need ${fmt(r.landWind)} km² of wind — but only ${fmt(r.landNuclear)} km² of nuclear (~${efficiency}× less land). Calculated at Docket One.`}
                        className="border-none text-[#160e33] bg-[#29e0ff] hover:bg-[#29e0ff]"
                    />
                </div>
            </div>
        </motion.div>
    )
}
