"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { AlertTriangle, Globe, Rocket, Zap } from "lucide-react"
import { useEffect, useState } from "react"

export function SlipspaceDebtCalculator() {
    const [distance, setDistance] = useState(50) // LY
    const [forerunnerTech, setForerunnerTech] = useState(false)
    const [coleProtocol, setColeProtocol] = useState(true)

    const [travelTime, setTravelTime] = useState(0) // Days
    const [drift, setDrift] = useState(0) // km

    useEffect(() => {
        calculate()
    }, [distance, forerunnerTech, coleProtocol])

    const calculate = () => {
        // Human ships: ~2-3 LY per day
        // Covenant/Forerunner: Much faster
        let speed = 2.5 
        if (forerunnerTech) speed = 50 // Massive jump

        let time = distance / speed
        
        // Cole Protocol adds random jumps, increasing time
        if (coleProtocol) time *= 1.4

        // Drift (Accuracy)
        let vectorDrift = timeoutToDrift(distance)
        if (forerunnerTech) vectorDrift = 0 // Pinpoint

        setTravelTime(time)
        setDrift(vectorDrift)
    }

    const timeoutToDrift = (dist: number) => {
        // More distance = more drift for human drives
        return (dist * 1000) * (0.8 + Math.random() * 0.4)
    }

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <Card className="glass-card lg:col-span-1 h-fit">
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                            HALO
                        </div>
                    </div>
                    <CardTitle className="flex items-center gap-2">
                        <Rocket className="w-5 h-5 text-blue-400" />
                        Jump Parameters
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Distance (Light Years)</Label>
                        <Slider value={[distance]} onValueChange={(v) => setDistance(v[0])} min={5} max={500} step={5} className="py-4" />
                        <div className="text-right text-xs font-mono text-blue-400 font-bold">{distance} LY</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex flex-col gap-1">
                            <Label className="font-bold flex items-center gap-2">
                                <Zap className="w-4 h-4 text-yellow-400" />
                                Forerunner Crystal
                            </Label>
                            <span className="text-[10px] opacity-60">Use alien tech?</span>
                        </div>
                        <Switch checked={forerunnerTech} onCheckedChange={setForerunnerTech} />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex flex-col gap-1">
                            <Label className="font-bold flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-orange-400" />
                                Cole Protocol
                            </Label>
                            <span className="text-[10px] opacity-60">Randomized exit vector</span>
                        </div>
                        <Switch checked={coleProtocol} onCheckedChange={setColeProtocol} />
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <Card className="relative overflow-hidden glass-card border-none bg-gradient-to-br from-blue-900 to-slate-950 p-1">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                    <CardContent className="relative pt-12 pb-16 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest text-blue-500/80 mb-6">
                            Estimated Duration
                        </div>
                        
                        <div className="text-6xl md:text-8xl font-black tracking-tighter text-white drop-shadow-2xl">
                            {travelTime.toFixed(1)} <span className="text-3xl text-slate-500">Days</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-wider mt-4">
                            From the HALO Lore
                        </div>

                         <div className="mt-8 flex justify-center gap-8">
                             <div>
                                 <div className="text-[10px] uppercase opacity-60 tracking-widest mb-1">Exit Drift</div>
                                 <div className="text-xl font-bold text-red-400">{drift > 0 ? `± ${(drift/1000).toFixed(1)} km` : "Pinpoint"}</div>
                             </div>
                             <div>
                                 <div className="text-[10px] uppercase opacity-60 tracking-widest mb-1">Shaw-Fujikawa Rating</div>
                                 <div className="text-xl font-bold text-green-400">{forerunnerTech ? "Class-12" : "Class-2"}</div>
                             </div>
                         </div>

                         <div className="mt-12 px-4 max-w-lg mx-auto">
                            <ShareResult 
                                title="Slipspace Trajectory"
                                text={`Plotting a ${distance} LY jump. ETA: ${travelTime.toFixed(1)} days. Exit vector drift: ${drift > 0 ? (drift/1000).toFixed(1) + ' km' : 'Negligible'}.`}
                                className="w-full py-6 text-lg font-black tracking-tight rounded-2xl bg-blue-600 hover:bg-blue-500 text-white border-none shadow-2xl shadow-blue-900/20"
                            />
                        </div>
                    </CardContent>
                </Card>

                 <Alert className="bg-white/5 border-white/10">
                    <Globe className="h-4 w-4 text-blue-400" />
                    <AlertTitle>UNSC Warning</AlertTitle>
                    <AlertDescription className="text-xs opacity-70">
                        "Slipspace isn't empty. It's just... mostly empty." - Ensure cryo-pods are active for long durations.
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    )
}
