"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"
import { TrendingDown } from "lucide-react"
import { useMemo, useState } from "react"

type Mode = "car" | "ev" | "uber"

const STYLES: Record<Mode, { label: string; text: string; bar: string; ring: string }> = {
    car: { label: "Gas Car", text: "text-[#29e0ff]", bar: "bg-[#29e0ff]", ring: "ring-[#29e0ff]/60" },
    ev: { label: "Electric", text: "text-[#b3aae0]", bar: "bg-[#b3aae0]", ring: "ring-[#b3aae0]/60" },
    uber: { label: "Rideshare", text: "text-[#86efac]", bar: "bg-[#86efac]", ring: "ring-[#86efac]/60" },
}
const EMOJI: Record<Mode, string> = { car: "⛽", ev: "⚡", uber: "🚕" }
const AVG_RIDE_MILES = 15

const LBL = "block font-mono text-[10px] uppercase tracking-[0.1em] text-[#b3aae0] mb-1.5"
const INP = "w-full bg-[#0c0824] border border-[#4a3f7a] rounded-lg px-2.5 py-2 text-[#ECEAE3] text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#29e0ff]/50"
const clamp = (v: number) => Math.max(0, Number.isFinite(v) ? v : 0)

export function CarVsUberCalculator() {
    // Shared
    const [milesDriven, setMilesDriven] = useState(12000)
    const [loanTerm, setLoanTerm] = useState(5)
    const [interestRate, setInterestRate] = useState(5.5)
    const [insurance, setInsurance] = useState(1500)

    // Gas
    const [carPrice, setCarPrice] = useState(32000)
    const [mpg, setMpg] = useState(25)
    const [fuelCost, setFuelCost] = useState(3.5)
    const [maintenance, setMaintenance] = useState(800)

    // EV
    const [evPrice, setEvPrice] = useState(45000)
    const [evEfficiency, setEvEfficiency] = useState(3.5)
    const [electricityCost, setElectricityCost] = useState(0.14)
    const [chargerInstall, setChargerInstall] = useState(1200)
    const evMaintenance = 400

    // Rideshare
    const [uberCostPerRide, setUberCostPerRide] = useState(22)
    const [ridesPerWeek, setRidesPerWeek] = useState(10)

    const results = useMemo(() => {
        const annualLoan = (price: number) => {
            const r = interestRate / 100 / 12
            const n = loanTerm * 12
            if (price <= 0) return 0
            if (r === 0) return price / loanTerm
            return price * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) * 12
        }

        const totalCar = annualLoan(carPrice) + insurance + maintenance + (milesDriven / (mpg || 1)) * fuelCost
        const totalEv = annualLoan(evPrice + chargerInstall) + insurance * 1.1 + evMaintenance + (milesDriven / (evEfficiency || 1)) * electricityCost
        const totalUber = uberCostPerRide * ridesPerWeek * 52

        const arr: { type: Mode; val: number }[] = [
            { type: "car", val: totalCar },
            { type: "ev", val: totalEv },
            { type: "uber", val: totalUber },
        ]
        const costs = arr.sort((a, b) => a.val - b.val)

        return {
            car: totalCar, ev: totalEv, uber: totalUber,
            ranked: costs,
            winner: costs[0].type,
            savings: costs[1].val - costs[0].val,
            maxVal: costs[2].val,
            impliedMiles: ridesPerWeek * 52 * AVG_RIDE_MILES,
        }
    }, [milesDriven, loanTerm, interestRate, insurance, carPrice, mpg, fuelCost, maintenance, evPrice, evEfficiency, electricityCost, chargerInstall, uberCostPerRide, ridesPerWeek])

    const fmt = (v: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v)
    const win = STYLES[results.winner]
    const winTitle = results.winner === "car" ? "Own a Gas Car" : results.winner === "ev" ? "Go Electric" : "Stick to Rideshare"

    return (
        <motion.div
            className="w-full bg-[#1d1442] rounded-3xl p-5 md:p-8 border border-[#4a3f7a] shadow-2xl relative overflow-hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
        >
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
                    <h2 className="text-2xl font-extrabold text-[#ECEAE3] flex items-center gap-3"><span className="text-3xl">🚗</span> Car vs EV vs Uber</h2>
                    <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#29e0ff] flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#29e0ff] animate-pulse" /> Annual cost model</span>
                </div>

                {/* Inputs zone */}
                <div className="bg-[#0c0824] border border-[#4a3f7a] rounded-2xl p-5 mb-6 space-y-5">
                    {/* Shared assumptions */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-5 border-b border-[#4a3f7a]">
                        <div className="col-span-2 md:col-span-1">
                            <label className={LBL}>Annual mileage</label>
                            <Slider value={[milesDriven]} onValueChange={(v) => setMilesDriven(v[0])} min={1000} max={40000} step={500} className="py-3" />
                            <div className="font-mono text-[12px] text-[#29e0ff]">{milesDriven.toLocaleString()} miles / year</div>
                        </div>
                        <div><label className={LBL}>Loan term (yrs)</label><input type="number" min={1} max={10} value={loanTerm} onChange={(e) => setLoanTerm(clamp(Number(e.target.value)) || 1)} className={INP} /></div>
                        <div><label className={LBL}>Loan APR (%)</label><input type="number" min={0} step={0.1} value={interestRate} onChange={(e) => setInterestRate(clamp(Number(e.target.value)))} className={INP} /></div>
                        <div><label className={LBL}>Insurance / yr ($)</label><input type="number" min={0} value={insurance} onChange={(e) => setInsurance(clamp(Number(e.target.value)))} className={INP} /></div>
                    </div>

                    {/* Per-scenario inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                            <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#29e0ff] mb-2.5">⛽ Gas Car</div>
                            <div className="grid grid-cols-2 gap-2.5">
                                <div className="col-span-2"><label className={LBL}>Purchase price ($)</label><input type="number" min={0} value={carPrice} onChange={(e) => setCarPrice(clamp(Number(e.target.value)))} className={INP} /></div>
                                <div><label className={LBL}>MPG</label><input type="number" min={1} value={mpg} onChange={(e) => setMpg(clamp(Number(e.target.value)) || 1)} className={INP} /></div>
                                <div><label className={LBL}>Gas $/gal</label><input type="number" min={0} step={0.1} value={fuelCost} onChange={(e) => setFuelCost(clamp(Number(e.target.value)))} className={INP} /></div>
                                <div className="col-span-2"><label className={LBL}>Maintenance / yr ($)</label><input type="number" min={0} value={maintenance} onChange={(e) => setMaintenance(clamp(Number(e.target.value)))} className={INP} /></div>
                            </div>
                        </div>
                        <div>
                            <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#b3aae0] mb-2.5">⚡ Electric</div>
                            <div className="grid grid-cols-2 gap-2.5">
                                <div className="col-span-2"><label className={LBL}>EV price ($)</label><input type="number" min={0} value={evPrice} onChange={(e) => setEvPrice(clamp(Number(e.target.value)))} className={INP} /></div>
                                <div><label className={LBL}>mi / kWh</label><input type="number" min={0.1} step={0.1} value={evEfficiency} onChange={(e) => setEvEfficiency(clamp(Number(e.target.value)) || 0.1)} className={INP} /></div>
                                <div><label className={LBL}>Elec $/kWh</label><input type="number" min={0} step={0.01} value={electricityCost} onChange={(e) => setElectricityCost(clamp(Number(e.target.value)))} className={INP} /></div>
                                <div className="col-span-2"><label className={LBL}>Charger install ($)</label><input type="number" min={0} value={chargerInstall} onChange={(e) => setChargerInstall(clamp(Number(e.target.value)))} className={INP} /></div>
                            </div>
                        </div>
                        <div>
                            <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#86efac] mb-2.5">🚕 Rideshare</div>
                            <div className="space-y-2.5">
                                <div><label className={LBL}>Avg cost / ride ($)</label><input type="number" min={0} value={uberCostPerRide} onChange={(e) => setUberCostPerRide(clamp(Number(e.target.value)))} className={INP} /></div>
                                <div>
                                    <label className={LBL}>Rides / week</label>
                                    <Slider value={[ridesPerWeek]} onValueChange={(v) => setRidesPerWeek(v[0])} max={50} step={1} className="py-3" />
                                    <div className="font-mono text-[12px] text-[#86efac]">{ridesPerWeek} rides / week</div>
                                </div>
                                <div className="text-[11px] text-[#b3aae0] leading-snug">≈ {results.impliedMiles.toLocaleString()} mi/yr of travel (at {AVG_RIDE_MILES} mi/ride) vs {milesDriven.toLocaleString()} for the cars.</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Verdict */}
                <div className="flex items-center justify-between gap-5 flex-wrap rounded-2xl px-6 py-5 mb-5 border" style={{ borderColor: "#4a3f7a", background: "#0c0824" }}>
                    <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#29e0ff] mb-1">Ultimate verdict</div>
                        <div className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: "var(--font-bungee), cursive", color: "#29e0ff" }}>{winTitle}</div>
                        <div className={`mt-1 font-bold flex items-center gap-1.5 ${win.text}`}><TrendingDown className="w-4 h-4" /> Saves {fmt(results.savings)} / year vs the next best</div>
                    </div>
                    <div className="text-center bg-[#241a52] border border-[#4a3f7a] rounded-2xl px-6 py-4">
                        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#b3aae0]">5-year impact*</div>
                        <div className="text-3xl font-extrabold text-[#ECEAE3] mt-1">{fmt(results.savings * 5)}</div>
                    </div>
                </div>

                {/* Hero bar chart */}
                <div className="bg-[#0c0824] border border-[#4a3f7a] rounded-2xl p-6 mb-5">
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#b3aae0] mb-5">Annual cost comparison</h3>
                    <div className="space-y-4">
                        {results.ranked.map((c) => {
                            const s = STYLES[c.type]
                            const isWin = c.type === results.winner
                            return (
                                <div key={c.type} className="grid grid-cols-[110px_1fr_92px] sm:grid-cols-[130px_1fr_100px] items-center gap-3">
                                    <span className="text-sm font-semibold text-[#ECEAE3] truncate">{EMOJI[c.type]} {s.label}</span>
                                    <div className="h-8 bg-[#241a52] rounded-lg overflow-hidden">
                                        <div className={`h-full rounded-lg ${s.bar} ${isWin ? `ring-2 ${s.ring}` : ""}`} style={{ width: `${Math.max(6, (c.val / results.maxVal) * 100)}%` }} />
                                    </div>
                                    <span className={`font-mono font-bold text-right text-sm ${s.text}`}>{fmt(c.val)}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Cost tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(["car", "ev", "uber"] as Mode[]).map((m) => {
                        const s = STYLES[m]
                        const val = results[m]
                        return (
                            <div key={m} className="bg-[#0c0824] border border-[#4a3f7a] rounded-2xl p-5">
                                <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#b3aae0] mb-1.5">{s.label} / year</div>
                                <div className={`text-2xl font-extrabold ${s.text}`}>{fmt(val)}</div>
                                <div className="text-[11px] text-[#b3aae0] mt-1">≈ {fmt(val / 12)} / month</div>
                            </div>
                        )
                    })}
                </div>

                <div className="text-[11px] text-[#b3aae0] mt-4">*Rough projection (annual gap × 5). Doesn&apos;t model loan payoff or resale value. Insurance, APR, and rideshare distance are estimates - adjust the inputs for your situation.</div>

                <div className="flex justify-end mt-5">
                    <ShareResult
                        title="Car vs. EV vs. Uber"
                        text={`Cheapest option for me: ${win.label} at ${fmt(results.ranked[0].val)}/year, saving ${fmt(results.savings)}/yr. Compare yours at Docket One.`}
                        className="bg-[#29e0ff] hover:bg-[#29e0ff]/90 text-[#160e33] border-none"
                    />
                </div>
            </div>
        </motion.div>
    )
}
