"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUnitConverter } from "@/hooks/use-unit-converter"
import { useMemo, useState } from "react"

export function CurrencyConverterUI({ units }: { units: string[] }) {
    const { convert, values, setCategory, rates, lastUpdated } = useUnitConverter("currency")
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
                    <Label>AMOUNT</Label>
                    <Input 
                        type="number" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-background/50 border-input/50 focus-visible:ring-primary backdrop-blur-sm"
                    />
                </div>
                
                 {/* Gap or Just layout */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label>FROM CURRENCY</Label>
                    <Select value={from} onValueChange={setFrom}>
                        <SelectTrigger className="bg-background/50 border-input/50">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {units.map(u => (
                                <SelectItem key={u} value={u}>{u}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="space-y-2">
                    <Label>TO CURRENCY</Label>
                    <Select value={to} onValueChange={setTo}>
                        <SelectTrigger className="bg-background/50 border-input/50">
                             <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {units.map(u => (
                                <SelectItem key={u} value={u}>{u}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="bg-white/50 dark:bg-black/20 border border-primary/20 rounded-xl p-8 text-center shadow-inner relative group">
                <div className="text-muted-foreground mb-2 text-sm font-medium uppercase tracking-wider">Result</div>
                <div className="text-5xl font-bold text-primary tracking-tight">
                    {result} <span className="text-2xl text-muted-foreground ml-2">{to}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-4 pt-4 border-t border-dashed border-primary/10">
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
