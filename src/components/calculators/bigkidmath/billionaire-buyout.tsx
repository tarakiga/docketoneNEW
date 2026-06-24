"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { Beef, Building2, FastForward, Globe, Heart, Home, Ship, Zap, type LucideIcon } from "lucide-react"
import { useEffect, useState } from "react"

const BILLIONAIRES = [
    { id: "musk", name: "Elon Musk", wealth: 245_000_000_000 },
    { id: "bezos", name: "Jeff Bezos", wealth: 200_000_000_000 },
    { id: "zuck", name: "Mark Zuckerberg", wealth: 195_000_000_000 },
    { id: "buffett", name: "Warren Buffett", wealth: 140_000_000_000 },
    { id: "gates", name: "Bill Gates", wealth: 125_000_000_000 },
]

const SHOP_ITEMS: { label: string; price: number; icon: LucideIcon; cat: string }[] = [
    { label: "Superyacht", price: 500_000_000, icon: Ship, cat: "Luxury" },
    { label: "Private Island", price: 100_000_000, icon: Globe, cat: "Real Estate" },
    { label: "F-35 Fighter Jet", price: 80_000_000, icon: Zap, cat: "Defense" },
    { label: "Hyper-Luxury Mansion", price: 50_000_000, icon: Home, cat: "Real Estate" },
    { label: "SpaceX Rocket Launch", price: 67_000_000, icon: FastForward, cat: "Space" },
    { label: "Small Nation GDP", price: 1_000_000_000, icon: Building2, cat: "Global" },
    { label: "Meal for 1 Million People", price: 5_000_000, icon: Beef, cat: "Humanitarian" },
    { label: "High-Tech Hospital", price: 250_000_000, icon: Heart, cat: "Healthcare" },
]

const fmtPrice = (p: number) =>
    p >= 1e9 ? `$${(p / 1e9).toLocaleString(undefined, { maximumFractionDigits: 1 })}B`
        : p >= 1e6 ? `$${(p / 1e6).toLocaleString()}M`
            : `$${p.toLocaleString()}`

