"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Megaphone, Paintbrush } from "lucide-react"
import { useMemo, useState } from "react"
import { Bar, BarChart, Cell, ResponsiveContainer, YAxis } from 'recharts'

export function OrkWAAAGHEnergyCalculator() {
    const [orks, setOrks] = useState(100)
    const [loudness, setLoudness] = useState(110) // dB
    const [redPaint, setRedPaint] = useState(false)

    const { energy, speedBoost, chartData } = useMemo(() => {
        // Super-linear crowd amplification, scaled so a real mob reaches the kJ–MJ range.
        let waaghOutput = Math.pow(orks, 1.5) * (loudness / 10) * 100
        let speed = 0

        if (redPaint) {
            // Lore: red things go "10-20% fasta" - bigger mobs believe harder.
            speed = 10 + (orks / 1000) * 10
            waaghOutput *= 1.2
        }

        return {
            energy: waaghOutput,
            speedBoost: speed,
            chartData: [
                { name: 'Base Power', val: waaghOutput * 0.8, fill: '#86efac' },
                { name: 'Belief Bonus', val: waaghOutput * 0.2, fill: '#ffd23c' },
            ]
        }
    }, [orks, loudness, redPaint])

    const formatEnergy = (val: number) => {
        if (val >= 1000000) return (val / 1000000).toFixed(1) + " MJ"
        if (val >= 1000) return (val / 1000).toFixed(1) + " kJ"
        return val.toFixed(0) + " J"
    }

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <Card className="glass-card lg:col-span-1 h-fit" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: '#0c0824', border: '1px solid #4a3f7a', color: '#86efac' }}>
                            Warhammer 40,000
                        </div>
                    </div>
                    <CardTitle className="flex items-center gap-2" style={{ color: '#ECEAE3' }}>
                        <Megaphone className="w-5 h-5" style={{ color: '#ffd23c' }} />
                        Inputs
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#b3aae0' }}>Boyz Count</Label>
                        <Slider value={[orks]} onValueChange={(v) => setOrks(v[0])} min={10} max={1000} step={10} className="py-4" />
                        <div className="text-right text-xs font-mono font-bold" style={{ color: '#86efac' }}>{orks} Boyz</div>
                    </div>
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#b3aae0' }}>Loudness (dB)</Label>
                        <Slider value={[loudness]} onValueChange={(v) => setLoudness(v[0])} min={80} max={160} step={1} className="py-4" />
                        <div className="text-right text-xs font-mono font-bold" style={{ color: '#ffd23c' }}>{loudness} dB</div>
                    </div>
                     <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: '#0c0824', border: '1px solid #4a3f7a' }}>
                        <div className="flex flex-col gap-1">
                            <Label className="font-bold flex items-center gap-2" style={{ color: '#ECEAE3' }}>
                                <Paintbrush className="w-4 h-4" style={{ color: '#ff8a8a' }} />
                                Da Red Paint
                            </Label>
                            <span className="text-[10px]" style={{ color: '#b3aae0' }}>Does it go fasta?</span>
                        </div>
                        <Switch checked={redPaint} onCheckedChange={setRedPaint} />
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <Card className="glass-card border-none p-1 relative overflow-hidden" style={{ backgroundColor: '#1d1442' }}>
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    <CardContent className="relative pt-8 pb-10">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-4">
                            <div className="space-y-4 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: '#0c0824', border: '1px solid #4a3f7a', color: '#b3aae0' }}>
                                    Psychic Output
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase font-serif" style={{ color: '#ECEAE3' }}>
                                        WAAAGH!
                                    </h3>
                                    <p className="font-bold" style={{ fontFamily: 'var(--font-bungee), cursive', color: '#ffd23c' }}>
                                        {formatEnergy(energy)}
                                    </p>
                                </div>
                            </div>

                            <div className="text-center p-8 rounded-3xl w-full md:w-auto md:min-w-[200px]" style={{ backgroundColor: '#0c0824', border: '1px solid #4a3f7a' }}>
                                <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#b3aae0' }}>Speed Boost</div>
                                <div className="text-4xl font-black animate-pulse" style={{ color: '#ff8a8a' }}>
                                    +{speedBoost.toFixed(0)}%
                                </div>
                                <div className="text-xs mt-1" style={{ color: '#b3aae0' }}>Cuz red ones go fasta</div>
                            </div>
                        </div>

                         <div className="mt-10 px-4">
                            <ShareResult
                                title="WAAAGH! Energy"
                                text={`With ${orks} Boyz and some red paint, I generated ${formatEnergy(energy)} of pure WAAAGH! energy. Speed increased by ${speedBoost.toFixed(0)}%.`}
                                className="w-full py-6 text-lg font-black tracking-tight rounded-2xl border-none uppercase !bg-[#ffd23c] hover:!bg-[#ffd23c] !text-[#160e33]"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
                    <CardHeader><CardTitle className="text-lg font-bold" style={{ color: '#ECEAE3' }}>Gestalt Field Visualizer</CardTitle></CardHeader>
                    <CardContent className="h-[150px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical">
                                <YAxis dataKey="name" type="category" width={100} tick={{fill: '#b3aae0', fontSize: 10}} />
                                <Bar dataKey="val" radius={[0, 4, 4, 0]} barSize={20}>
                                    {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
