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
            <Card className="lg:col-span-1 h-fit" style={{ backgroundColor: 'var(--dk-surface)', borderColor: 'var(--dk-line)', color: 'var(--dk-ink)' }}>
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: 'var(--dk-raised)', borderColor: 'var(--dk-line)', borderWidth: 1, color: 'var(--dk-yel-ink)' }}>
                            Warhammer 40,000
                        </div>
                    </div>
                    <CardTitle className="flex items-center gap-2" style={{ color: 'var(--dk-ink)' }}>
                        <Crown className="w-5 h-5" style={{ color: 'var(--dk-yel-ink)' }} />
                        Imperial Calendar
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--dk-ink-soft)' }}>Duration (Years)</Label>
                        <Slider value={[years]} onValueChange={(v) => setYears(v[0])} min={1} max={1000} step={1} className="py-4" />
                        <div className="text-right text-xs font-mono font-bold" style={{ color: 'var(--dk-yel-ink)' }}>{years} Years</div>
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <Card className="relative overflow-hidden border-none p-1" style={{ backgroundColor: 'var(--dk-sunk)' }}>
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
                    <CardContent className="relative pt-12 pb-16 px-4 sm:px-6 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6" style={{ backgroundColor: 'var(--dk-raised)', borderColor: 'var(--dk-line)', borderWidth: 1, color: 'var(--dk-yel-ink)' }}>
                            Required Sacrifice
                        </div>

                        <div className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter drop-shadow-2xl break-words" style={{ fontFamily: 'var(--font-fredoka), cursive', color: 'var(--dk-yel-ink)' }}>
                            {formattedPsykers}
                        </div>

                        <div className="text-xl font-serif italic mt-4" style={{ color: 'var(--dk-ink-soft)' }}>
                            Psykers consumed
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mt-4" style={{ backgroundColor: 'var(--dk-raised)', borderColor: 'var(--dk-line)', borderWidth: 1, color: 'var(--dk-yel-ink)' }}>
                            From the Warhammer 40,000 Lore
                        </div>

                         <div className="mt-12 px-4 max-w-lg mx-auto">
                            <ShareResult
                                title="The Golden Tithe"
                                text={`To sustain the Astronomican for ${years} more years, we must sacrifice ${formattedPsykers} Psykers. A small price for salvation.`}
                                className="w-full py-6 text-lg font-black tracking-tight rounded-2xl border-none shadow-2xl !bg-[var(--dk-yel)] hover:!bg-[var(--dk-yel)] !text-[var(--dk-on-fill)] !border-none"
                            />
                        </div>
                    </CardContent>
                </Card>

                 <div className="grid md:grid-cols-2 gap-6">
                    <Card style={{ backgroundColor: 'var(--dk-surface)', borderColor: 'var(--dk-line)', color: 'var(--dk-ink)' }}>
                        <CardHeader><CardTitle className="text-lg font-bold" style={{ color: 'var(--dk-ink)' }}>Black Ships Status</CardTitle></CardHeader>
                        <CardContent className="flex items-center gap-4">
                            <Ghost className="w-8 h-8" style={{ color: 'var(--dk-yel-ink)' }} />
                            <div>
                                <div className="text-xs uppercase" style={{ color: 'var(--dk-ink-soft)' }}>Daily Requirement</div>
                                <div className="font-bold" style={{ color: 'var(--dk-ink)' }}>1,000 Souls</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card style={{ backgroundColor: 'var(--dk-surface)', borderColor: 'var(--dk-line)', color: 'var(--dk-ink)' }}>
                        <CardHeader><CardTitle className="text-lg font-bold" style={{ color: 'var(--dk-ink)' }}>Astronomican</CardTitle></CardHeader>
                        <CardContent className="flex items-center gap-4">
                             <Info className="w-8 h-8" style={{ color: 'var(--dk-yel-ink)' }} />
                            <div>
                                <div className="text-xs uppercase" style={{ color: 'var(--dk-ink-soft)' }}>Beacon Range</div>
                                <div className="font-bold" style={{ color: 'var(--dk-ink)' }}>70,000 Light Years</div>
                            </div>
                        </CardContent>
                    </Card>
                 </div>
            </div>
        </div>
    )
}