export function BillionaireBuyout() {
    const [personId, setPersonId] = useState("musk")
    const selectedPerson = BILLIONAIRES.find(p => p.id === personId) || BILLIONAIRES[0]

    // Fix: start funded at the selected billionaire's wealth (was 0 → loaded showing $0).
    const [balance, setBalance] = useState(BILLIONAIRES[0].wealth)
    const [interestEarned, setInterestEarned] = useState(0)

    const spent = Math.max(0, selectedPerson.wealth - balance)

    const handlePersonChange = (value: string) => {
        const next = BILLIONAIRES.find(p => p.id === value) || BILLIONAIRES[0]
        setPersonId(value)
        setBalance(next.wealth)
        setInterestEarned(0)
    }
    const reset = () => { setBalance(selectedPerson.wealth); setInterestEarned(0) }
    const buy = (price: number) => setBalance(prev => Math.max(0, prev - price))

    // Real-time interest simulator (~7% annual returns), display-only.
    useEffect(() => {
        const perSec = (selectedPerson.wealth * 0.07) / (365 * 24 * 60 * 60)
        const timer = setInterval(() => setInterestEarned(prev => prev + perSec / 10), 100)
        return () => clearInterval(timer)
    }, [selectedPerson])

    const years = Math.floor(balance / 1_000_000 / 365)

    return (
        <motion.div
            className="w-full rounded-3xl p-5 md:p-8 shadow-2xl relative overflow-hidden"
            style={{ background: "#1d1442", border: "1px solid #4a3f7a" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
        >
            <div className="relative z-10">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
                    <h2 className="text-2xl font-extrabold flex items-center gap-3" style={{ color: "#ECEAE3" }}><span className="text-3xl">💸</span> Billionaire Buyout</h2>
                    <span className="font-mono text-[11px] tracking-[0.14em] uppercase flex items-center gap-2" style={{ color: "#29e0ff" }}><span className="h-2 w-2 rounded-full animate-pulse" style={{ background: "#29e0ff" }} /> Live vault</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-5">
                    {/* Vault rail */}
                    <div className="rounded-2xl p-6 flex flex-col gap-5 self-start"
                        style={{ background: "#0c0824", border: "1px solid #4a3f7a" }}>
                        <div>
                            <div className="font-mono text-[10px] uppercase tracking-[0.18em] mb-2" style={{ color: "#b3aae0" }}>Net-worth controller</div>
                            <Select value={personId} onValueChange={handlePersonChange}>
                                <SelectTrigger className="font-bold text-base h-12" style={{ background: "#0c0824", border: "1px solid #4a3f7a", color: "#ECEAE3" }}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent style={{ background: "#0c0824", border: "1px solid #4a3f7a", color: "#ECEAE3" }}>
                                    {BILLIONAIRES.map(p => (
                                        <SelectItem key={p.id} value={p.id} className="font-semibold">{p.name} - {fmtPrice(p.wealth)}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <div className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "#29e0ff" }}>Active liquidity</div>
                            <div className="text-4xl font-black tracking-tight leading-none mt-1.5 break-all" style={{ fontFamily: "var(--font-bungee), cursive", color: "#29e0ff" }}>${Math.floor(balance).toLocaleString()}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-xl p-3" style={{ background: "#241a52", border: "1px solid #4a3f7a" }}>
                                <div className="font-mono text-[9px] uppercase tracking-[0.1em]" style={{ color: "#b3aae0" }}>↗ Interest · live</div>
                                <div className="font-mono font-bold text-lg mt-0.5" style={{ color: "#86efac" }}>+${Math.floor(interestEarned).toLocaleString()}</div>
                            </div>
                            <div className="rounded-xl p-3" style={{ background: "#241a52", border: "1px solid #4a3f7a" }}>
                                <div className="font-mono text-[9px] uppercase tracking-[0.1em]" style={{ color: "#b3aae0" }}>$1M/day for</div>
                                <div className="font-mono font-bold text-lg mt-0.5" style={{ color: "#29e0ff" }}>{years.toLocaleString()} yrs</div>
                            </div>
                        </div>

                        <button onClick={reset} className="w-full rounded-xl font-bold text-sm py-3 transition-colors" style={{ background: "#241a52", border: "1px solid #4a3f7a", color: "#ECEAE3" }}>↺ Reset Vault</button>
                    </div>

                    {/* Storefront */}
                    <div>
                        <div className="flex justify-between items-baseline mb-3">
                            <div className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: "#b3aae0" }}>The storefront</div>
                            <div className="font-mono text-[12px]" style={{ color: "#b3aae0" }}>Spent so far: <b style={{ color: "#ff8a8a" }}>${spent.toLocaleString()}</b></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {SHOP_ITEMS.map((item) => {
                                const Icon = item.icon
                                const tooPoor = balance < item.price
                                return (
                                    <motion.button
                                        key={item.label}
                                        whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
                                        onClick={() => buy(item.price)}
                                        disabled={tooPoor}
                                        className={`text-left flex items-center gap-3.5 rounded-2xl p-4 transition-colors ${tooPoor ? "opacity-40 cursor-not-allowed" : ""}`}
                                        style={{ background: "#241a52", border: "1px solid #4a3f7a" }}
                                    >
                                        <span className="w-11 h-11 rounded-xl grid place-items-center shrink-0" style={{ background: "#0c0824" }}><Icon className="h-5 w-5" style={{ color: "#29e0ff" }} /></span>
                                        <span className="flex-1 min-w-0">
                                            <span className="block font-mono text-[9px] uppercase tracking-[0.1em]" style={{ color: "#b3aae0" }}>{item.cat}</span>
                                            <span className="block text-[13px] font-bold leading-tight" style={{ color: "#ECEAE3" }}>{item.label}</span>
                                        </span>
                                        <span className="font-mono text-sm font-bold text-right" style={{ color: "#29e0ff" }}>{fmtPrice(item.price)}</span>
                                    </motion.button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <ShareResult
                        title="Billionaire Buy-Out Challenge"
                        text={`I tried to spend ${selectedPerson.name}'s fortune! After splurging $${spent.toLocaleString()}, I still have $${Math.floor(balance).toLocaleString()} left. The wealth scale is insane! #DocketOne`}
                        className="border-none bg-[#29e0ff] hover:bg-[#29e0ff] text-[#160e33]"
                    />
                </div>
            </div>
        </motion.div>
    )
}
