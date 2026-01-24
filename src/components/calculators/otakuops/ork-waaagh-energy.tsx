"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Megaphone, Paintbrush } from "lucide-react"
import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, YAxis } from 'recharts'

export function OrkWAAAGHEnergyCalculator() {
    const [orks, setOrks] = useState(100)
    const [loudness, setLoudness] = useState(110) // dB
    const [redPaint, setRedPaint] = useState(false)

    const [energy, setEnergy] = useState(0) // Joules
    const [speedBoost, setSpeedBoost] = useState(0) // %
    const [chartData, setChartData] = useState<any[]>([])

    useEffect(() => {
        calculate()
    }, [orks, loudness, redPaint])

    const calculate = () => {
        // WAAAGH logic: (Orks ^ 1.5) * (dB / 10)
        let waaghOutput = Math.pow(orks, 1.5) * (loudness / 10)
        
        let speed = 0
        if (redPaint) {
            speed = 20 + (orks / 100) // The more Orks believe, the faster it goes
            waaghOutput *= 1.2
        }

        setEnergy(waaghOutput)
        setSpeedBoost(speed)

        setChartData([
            { name: 'Base Power', val: waaghOutput * 0.8, fill: '#166534' }, // Green
            { name: 'Belief Bonus', val: waaghOutput * 0.2, fill: '#ef4444' }, // Red
        ])
    }

    const formatEnergy = (val: number) => {
        if (val >= 1000000) return (val / 1000000).toFixed(1) + " MJ"
        if (val >= 1000) return (val / 1000).toFixed(1) + " kJ"
        return val.toFixed(0) + " J"
    }

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <Card className="glass-card lg:col-span-1 h-fit">
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-500 uppercase tracking-widest">
                            Warhammer 40,000
                        </div>
                    </div>
                    <CardTitle className="flex items-center gap-2">
                        <Megaphone className="w-5 h-5 text-primary" />
                        Inputs
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Boyz Count</Label>
                        <Slider value={[orks]} onValueChange={(v) => setOrks(v[0])} min={10} max={1000} step={10} className="py-4" />
                        <div className="text-right text-xs font-mono text-green-500 font-bold">{orks} Boyz</div>
                    </div>
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Loudness (dB)</Label>
                        <Slider value={[loudness]} onValueChange={(v) => setLoudness(v[0])} min={80} max={160} step={1} className="py-4" />
                        <div className="text-right text-xs font-mono text-primary font-bold">{loudness} dB</div>
                    </div>
                     <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex flex-col gap-1">
                            <Label className="font-bold flex items-center gap-2">
                                <Paintbrush className="w-4 h-4 text-red-500" />
                                Da Red Paint
                            </Label>
                            <span className="text-[10px] opacity-60">Does it go fasta?</span>
                        </div>
                        <Switch checked={redPaint} onCheckedChange={setRedPaint} />
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <Card className="glass-card border-none bg-gradient-to-br from-green-900 to-green-950 p-1 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    <CardContent className="relative pt-8 pb-10">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-4">
                            <div className="space-y-4 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50">
                                    Psychic Output
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase font-serif">
                                        WAAAGH!
                                    </h3>
                                    <p className="text-green-400 font-bold font-mono">
                                        {formatEnergy(energy)}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="text-center p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-3xl min-w-[200px]">
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Speed Boost</div>
                                <div className="text-4xl font-black text-red-500 animate-pulse">
                                    +{speedBoost.toFixed(0)}%
                                </div>
                                <div className="text-xs text-slate-400 mt-1">Cuz red ones go fasta</div>
                            </div>
                        </div>

                         <div className="mt-10 px-4">
                            <ShareResult 
                                title="WAAAGH! Energy"
                                text={`With ${orks} Boyz and some red paint, I generated ${formatEnergy(energy)} of pure WAAAGH! energy. Speed increased by ${speedBoost.toFixed(0)}%.`}
                                className="w-full py-6 text-lg font-black tracking-tight rounded-2xl bg-green-600 hover:bg-green-500 text-white border-none shadow-2xl shadow-green-900/20 uppercase"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-white/5">
                    <CardHeader><CardTitle className="text-lg font-bold">Gestalt Field Visualizer</CardTitle></CardHeader>
                    <CardContent className="h-[150px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical">
                                <YAxis dataKey="name" type="category" width={100} tick={{fill: '#94a3b8', fontSize: 10}} />
                                <Bar dataKey="val" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
