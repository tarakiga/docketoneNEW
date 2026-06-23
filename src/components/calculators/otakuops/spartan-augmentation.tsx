"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Dna } from "lucide-react"
import { useMemo, useState } from "react"
import { Cell, Legend, Pie, PieChart, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'

export function SpartanAugmentationCalculator() {
    const [genetics, setGenetics] = useState(90) // Match %
    const [luck, setLuck] = useState(5) // 1-10

    const { survivalRate, washoutRate, deathRate, chartData } = useMemo(() => {
        // Base survival is low. 
        // 50% survival historically?
        let baseSurvival = (genetics / 200) + (luck / 50)
        if (baseSurvival > 0.6) baseSurvival = 0.6

        const washout = 0.4 - (baseSurvival / 2)
        const death = 1 - baseSurvival - washout

        return {
            survivalRate: baseSurvival * 100,
            washoutRate: washout * 100,
            deathRate: death * 100,
            chartData: [
                { name: 'Success (Spartan)', value: baseSurvival * 100, fill: '#86efac' },
                { name: 'Washout (Crippled)', value: washout * 100, fill: '#ffd23c' },
                { name: 'KIA (Deceased)', value: death * 100, fill: '#ff8a8a' },
            ]
        }
    }, [genetics, luck])

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 h-fit" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: '#241a52', borderWidth: 1, borderStyle: 'solid', borderColor: '#4a3f7a', color: '#ffd23c' }}>
                            HALO
                        </div>
                    </div>
                    <CardTitle className="flex items-center gap-2" style={{ color: '#ECEAE3' }}>
                        <Dna className="w-5 h-5" style={{ color: '#ffd23c' }} />
                        Candidate Profile
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#b3aae0' }}>Genetic Compatibility</Label>
                        <Slider value={[genetics]} onValueChange={(v) => setGenetics(v[0])} min={50} max={100} step={1} className="py-4" />
                        <div className="text-right text-xs font-mono font-bold" style={{ color: '#ffd23c' }}>{genetics}% Match</div>
                    </div>
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#b3aae0' }}>Luck Factor</Label>
                        <Slider value={[luck]} onValueChange={(v) => setLuck(v[0])} min={1} max={10} step={1} className="py-4" />
                        <div className="text-right text-xs font-mono font-bold" style={{ color: '#ffd23c' }}>{luck}/10</div>
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border-none p-1" style={{ backgroundColor: '#0c0824' }}>
                        <CardContent className="pt-12 pb-16 text-center">
                            <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: '#b3aae0' }}>Likely Outcome</div>
                            <div className="text-4xl font-black mb-2" style={{ fontFamily: 'var(--font-bungee), cursive', color: '#ffd23c' }}>
                                {survivalRate > 50 ? "SPARTAN" : deathRate > washoutRate ? "DECEASED" : "WASHOUT"}
                            </div>
                            <div className="font-mono font-bold" style={{ color: '#86efac' }}>
                                {survivalRate.toFixed(1)}% Survival Chance
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mt-4" style={{ backgroundColor: '#241a52', borderWidth: 1, borderStyle: 'solid', borderColor: '#4a3f7a', color: '#ffd23c' }}>
                                From the HALO Lore
                            </div>
                        </CardContent>
                    </Card>

                    <Card style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
                        <CardHeader><CardTitle className="text-lg font-bold" style={{ color: '#ECEAE3' }}>Procedure Risks</CardTitle></CardHeader>
                        <CardContent className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip contentStyle={{backgroundColor: '#0c0824', border: 'none', color: '#ECEAE3'}} />
                                    <Legend formatter={(value, entry) => (
                                        <span style={{ color: entry?.value === 'Washout (Crippled)' ? '#ffd23c' : (entry?.color as string) }}>{value}</span>
                                    )} />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                 <div className="px-4">
                    <ShareResult
                        title="Augmentation Results"
                        text={`I have a ${survivalRate.toFixed(1)}% chance of surviving the Spartan-II augmentation procedures. ${deathRate.toFixed(1)}% chance of death. Do I possess the luck?`}
                        className="w-full py-6 text-lg font-black tracking-tight rounded-2xl border-none !bg-[#ffd23c] hover:!bg-[#ffd23c] !text-[#160e33]"
                    />
                </div>
            </div>
        </div>
    )
}
