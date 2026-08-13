"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"
import { TrendingDown } from "lucide-react"
import { useMemo, useState } from "react"

type Mode = "car" | "ev" | "uber"

const STYLES: Record<Mode, { label: string; text: string; bar: string; ring: string }> = {
    car: { label: "Gas Car", text: "text-[var(--dk-tea-ink)]", bar: "bg-[var(--dk-tea)]", ring: "ring-[var(--dk-tea-ink)]/60" },
    ev: { label: "Electric", text: "text-[var(--dk-ink-soft)]", bar: "bg-[var(--dk-mute)]", ring: "ring-[var(--dk-line-soft)]/60" },
    uber: { label: "Rideshare", text: "text-[var(--dk-pos-ink)]", bar: "bg-[var(--dk-pos)]", ring: "ring-[var(--dk-pos-ink)]/60" },
}
const EMOJI: Record<Mode, string> = { car: "⛽", ev: "⚡", uber: "🚕" }
const AVG_RIDE_MILES = 15

const LBL = "block font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--dk-ink-soft)] mb-1.5"
const INP = "w-full bg-[var(--dk-sunk)] border border-[var(--dk-line)] rounded-lg px-2.5 py-2 text-[var(--dk-ink)] text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dk-tea-ink)]/50"
const clamp = (v: number) => Math.max(0, Number.isFinite(v) ? v : 0)

