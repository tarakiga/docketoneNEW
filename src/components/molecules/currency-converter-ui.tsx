"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUnitConverter } from "@/hooks/use-unit-converter"
import { useMemo, useState } from "react"

export function CurrencyConverterUI({ units }: { units: string[] }) {
    const { rates, lastUpdated } = useUnitConverter("currency")
    const [amount, setAmount] = useState<string>("1")
    const [from, setFrom] = useState<string>("USD")
    const [to, setTo] = useState<string>("EUR")

    // Calculate result locally since the hook does "broadcast" conversion which isn't ideal for this specific UI
    // or we can reuse the hook if we adapt it. 
    // Actually, let's just use the rates from the hook directly.
    
    const result = useMemo(() => {
        if (!rates || !amount) return "..."
        const val = parseFloat(amount)
        if (isNaN(val)) return "0.00"
        
        // Base is USD
        const fromRate = rates[from] || 1
        const toRate = rates[to] || 1
        
        // Convert to USD then to target
        const inUSD = val / fromRate
        const final = inUSD * toRate
        
        return final.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }, [amount, from, to, rates])

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-[#b3aae0]">AMOUNT</Label>
                    <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-[#160e33] border-[#4a3f7a] text-[#ECEAE3] placeholder:text-[#8a83b0] focus-visible:ring-[#29e0ff] focus-visible:border-[#29e0ff]"
                    />
                </div>
                
                 {/* Gap or Just layout */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label className="text-[#b3aae0]">FROM CURRENCY</Label>
                    <Select value={from} onValueChange={setFrom}>
                        <SelectTrigger className="bg-[#160e33] border-[#4a3f7a] text-[#ECEAE3]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1d1442] border-[#4a3f7a] text-[#ECEAE3]">
                            {units.map(u => (
                                <SelectItem key={u} value={u}>{u}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="space-y-2">
                    <Label className="text-[#b3aae0]">TO CURRENCY</Label>
                    <Select value={to} onValueChange={setTo}>
                        <SelectTrigger className="bg-[#160e33] border-[#4a3f7a] text-[#ECEAE3]">
                             <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1d1442] border-[#4a3f7a] text-[#ECEAE3]">
                            {units.map(u => (
                                <SelectItem key={u} value={u}>{u}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="bg-[#160e33] border border-[#4a3f7a] rounded-xl p-8 text-center relative group">
                <div className="text-[#b3aae0] mb-2 text-sm font-medium uppercase tracking-wider">Result</div>
                <div className="text-5xl font-bold text-[#29e0ff] tracking-tight" style={{ fontFamily: "var(--font-bungee), cursive" }}>
                    {result} <span className="text-2xl text-[#b3aae0] ml-2">{to}</span>
                </div>
                <div className="text-xs text-[#b3aae0] mt-4 pt-4 border-t border-dashed border-[#4a3f7a]">
                    Last updated: {lastUpdated ? lastUpdated.toLocaleString() : "Loading..."}
                </div>
                
                <div className="mt-6 flex justify-center">
                    <ShareResult 
                        title="Currency Construction" 
                        text={`I just converted ${amount} ${from} to ${result} ${to} on Docket One!`} 
                    />
                </div>
            </div>
        </div>
    )
}
