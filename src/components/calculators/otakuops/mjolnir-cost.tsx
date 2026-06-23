"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield } from "lucide-react"
import { useMemo, useState } from "react"

export function MjolnirArmorCostCalculator() {
    const [generation, setGeneration] = useState<"mk4" | "mk5" | "mk6">("mk5")
    const [userNetWorth, setUserNetWorth] = useState(50000)

    const { cost, debt, carrierGroups } = useMemo(() => {
        let baseCost = 0
        if (generation === "mk4") baseCost = 150000000000
        else if (generation === "mk5") baseCost = 200000000000
        else baseCost = 80000000000

        return {
            cost: baseCost,
            debt: baseCost - userNetWorth,
            carrierGroups: baseCost / 40000000000
        }
    }, [generation, userNetWorth])

    const inDebt = debt > 0
    const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
    const formattedCost = fmt.format(cost)
    const formattedDebt = fmt.format(Math.abs(debt))

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <Card className="glass-card lg:col-span-1 h-fit min-w-0" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: '#241a52', borderWidth: '1px', borderStyle: 'solid', borderColor: '#4a3f7a', color: '#ffd23c' }}>
                            HALO
                        </div>
                    </div>
                    <CardTitle className="flex items-center gap-2" style={{ color: '#ECEAE3' }}>
                        <Shield className="w-5 h-5" style={{ color: '#ffd23c' }} />
                        Requisition Form
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#b3aae0' }}>Armor Generation</Label>
                        <Tabs defaultValue="mk5" onValueChange={(v) => setGeneration(v as "mk4" | "mk5" | "mk6")} className="w-full">
                            <TabsList className="grid w-full grid-cols-3" style={{ backgroundColor: '#0c0824' }}>
                                <TabsTrigger value="mk4" className="!text-[#b3aae0] !bg-[#241a52] border border-[#4a3f7a] data-[state=active]:!bg-[#ffd23c] data-[state=active]:!text-[#160e33]">Mk IV</TabsTrigger>
                                <TabsTrigger value="mk5" className="!text-[#b3aae0] !bg-[#241a52] border border-[#4a3f7a] data-[state=active]:!bg-[#ffd23c] data-[state=active]:!text-[#160e33]">Mk V</TabsTrigger>
                                <TabsTrigger value="mk6" className="!text-[#b3aae0] !bg-[#241a52] border border-[#4a3f7a] data-[state=active]:!bg-[#ffd23c] data-[state=active]:!text-[#160e33]">Mk VI</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#b3aae0' }}>Your Net Worth (cR)</Label>
                        <Input type="number" min={0} value={userNetWorth} onChange={(e) => { const v = Number(e.target.value); setUserNetWorth(Number.isFinite(v) ? Math.max(0, v) : 0) }} style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a', color: '#ECEAE3' }} />
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6 min-w-0">
                <Card className="glass-card border-none p-1" style={{ backgroundColor: '#1d1442' }}>
                     <CardContent className="pt-12 pb-16 text-center">
                        <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: '#b3aae0' }}>Estimated Cost</div>
                        <div className="text-2xl sm:text-4xl md:text-6xl font-black mb-2 break-words leading-tight px-2" style={{ fontFamily: 'var(--font-bungee), cursive', color: '#ffd23c' }}>{formattedCost}</div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-8" style={{ backgroundColor: '#241a52', borderWidth: '1px', borderStyle: 'solid', borderColor: '#4a3f7a', color: '#ffd23c' }}>
                            From the HALO Lore
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                            <div className="min-w-0 p-4 rounded-2xl" style={{ backgroundColor: '#0c0824', borderWidth: '1px', borderStyle: 'solid', borderColor: '#4a3f7a' }}>
                                <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#b3aae0' }}>{inDebt ? "Your Debt" : "Your Surplus"}</div>
                                <div className="text-lg md:text-xl font-bold break-all" style={{ color: inDebt ? '#ff8a8a' : '#86efac' }}>{inDebt ? "−" : "+"}{formattedDebt}</div>
                            </div>
                             <div className="min-w-0 p-4 rounded-2xl" style={{ backgroundColor: '#0c0824', borderWidth: '1px', borderStyle: 'solid', borderColor: '#4a3f7a' }}>
                                <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#b3aae0' }}>Equivalent Carrier Groups</div>
                                <div className="text-lg md:text-xl font-bold" style={{ color: '#ffd23c' }}>{carrierGroups.toFixed(1)}</div>
                            </div>
                        </div>

                         <div className="mt-10 px-4">
                            <ShareResult
                                title="MJOLNIR Requisition"
                                text={inDebt
                                    ? `I'm trying to buy MJOLNIR ${generation.toUpperCase()} armor. It costs ${formattedCost}. I'm currently ${formattedDebt} short. Please donate.`
                                    : `I can actually afford MJOLNIR ${generation.toUpperCase()} armor (${formattedCost}) with ${formattedDebt} to spare. Sign me up, ONI.`}
                                className="w-full py-6 text-lg font-black tracking-tight rounded-2xl border-none shadow-2xl !bg-[#ffd23c] hover:!bg-[#ffd23c] !text-[#160e33] !border-none"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
