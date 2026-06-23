"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { motion } from "framer-motion"
import { useMemo, useState } from "react"

const NOISE_SOURCES = [
    { id: "breathing", label: "Person Breathing Nearby", db: 10, icon: "😤" },
    { id: "clock", label: "Ticking Clock", db: 20, icon: "⏰" },
    { id: "fridge", label: "Fridge Humming", db: 40, icon: "🧊" },
    { id: "lights", label: "Fluorescent Buzz", db: 35, icon: "💡" },
    { id: "ac", label: "Air Conditioner", db: 60, icon: "💨" },
    { id: "conversation", label: "Background Conversation", db: 60, icon: "🗣️" },
    { id: "tv", label: "TV / YouTube (Normal)", db: 70, icon: "📺" },
    { id: "traffic", label: "Traffic Outside", db: 80, icon: "🚗" },
]

const SEG_COLORS = ["#86efac", "#86efac", "#86efac", "#ffd23c", "#ffd23c", "#ffd23c", "#ff8a8a", "#ff8a8a"]

export function DecibelDetective() {
    const [activeSources, setActiveSources] = useState<string[]>([])
    const [sensitivity, setSensitivity] = useState(5)

    const { totalDB, perceivedLoad, timeLimit } = useMemo(() => {
        if (activeSources.length === 0) {
            return { totalDB: 0, perceivedLoad: 0, timeLimit: "Unlimited" }
        }
        // Logarithmic addition of sound levels: 10·log10( Σ 10^(L/10) )
        const sumPower = activeSources.reduce((acc, id) => {
            const s = NOISE_SOURCES.find(n => n.id === id)
            return acc + (s ? Math.pow(10, s.db / 10) : 0)
        }, 0)
        const realDB = 10 * Math.log10(sumPower)

        // Subjective sensory-load multiplier (heuristic, not a physical unit).
        let irritationFactor = 1 + (sensitivity - 5) * 0.15
        if (activeSources.includes("clock")) irritationFactor += 0.1
        if (activeSources.includes("lights")) irritationFactor += 0.2
        const perceived = realDB * irritationFactor

        const timeLimit =
            perceived < 50 ? "Unlimited"
                : perceived < 70 ? "4–6 hours"
                    : perceived < 90 ? "45–90 min"
                        : "< 15 min (overload risk)"

        return { totalDB: realDB, perceivedLoad: perceived, timeLimit }
    }, [activeSources, sensitivity])

    const toggleSource = (id: string) =>
        setActiveSources(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

    const zone = perceivedLoad <= 0 ? "idle" : perceivedLoad < 50 ? "safe" : perceivedLoad < 70 ? "mod" : perceivedLoad < 90 ? "high" : "extreme"
    const bigColor = zone === "extreme" ? "#ff8a8a" : zone === "high" ? "#ffd23c" : zone === "mod" ? "#ffd23c" : zone === "safe" ? "#86efac" : "#5bf0c0"
    const litCount = perceivedLoad <= 0 ? 0 : Math.min(8, Math.ceil((perceivedLoad / 120) * 8))

    return (
        <motion.div
            className="w-full rounded-3xl p-5 md:p-8 border shadow-2xl relative overflow-hidden"
            style={{ background: "#1d1442", borderColor: "#4a3f7a" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
        >
            <div className="relative z-10">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
                    <h2 className="text-2xl font-extrabold flex items-center gap-3" style={{ color: "#ECEAE3" }}><span className="text-3xl">🔊</span> Decibel Detective</h2>
                    <span className="font-mono text-[11px] tracking-[0.14em] uppercase flex items-center gap-2" style={{ color: "#5bf0c0" }}><span className="h-2 w-2 rounded-full animate-pulse" style={{ background: "#5bf0c0" }} /> Sensory load model</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-5">
                    {/* Left: source toggles + sensitivity */}
                    <div className="border rounded-2xl p-4" style={{ background: "#0c0824", borderColor: "#4a3f7a" }}>
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] mb-1 px-1" style={{ color: "#b3aae0" }}>Sounds in your space</div>
                        {NOISE_SOURCES.map(s => (
                            <label key={s.id} htmlFor={s.id} className="flex items-center gap-3 py-2.5 px-1 border-b last:border-0 cursor-pointer" style={{ borderColor: "#4a3f7a" }}>
                                <span className="w-9 h-9 rounded-[10px] grid place-items-center text-[17px] shrink-0" style={{ background: "#241a52" }}>{s.icon}</span>
                                <span className="flex-1 min-w-0">
                                    <span className="block text-[13px] font-semibold" style={{ color: "#ECEAE3" }}>{s.label}</span>
                                    <span className="block font-mono text-[10px]" style={{ color: "#b3aae0" }}>{s.db} dB</span>
                                </span>
                                <Switch id={s.id} checked={activeSources.includes(s.id)} onCheckedChange={() => toggleSource(s.id)} className="data-[state=checked]:bg-[#5bf0c0]" />
                            </label>
                        ))}
                        <div className="mt-3 pt-3 border-t border-dashed" style={{ borderColor: "#4a3f7a" }}>
                            <div className="font-mono text-[10px] uppercase tracking-[0.12em] mb-3" style={{ color: "#b3aae0" }}>Sensory sensitivity (hyperacusis)</div>
                            <Slider value={[sensitivity]} onValueChange={(v) => setSensitivity(v[0])} min={1} max={10} step={1} className="py-1" />
                            <div className="flex justify-between font-mono text-[9px] uppercase mt-2" style={{ color: "#b3aae0" }}>
                                <span>Resilient</span><span>Normal</span><span>Hypersensitive</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: readout */}
                    <div className="flex flex-col gap-4">
                        <div className="border rounded-2xl p-6 text-center" style={{ background: "#0c0824", borderColor: "#4a3f7a" }}>
                            <div className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "#b3aae0" }}>Perceived acoustic load</div>
                            <div className="text-6xl font-black tracking-tight leading-none mt-1.5 mb-4" style={{ color: bigColor, fontFamily: "var(--font-bungee), cursive" }}>
                                {perceivedLoad.toFixed(1)} <span className="text-xl font-semibold" style={{ color: "#b3aae0" }}>dB(P)</span>
                            </div>
                            <div className="flex gap-1 h-6 mb-2">
                                {SEG_COLORS.map((c, i) => (
                                    <div key={i} className="flex-1 rounded-[3px]" style={{ background: i < litCount ? c : "#241a52" }} />
                                ))}
                            </div>
                            <div className="flex justify-between font-mono text-[10px] uppercase" style={{ color: "#b3aae0" }}>
                                <span>Quiet</span><span>Busy</span><span>Painful</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="border rounded-2xl p-4" style={{ background: "#0c0824", borderColor: "#4a3f7a" }}>
                                <div className="font-mono text-[9px] uppercase tracking-[0.12em]" style={{ color: "#b3aae0" }}>🧠 Actual SPL</div>
                                <div className="font-mono font-bold text-2xl mt-1" style={{ color: "#ECEAE3" }}>{totalDB.toFixed(1)} <span className="text-sm" style={{ color: "#b3aae0" }}>dB</span></div>
                                <div className="text-[10px] mt-1" style={{ color: "#b3aae0" }}>physical sound pressure</div>
                            </div>
                            <div className="border rounded-2xl p-4" style={{ background: "#0c0824", borderColor: "#4a3f7a" }}>
                                <div className="font-mono text-[9px] uppercase tracking-[0.12em]" style={{ color: "#b3aae0" }}>🔋 Safe duration</div>
                                <div className="font-bold text-lg mt-1" style={{ color: "#ffd23c" }}>{timeLimit}</div>
                                <div className="text-[10px] mt-1" style={{ color: "#b3aae0" }}>before sensory fatigue</div>
                            </div>
                        </div>

                        {activeSources.length > 2 && (
                            <div className="border-l-[3px] rounded-[10px] px-4 py-3.5 flex gap-3" style={{ background: "#241a52", borderColor: "#ffd23c" }}>
                                <span className="text-lg">⚠️</span>
                                <div>
                                    <div className="font-bold text-sm mb-0.5" style={{ color: "#ffd23c" }}>Layering effect</div>
                                    <p className="text-[12.5px] leading-relaxed" style={{ color: "#ECEAE3" }}>Multiple low-level sounds keep the brain filtering instead of resting, burning glucose fast.</p>
                                </div>
                            </div>
                        )}

                        <p className="text-[11px] leading-relaxed" style={{ color: "#b3aae0" }}>An estimate of subjective sensory load (dB(P) is not a standard acoustic unit) — not a clinical or hearing-safety measure.</p>

                        <ShareResult
                            title="Sensory Load"
                            text={`My environment measures ${totalDB.toFixed(0)}dB, but with my sensitivity it feels like ${perceivedLoad.toFixed(0)}dB(P). Comfortable for: ${timeLimit}. #DecibelDetective #Neurodivergent`}
                            className="border-none text-[#160e33] bg-[#5bf0c0] hover:bg-[#5bf0c0]"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
