"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Disc, RotateCcw } from "lucide-react"
import { useEffect, useState } from "react"
import { Bar, BarChart, Tooltip as RechartsTooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts'

export function WarpTravelCalculator() {
    const [distance, setDistance] = useState(100) // Light Years
    const [stormIntensity, setStormIntensity] = useState<"calm" | "rough" | "storm">("calm")
    
    // Results
    const [shipTime, setShipTime] = useState(0) // Weeks
    const [realTime, setRealTime] = useState(0) // Weeks
    const [chartData, setChartData] = useState<any[]>([])

    useEffect(() => {
        calculate()
    }, [distance, stormIntensity])

    const calculate = () => {
        // Base speed: 100 LY per week (generous warp drive)
        let speed = 100 
        let dilationFactor = 1.0

        if (stormIntensity === "rough") {
            speed = 50
            dilationFactor = 1.5 // 1 week on ship = 1.5 weeks realspace
        } else if (stormIntensity === "storm") {
            speed = 10 // Crawling
            dilationFactor = 5.0 // Time flows strangely. Or backwards.
        }

        const sTime = distance / speed
        // Random Warp fluctuation: +/- 20%
        const rTime = sTime * dilationFactor * (0.8 + Math.random() * 0.4)

        setShipTime(sTime)
        setRealTime(rTime)

        setChartData([
            { name: 'Ship Time', weeks: sTime, fill: '#3b82f6' },
            { name: 'Realspace Time', weeks: rTime, fill: '#a855f7' },
        ])
    }

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <Card className="glass-card lg:col-span-1 h-fit">
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                            Warhammer 40,000
                        </div>
                    </div>
                    <CardTitle className="flex items-center gap-2">
                        <Disc className="w-5 h-5 text-primary" />
                        Navigation Auspex
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Distance (Light Years)</Label>
                        <Slider value={[distance]} onValueChange={(v) => setDistance(v[0])} min={10} max={5000} step={50} className="py-4" />
                        <div className="text-right text-xs font-mono text-primary font-bold">{distance} LY</div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Warp Conditions</Label>
                        <Tabs defaultValue="calm" onValueChange={(v) => setStormIntensity(v as any)} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 bg-white/5">
                                <TabsTrigger value="calm">Calm</TabsTrigger>
                                <TabsTrigger value="rough">Rough</TabsTrigger>
                                <TabsTrigger value="storm">Warp Storm</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <Card className="glass-card border-none bg-gradient-to-br from-indigo-900 to-slate-950 p-1">
                    <CardContent className="pt-8 pb-10">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-4">
                            <div className="space-y-4">
                                <div className="text-center md:text-left">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Time on Ship</div>
                                    <div className="text-5xl font-black text-blue-400">{shipTime.toFixed(1)} <span className="text-lg text-slate-500">Weeks</span></div>
                                </div>
                                <div className="text-center md:text-left">
                                     <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Time in Realspace</div>
                                     <div className="text-5xl font-black text-purple-400">{realTime.toFixed(1)} <span className="text-lg text-slate-500">Weeks</span></div>
                                     <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-wider mt-4">
                                        From the Warhammer 40,000 Lore
                                    </div>
                                </div>
                            </div>
                            
                            <div className="w-full h-[200px] max-w-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} layout="vertical">
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={100} tick={{fill: '#94a3b8', fontSize: 10}} />
                                        <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#1e293b', border: 'none'}} />
                                        <Bar dataKey="weeks" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                         <div className="mt-10 px-4">
                            <ShareResult 
                                title="Warp Transit Log"
                                text={`My ${distance} LY journey through the Warp took ${shipTime.toFixed(1)} weeks for me, but ${realTime.toFixed(1)} weeks for you. The Gellar Field held... mostly.`}
                                className="w-full py-6 text-lg font-black tracking-tight rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white border-none shadow-2xl shadow-indigo-900/20"
                            />
                        </div>
                    </CardContent>
                </Card>

                 <Alert className="bg-white/5 border-white/10">
                    <RotateCcw className="h-4 w-4 text-purple-400" />
                    <AlertTitle>Temporal Warning</AlertTitle>
                    <AlertDescription className="text-xs opacity-70">
                        Arriving before you departed is theoretically possible but administratively frowned upon by the Ordo Chronos.
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    )
}