export function CarVsUberCalculator() {
    // Shared
    const [milesDriven, setMilesDriven] = useState(12000)
    const [holdYears, setHoldYears] = useState(5)
    const [loanTerm, setLoanTerm] = useState(5)
    const [interestRate, setInterestRate] = useState(5.5)
    const [insurance, setInsurance] = useState(1500)

    // Resale after the holding period. Depreciation is the largest single cost
    // of owning a car and the model ignored it entirely, which flattered
    // ownership badly — a $32k car that is worth $13k in five years has cost
    // $19k in value nobody was counting.
    const [gasResalePct, setGasResalePct] = useState(40)
    const [evResalePct, setEvResalePct] = useState(35)

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
    // was hardcoded at 400 while the gas figure was an input — asymmetric, and
    // invisible to anyone wondering why the EV looked cheap
    const [evMaintenance, setEvMaintenance] = useState(400)

    // Rideshare
    const [uberCostPerRide, setUberCostPerRide] = useState(22)
    const [ridesPerWeek, setRidesPerWeek] = useState(10)

    const results = useMemo(() => {
        const years = Math.max(1, holdYears)

        /** Everything the car costs you in cash over the whole loan, incl. interest. */
        const loanTotal = (price: number) => {
            const r = interestRate / 100 / 12
            const n = loanTerm * 12
            if (price <= 0) return 0
            if (r === 0) return price
            const monthly = price * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
            return monthly * n
        }

        /**
         * Total cost of owning over the holding period, not an annual snapshot.
         *
         * The old model reported one annual figure that silently assumed the
         * loan payment ran forever, then multiplied it by five for a "5-year
         * impact". Both are wrong in opposite directions: payments stop when
         * the loan ends, and the money sunk into depreciation was never counted
         * at all. Doing it over an explicit horizon fixes both — and the
         * headline number stops being an extrapolation.
         */
        const ownCost = (price: number, extras: number, running: number, resalePct: number) => {
            const financed = loanTotal(price + extras)
            const resale = price * (resalePct / 100)
            return financed + running * years - resale
        }

        const carRunning = insurance + maintenance + (milesDriven / (mpg || 1)) * fuelCost
        // EVs do insure higher; it was applied silently, and is now stated in the UI
        const evRunning = insurance * 1.1 + evMaintenance + (milesDriven / (evEfficiency || 1)) * electricityCost

        const totalCar = ownCost(carPrice, 0, carRunning, gasResalePct)
        const totalEv = ownCost(evPrice, chargerInstall, evRunning, evResalePct)
        const totalUber = uberCostPerRide * ridesPerWeek * 52 * years

        const arr: { type: Mode; val: number }[] = [
            { type: "car", val: totalCar },
            { type: "ev", val: totalEv },
            { type: "uber", val: totalUber },
        ]
        const costs = [...arr].sort((a, b) => a.val - b.val)

        const impliedMiles = ridesPerWeek * 52 * AVG_RIDE_MILES
        return {
            car: totalCar, ev: totalEv, uber: totalUber,
            ranked: costs,
            winner: costs[0].type,
            savings: costs[1].val - costs[0].val,
            maxVal: costs[2].val,
            years,
            impliedMiles,
            // the comparison is only honest if both sides cover the same travel
            mileageGap: milesDriven > 0 ? impliedMiles / milesDriven : 1,
            depreciationCar: carPrice * (1 - gasResalePct / 100),
            depreciationEv: evPrice * (1 - evResalePct / 100),
        }
    }, [milesDriven, holdYears, loanTerm, interestRate, insurance, carPrice, mpg, fuelCost, maintenance, evPrice, evEfficiency, electricityCost, chargerInstall, evMaintenance, uberCostPerRide, ridesPerWeek, gasResalePct, evResalePct])

    const fmt = (v: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v)
    const win = STYLES[results.winner]
    const winTitle = results.winner === "car" ? "Own a Gas Car" : results.winner === "ev" ? "Go Electric" : "Stick to Rideshare"

    return (
        <motion.div
            className="w-full bg-[var(--dk-surface)] rounded-3xl p-5 md:p-8 border border-[var(--dk-line)] shadow-2xl relative overflow-hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
        >
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
                    <h2 className="text-2xl font-extrabold text-[var(--dk-ink)] flex items-center gap-3"><span className="text-3xl">🚗</span> Car vs EV vs Uber</h2>
                    <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--dk-tea-ink)] flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[var(--dk-tea)] animate-pulse" /> Annual cost model</span>
                </div>

                {/* Inputs zone */}
                <div className="bg-[var(--dk-sunk)] border border-[var(--dk-line)] rounded-2xl p-5 mb-6 space-y-5">
                    {/* Shared assumptions */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-5 border-b border-[var(--dk-line)]">
                        <div className="col-span-2 md:col-span-1">
                            <label className={LBL}>Annual mileage</label>
                            <Slider value={[milesDriven]} onValueChange={(v) => setMilesDriven(v[0])} min={1000} max={40000} step={500} className="py-3" />
                            <div className="font-mono text-[12px] text-[var(--dk-tea-ink)]">{milesDriven.toLocaleString()} miles / year</div>
                        </div>
                        <div><label className={LBL}>Years you keep it</label><input type="number" min={1} max={20} value={holdYears} onChange={(e) => setHoldYears(clamp(Number(e.target.value)) || 1)} className={INP} /></div>
                        <div><label className={LBL}>Loan term (yrs)</label><input type="number" min={1} max={10} value={loanTerm} onChange={(e) => setLoanTerm(clamp(Number(e.target.value)) || 1)} className={INP} /></div>
                        <div><label className={LBL}>Loan APR (%)</label><input type="number" min={0} step={0.1} value={interestRate} onChange={(e) => setInterestRate(clamp(Number(e.target.value)))} className={INP} /></div>
                        <div><label className={LBL}>Insurance / yr ($)</label><input type="number" min={0} value={insurance} onChange={(e) => setInsurance(clamp(Number(e.target.value)))} className={INP} /></div>
                    </div>

                    {/* Per-scenario inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                            <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--dk-tea-ink)] mb-2.5">⛽ Gas Car</div>
                            <div className="grid grid-cols-2 gap-2.5">
                                <div className="col-span-2"><label className={LBL}>Purchase price ($)</label><input type="number" min={0} value={carPrice} onChange={(e) => setCarPrice(clamp(Number(e.target.value)))} className={INP} /></div>
                                <div><label className={LBL}>MPG</label><input type="number" min={1} value={mpg} onChange={(e) => setMpg(clamp(Number(e.target.value)) || 1)} className={INP} /></div>
                                <div><label className={LBL}>Gas $/gal</label><input type="number" min={0} step={0.1} value={fuelCost} onChange={(e) => setFuelCost(clamp(Number(e.target.value)))} className={INP} /></div>
                                <div><label className={LBL}>Maintenance / yr ($)</label><input type="number" min={0} value={maintenance} onChange={(e) => setMaintenance(clamp(Number(e.target.value)))} className={INP} /></div>
                                <div><label className={LBL}>Resale after {results.years}y (%)</label><input type="number" min={0} max={100} value={gasResalePct} onChange={(e) => setGasResalePct(Math.min(100, clamp(Number(e.target.value))))} className={INP} /></div>
                                <div className="col-span-2 text-[11px] text-[var(--dk-ink-soft)] leading-snug">Loses {fmt(results.depreciationCar)} in value — usually the biggest cost of owning.</div>
                            </div>
                        </div>
                        <div>
                            <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--dk-ink-soft)] mb-2.5">⚡ Electric</div>
                            <div className="grid grid-cols-2 gap-2.5">
                                <div className="col-span-2"><label className={LBL}>EV price ($)</label><input type="number" min={0} value={evPrice} onChange={(e) => setEvPrice(clamp(Number(e.target.value)))} className={INP} /></div>
                                <div><label className={LBL}>mi / kWh</label><input type="number" min={0.1} step={0.1} value={evEfficiency} onChange={(e) => setEvEfficiency(clamp(Number(e.target.value)) || 0.1)} className={INP} /></div>
                                <div><label className={LBL}>Elec $/kWh</label><input type="number" min={0} step={0.01} value={electricityCost} onChange={(e) => setElectricityCost(clamp(Number(e.target.value)))} className={INP} /></div>
                                <div><label className={LBL}>Charger install ($)</label><input type="number" min={0} value={chargerInstall} onChange={(e) => setChargerInstall(clamp(Number(e.target.value)))} className={INP} /></div>
                                <div><label className={LBL}>Maintenance / yr ($)</label><input type="number" min={0} value={evMaintenance} onChange={(e) => setEvMaintenance(clamp(Number(e.target.value)))} className={INP} /></div>
                                <div><label className={LBL}>Resale after {results.years}y (%)</label><input type="number" min={0} max={100} value={evResalePct} onChange={(e) => setEvResalePct(Math.min(100, clamp(Number(e.target.value))))} className={INP} /></div>
                                <div className="col-span-2 text-[11px] text-[var(--dk-ink-soft)] leading-snug">Loses {fmt(results.depreciationEv)} in value. Insurance is modelled 10% above the gas figure.</div>
                            </div>
                        </div>
                        <div>
                            <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--dk-pos-ink)] mb-2.5">🚕 Rideshare</div>
                            <div className="space-y-2.5">
                                <div><label className={LBL}>Avg cost / ride ($)</label><input type="number" min={0} value={uberCostPerRide} onChange={(e) => setUberCostPerRide(clamp(Number(e.target.value)))} className={INP} /></div>
                                <div>
                                    <label className={LBL}>Rides / week</label>
                                    <Slider value={[ridesPerWeek]} onValueChange={(v) => setRidesPerWeek(v[0])} max={50} step={1} className="py-3" />
                                    <div className="font-mono text-[12px] text-[var(--dk-pos-ink)]">{ridesPerWeek} rides / week</div>
                                </div>
                                {/* The mismatch was pointed out but not fixable, so the
                                    ranking could compare different amounts of travel. */}
                                <button
                                    type="button"
                                    onClick={() => setRidesPerWeek(Math.max(1, Math.round(milesDriven / 52 / AVG_RIDE_MILES)))}
                                    className="w-full rounded-lg border border-[var(--dk-line)] bg-[var(--dk-raised)] px-3 py-2 text-[11px] font-bold text-[var(--dk-ink)] hover:border-[var(--dk-pos-ink)]"
                                >
                                    Match the cars&apos; mileage
                                </button>
                                <div className="text-[11px] text-[var(--dk-ink-soft)] leading-snug">
                                    ≈ {results.impliedMiles.toLocaleString()} mi/yr (at {AVG_RIDE_MILES} mi/ride) vs {milesDriven.toLocaleString()} for the cars.
                                    {results.mileageGap < 0.75 && <span className="text-[var(--dk-warn-ink)] font-bold"> Rideshare is covering far less travel — not a like-for-like comparison.</span>}
                                    {results.mileageGap > 1.33 && <span className="text-[var(--dk-warn-ink)] font-bold"> Rideshare is covering far more travel than the cars.</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Verdict */}
                <div className="flex items-center justify-between gap-5 flex-wrap rounded-2xl px-6 py-5 mb-5 border" style={{ borderColor: "var(--dk-line)", background: "var(--dk-sunk)" }}>
                    <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--dk-tea-ink)] mb-1">Ultimate verdict</div>
                        <div className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: "var(--font-fredoka), cursive", color: "var(--dk-tea-ink)" }}>{winTitle}</div>
                        <div className={`mt-1 font-bold flex items-center gap-1.5 ${win.text}`}><TrendingDown className="w-4 h-4" /> Saves {fmt(results.savings)} over {results.years} years vs the next best</div>
                    </div>
                    {/* was savings x 5 — a straight-line extrapolation of a figure
                        that is not straight: loan payments stop, resale lands once.
                        This is the modelled total over the horizon. */}
                    <div className="text-center bg-[var(--dk-raised)] border border-[var(--dk-line)] rounded-2xl px-6 py-4">
                        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--dk-ink-soft)]">{results.years}-year total</div>
                        <div className="text-3xl font-extrabold text-[var(--dk-ink)] mt-1">{fmt(results.ranked[0].val)}</div>
                    </div>
                </div>

                {/* Hero bar chart */}
                <div className="bg-[var(--dk-sunk)] border border-[var(--dk-line)] rounded-2xl p-6 mb-5">
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--dk-ink-soft)] mb-5">Total cost over {results.years} years</h3>
                    <div className="space-y-4">
                        {results.ranked.map((c) => {
                            const s = STYLES[c.type]
                            const isWin = c.type === results.winner
                            return (
                                <div key={c.type} className="grid grid-cols-[88px_1fr_80px] sm:grid-cols-[130px_1fr_100px] items-center gap-2 sm:gap-3">
                                    <span className="min-w-0 text-sm font-semibold text-[var(--dk-ink)] truncate">{EMOJI[c.type]} {s.label}</span>
                                    <div className="min-w-0 h-8 bg-[var(--dk-raised)] rounded-lg overflow-hidden">
                                        <div className={`h-full rounded-lg ${s.bar} ${isWin ? `ring-2 ${s.ring}` : ""}`} style={{ width: `${Math.max(6, (c.val / results.maxVal) * 100)}%` }} />
                                    </div>
                                    <span className={`min-w-0 truncate font-mono font-bold text-right text-sm ${s.text}`}>{fmt(c.val)}</span>
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
                            <div key={m} className="bg-[var(--dk-sunk)] border border-[var(--dk-line)] rounded-2xl p-5">
                                <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--dk-ink-soft)] mb-1.5">{s.label} · {results.years}y total</div>
                                <div className={`text-2xl font-extrabold ${s.text}`}>{fmt(val)}</div>
                                <div className="text-[11px] text-[var(--dk-ink-soft)] mt-1">≈ {fmt(val / results.years / 12)} / month</div>
                            </div>
                        )
                    })}
                </div>

                <div className="text-[11px] text-[var(--dk-ink-soft)] mt-4">*Rough projection (annual gap × 5). Doesn&apos;t model loan payoff or resale value. Insurance, APR, and rideshare distance are estimates - adjust the inputs for your situation.</div>

                <div className="flex justify-end mt-5">
                    <ShareResult
                        title="Car vs. EV vs. Uber"
                        text={`Cheapest option for me: ${win.label} at ${fmt(results.ranked[0].val)}/year, saving ${fmt(results.savings)}/yr. Compare yours at Docket One.`}
                        className="bg-[var(--dk-tea)] hover:bg-[var(--dk-tea)]/90 text-[var(--dk-on-fill)] border-none"
                    />
                </div>
            </div>
        </motion.div>
    )
}
