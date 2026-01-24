"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield } from "lucide-react"
import { useEffect, useState } from "react"

export function MjolnirArmorCostCalculator() {
    const [generation, setGeneration] = useState<"mk4" | "mk5" | "mk6">("mk5")
    const [userNetWorth, setUserNetWorth] = useState(50000)

    const [cost, setCost] = useState(0)
    const [debt, setDebt] = useState(0)
    const [carrierGroups, setCarrierGroups] = useState(0)

    useEffect(() => {
        let baseCost = 0
        // Cost in cR (Credits)
        if (generation === "mk4") baseCost = 150000000000 // Very expensive prototype
        else if (generation === "mk5") baseCost = 200000000000 // Added shields
        else baseCost = 80000000000 // Mass production efficiencies

        setCost(baseCost)
        setDebt(baseCost - userNetWorth)
        setCarrierGroups(baseCost / 40000000000) // Carrier group ~40B cR?
    }, [generation, userNetWorth])

    const formattedCost = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cost)
    const formattedDebt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(debt))

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <Card className="glass-card lg:col-span-1 h-fit">
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-500 uppercase tracking-widest">
                            HALO
                        </div>
                    </div>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Requisition Form
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Armor Generation</Label>
                        <Tabs defaultValue="mk5" onValueChange={(v) => setGeneration(v as any)} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 bg-white/5">
                                <TabsTrigger value="mk4">Mk IV</TabsTrigger>
                                <TabsTrigger value="mk5">Mk V</TabsTrigger>
                                <TabsTrigger value="mk6">Mk VI</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Your Net Worth (cR)</Label>
                        <Input type="number" value={userNetWorth} onChange={(e) => setUserNetWorth(Number(e.target.value))} className="bg-white/5 border-white/10" />
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <Card className="glass-card border-none bg-gradient-to-br from-green-900 to-slate-950 p-1">
                     <CardContent className="pt-12 pb-16 text-center">
                        <div className="text-[10px] uppercase opacity-60 tracking-widest mb-2">Estimated Cost</div>
                        <div className="text-4xl md:text-6xl font-black text-white mb-2">{formattedCost}</div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-500 uppercase tracking-wider mb-8">
                            From the HALO Lore
                        </div>

                        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                <div className="text-xs opacity-50 mb-1">Your Debt</div>
                                <div className="text-xl font-bold text-red-500">-{formattedDebt}</div>
                            </div>
                             <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                <div className="text-xs opacity-50 mb-1">Equivalent Carrier Groups</div>
                                <div className="text-xl font-bold text-blue-500">{carrierGroups.toFixed(1)}</div>
                            </div>
                        </div>

                         <div className="mt-10 px-4">
                            <ShareResult 
                                title="MJOLNIR Requisition"
                                text={`I'm trying to buy MJOLNIR ${generation.toUpperCase()} armor. It costs ${formattedCost}. I am currently ${formattedDebt} in debt. Please donate.`}
                                className="w-full py-6 text-lg font-black tracking-tight rounded-2xl bg-green-600 hover:bg-green-500 text-white border-none shadow-2xl shadow-green-900/20"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
