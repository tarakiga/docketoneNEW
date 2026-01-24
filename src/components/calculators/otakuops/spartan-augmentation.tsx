"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Dna } from "lucide-react"
import { useEffect, useState } from "react"
import { Cell, Legend, Pie, PieChart, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'

export function SpartanAugmentationCalculator() {
    const [genetics, setGenetics] = useState(90) // Match %
    const [luck, setLuck] = useState(5) // 1-10

    const [survivalRate, setSurvivalRate] = useState(0)
    const [washoutRate, setWashoutRate] = useState(0)
    const [deathRate, setDeathRate] = useState(0)
    const [chartData, setChartData] = useState<any[]>([])

    useEffect(() => {
        calculate()
    }, [genetics, luck])

    const calculate = () => {
        // Base survival is low. 
        // 50% survival historically?
        let baseSurvival = (genetics / 200) + (luck / 50) 
        if (baseSurvival > 0.6) baseSurvival = 0.6 // Cap at 60% realistically

        let washout = 0.4 - (baseSurvival / 2)
        let death = 1 - baseSurvival - washout

        setSurvivalRate(baseSurvival * 100)
        setWashoutRate(washout * 100)
        setDeathRate(death * 100)

        setChartData([
            { name: 'Success (Spartan)', value: baseSurvival * 100, fill: '#10b981' },
            { name: 'Washout (Crippled)', value: washout * 100, fill: '#f59e0b' },
            { name: 'KIA (Deceased)', value: death * 100, fill: '#ef4444' },
        ])
    }

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <Card className="glass-card lg:col-span-1 h-fit">
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                            HALO
                        </div>
                    </div>
                    <CardTitle className="flex items-center gap-2">
                        <Dna className="w-5 h-5 text-primary" />
                        Candidate Profile
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Genetic Compatibility</Label>
                        <Slider value={[genetics]} onValueChange={(v) => setGenetics(v[0])} min={50} max={100} step={1} className="py-4" />
                        <div className="text-right text-xs font-mono text-primary font-bold">{genetics}% Match</div>
                    </div>
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Luck Factor</Label>
                        <Slider value={[luck]} onValueChange={(v) => setLuck(v[0])} min={1} max={10} step={1} className="py-4" />
                        <div className="text-right text-xs font-mono text-primary font-bold">{luck}/10</div>
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="glass-card border-none bg-gradient-to-br from-green-900 to-slate-950 p-1">
                        <CardContent className="pt-12 pb-16 text-center">
                            <div className="text-[10px] uppercase opacity-60 tracking-widest mb-2">Likely Outcome</div>
                            <div className="text-4xl font-black text-white mb-2">
                                {survivalRate > 50 ? "SPARTAN" : deathRate > washoutRate ? "DECEASED" : "WASHOUT"}
                            </div>
                            <div className="text-emerald-400 font-mono font-bold">
                                {survivalRate.toFixed(1)}% Survival Chance
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-wider mt-4">
                                From the HALO Lore
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-white/5">
                        <CardHeader><CardTitle className="text-lg font-bold">Procedure Risks</CardTitle></CardHeader>
                        <CardContent className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip contentStyle={{backgroundColor: '#0f172a', border: 'none'}} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                 <div className="px-4">
                    <ShareResult 
                        title="Augmentation Results"
                        text={`I have a ${survivalRate.toFixed(1)}% chance of surviving the Spartan-II augmentation procedures. ${deathRate.toFixed(1)}% chance of death. Do I possess the luck?`}
                        className="w-full py-6 text-lg font-black tracking-tight rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white border-none shadow-2xl shadow-emerald-900/20"
                    />
                </div>
            </div>
        </div>
    )
}
