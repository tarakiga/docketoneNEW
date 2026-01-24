"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Crown, Ghost, Info } from "lucide-react"
import { useEffect, useState } from "react"

export function GoldenThroneTitheCalculator() {
    const [years, setYears] = useState(100)
    
    // Consumes 1000/day
    const [psykers, setPsykers] = useState(0)

    useEffect(() => {
        // 1000 per day * 365
        setPsykers(years * 365 * 1000)
    }, [years])

    const formattedPsykers = new Intl.NumberFormat('en-US').format(psykers)

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <Card className="glass-card lg:col-span-1 h-fit">
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-[10px] font-bold text-yellow-500 uppercase tracking-widest">
                            Warhammer 40,000
                        </div>
                    </div>
                    <CardTitle className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-yellow-500" />
                        Imperial Calendar
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Duration (Years)</Label>
                        <Slider value={[years]} onValueChange={(v) => setYears(v[0])} min={1} max={1000} step={1} className="py-4" />
                        <div className="text-right text-xs font-mono text-yellow-500 font-bold">{years} Years</div>
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <Card className="relative overflow-hidden glass-card border-none bg-gradient-to-br from-slate-900 to-yellow-950 p-1">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
                    <CardContent className="relative pt-12 pb-16 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-[10px] font-black uppercase tracking-widest text-yellow-500/80 mb-6">
                            Required Sacrifice
                        </div>
                        
                        <div className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-700 drop-shadow-2xl">
                            {formattedPsykers}
                        </div>
                        
                        <div className="text-xl text-yellow-500/60 font-serif italic mt-4">
                            Psykers consumed
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-[10px] font-bold text-yellow-500 uppercase tracking-wider mt-4">
                            From the Warhammer 40,000 Lore
                        </div>

                         <div className="mt-12 px-4 max-w-lg mx-auto">
                            <ShareResult 
                                title="The Golden Tithe"
                                text={`To sustain the Astronomican for ${years} more years, we must sacrifice ${formattedPsykers} Psykers. A small price for salvation.`}
                                className="w-full py-6 text-lg font-black tracking-tight rounded-2xl bg-yellow-600 hover:bg-yellow-500 text-black border-none shadow-2xl shadow-yellow-900/20"
                            />
                        </div>
                    </CardContent>
                </Card>

                 <div className="grid md:grid-cols-2 gap-6">
                    <Card className="glass-card border-white/5">
                        <CardHeader><CardTitle className="text-lg font-bold">Black Ships Status</CardTitle></CardHeader>
                        <CardContent className="flex items-center gap-4">
                            <Ghost className="w-8 h-8 opacity-50" />
                            <div>
                                <div className="text-xs uppercase opacity-60">Daily Requirement</div>
                                <div className="font-bold">1,000 Souls</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="glass-card border-white/5">
                        <CardHeader><CardTitle className="text-lg font-bold">Astronomican</CardTitle></CardHeader>
                        <CardContent className="flex items-center gap-4">
                             <Info className="w-8 h-8 opacity-50" />
                            <div>
                                <div className="text-xs uppercase opacity-60">Beacon Range</div>
                                <div className="font-bold">70,000 Light Years</div>
                            </div>
                        </CardContent>
                    </Card>
                 </div>
            </div>
        </div>
    )
}
