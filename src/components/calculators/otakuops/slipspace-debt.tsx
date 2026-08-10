"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { AlertTriangle, Globe, Rocket, Zap } from "lucide-react"
import { useMemo, useState } from "react"

export function SlipspaceDebtCalculator() {
    const [distance, setDistance] = useState(50) // LY
    const [forerunnerTech, setForerunnerTech] = useState(false)
    const [coleProtocol, setColeProtocol] = useState(true)

    const pseudoRandom = (seed: number) => {
        const x = Math.sin(seed) * 10000
        return x - Math.floor(x)
    }

    const { travelTime, drift } = useMemo(() => {
        const timeoutToDrift = (dist: number, hasColeProtocol: boolean) => {
            const seed = dist * 1.37 + (hasColeProtocol ? 17 : 7)
            return (dist * 1000) * (0.8 + pseudoRandom(seed) * 0.4)
        }

        let speed = 2.5 
        if (forerunnerTech) speed = 50

        let time = distance / speed
        if (coleProtocol) time *= 1.4

        let vectorDrift = timeoutToDrift(distance, coleProtocol)
        if (forerunnerTech) vectorDrift = 0

        return { travelTime: time, drift: vectorDrift }
    }, [distance, forerunnerTech, coleProtocol])

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 h-fit" style={{ backgroundColor: 'var(--dk-surface)', borderColor: 'var(--dk-line)' }}>
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: 'var(--dk-raised)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--dk-line)', color: 'var(--dk-yel-ink)' }}>
                            HALO
                        </div>
                    </div>
                    <CardTitle className="flex items-center gap-2" style={{ color: 'var(--dk-ink)' }}>
                        <Rocket className="w-5 h-5" style={{ color: 'var(--dk-yel-ink)' }} />
                        Jump Parameters
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--dk-ink-soft)' }}>Distance (Light Years)</Label>
                        <Slider value={[distance]} onValueChange={(v) => setDistance(v[0])} min={5} max={500} step={5} className="py-4" />
                        <div className="text-right text-xs font-mono font-bold" style={{ color: 'var(--dk-yel-ink)' }}>{distance} LY</div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--dk-sunk)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--dk-line)' }}>
                        <div className="flex flex-col gap-1">
                            <Label className="font-bold flex items-center gap-2" style={{ color: 'var(--dk-ink)' }}>
                                <Zap className="w-4 h-4" style={{ color: 'var(--dk-yel-ink)' }} />
                                Forerunner Crystal
                            </Label>
                            <span className="text-[10px]" style={{ color: 'var(--dk-ink-soft)' }}>Use alien tech?</span>
                        </div>
                        <Switch checked={forerunnerTech} onCheckedChange={setForerunnerTech} />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--dk-sunk)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--dk-line)' }}>
                        <div className="flex flex-col gap-1">
                            <Label className="font-bold flex items-center gap-2" style={{ color: 'var(--dk-ink)' }}>
                                <AlertTriangle className="w-4 h-4" style={{ color: 'var(--dk-yel-ink)' }} />
                                Cole Protocol
                            </Label>
                            <span className="text-[10px]" style={{ color: 'var(--dk-ink-soft)' }}>Randomized exit vector</span>
                        </div>
                        <Switch checked={coleProtocol} onCheckedChange={setColeProtocol} />
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <Card className="relative overflow-hidden border-none p-1" style={{ backgroundColor: 'var(--dk-sunk)' }}>
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                    <CardContent className="relative pt-12 pb-16 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6" style={{ backgroundColor: 'var(--dk-raised)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--dk-line)', color: 'var(--dk-yel-ink)' }}>
                            Estimated Duration
                        </div>

                        <div className="text-6xl md:text-8xl font-black tracking-tighter" style={{ fontFamily: 'var(--font-fredoka), cursive', color: 'var(--dk-yel-ink)' }}>
                            {travelTime.toFixed(1)} <span className="text-3xl" style={{ color: 'var(--dk-ink-soft)' }}>Days</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mt-4" style={{ backgroundColor: 'var(--dk-raised)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--dk-line)', color: 'var(--dk-yel-ink)' }}>
                            From the HALO Lore
                        </div>

                         <div className="mt-8 flex justify-center gap-8">
                             <div>
                                 <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--dk-ink-soft)' }}>Exit Drift</div>
                                 <div className="text-xl font-bold" style={{ color: 'var(--dk-neg-ink)' }}>{drift > 0 ? `± ${(drift/1000).toFixed(1)} km` : "Pinpoint"}</div>
                             </div>
                             <div>
                                 <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--dk-ink-soft)' }}>Shaw-Fujikawa Rating</div>
                                 <div className="text-xl font-bold" style={{ color: 'var(--dk-pos-ink)' }}>{forerunnerTech ? "Class-12" : "Class-2"}</div>
                             </div>
                         </div>

                         <div className="mt-12 px-4 max-w-lg mx-auto">
                            <ShareResult
                                title="Slipspace Trajectory"
                                text={`Plotting a ${distance} LY jump. ETA: ${travelTime.toFixed(1)} days. Exit vector drift: ${drift > 0 ? (drift/1000).toFixed(1) + ' km' : 'Negligible'}.`}
                                className="w-full py-6 text-lg font-black tracking-tight rounded-2xl border-none bg-[var(--dk-yel)] hover:bg-[var(--dk-yel)]/90 text-[var(--dk-on-fill)]"
                            />
                        </div>
                    </CardContent>
                </Card>

                 <Alert style={{ backgroundColor: 'var(--dk-surface)', borderColor: 'var(--dk-line)' }}>
                    <Globe className="h-4 w-4" style={{ color: 'var(--dk-yel-ink)' }} />
                    <AlertTitle style={{ color: 'var(--dk-ink)' }}>UNSC Warning</AlertTitle>
                    <AlertDescription className="text-xs" style={{ color: 'var(--dk-ink-soft)' }}>
                        &quot;Slipspace isn&apos;t empty. It&apos;s just... mostly empty.&quot; - Ensure cryo-pods are active for long durations.
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    )
}
