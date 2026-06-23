"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Disc, RotateCcw } from "lucide-react"
import { useMemo, useState } from "react"
import { Bar, BarChart, Tooltip as RechartsTooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts'

export function WarpTravelCalculator() {
    const [distance, setDistance] = useState(100) // Light Years
    const [stormIntensity, setStormIntensity] = useState<"calm" | "rough" | "storm">("calm")

    const stableJitter = (distance: number, intensity: "calm" | "rough" | "storm") => {
        const base = distance * (intensity === "calm" ? 1 : intensity === "rough" ? 2 : 3)
        const x = Math.sin(base) * 10000
        const frac = x - Math.floor(x)
        return 0.8 + frac * 0.4
    }

    const { shipTime, realTime, chartData } = useMemo(() => {
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
        const rTime = sTime * dilationFactor * stableJitter(distance, stormIntensity)

        return {
            shipTime: sTime,
            realTime: rTime,
            chartData: [
                { name: "Ship Time", weeks: sTime, fill: "#ffd23c" },
                { name: "Realspace Time", weeks: rTime, fill: "#ffd23c" },
            ]
        }
    }, [distance, stormIntensity])

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <Card className="glass-card lg:col-span-1 h-fit" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: '#241a52', borderWidth: '1px', borderStyle: 'solid', borderColor: '#4a3f7a', color: '#ffd23c' }}>
                            Warhammer 40,000
                        </div>
                    </div>
                    <CardTitle className="flex items-center gap-2" style={{ color: '#ECEAE3' }}>
                        <Disc className="w-5 h-5" style={{ color: '#ffd23c' }} />
                        Navigation Auspex
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#b3aae0' }}>Distance (Light Years)</Label>
                        <Slider value={[distance]} onValueChange={(v) => setDistance(v[0])} min={10} max={5000} step={50} className="py-4" />
                        <div className="text-right text-xs font-mono font-bold" style={{ color: '#ffd23c' }}>{distance} LY</div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#b3aae0' }}>Warp Conditions</Label>
                        <Tabs defaultValue="calm" onValueChange={(v) => setStormIntensity(v as "calm" | "rough" | "storm")} className="w-full">
                            <TabsList className="grid w-full grid-cols-3" style={{ backgroundColor: '#0c0824' }}>
                                <TabsTrigger value="calm" className="!text-[#b3aae0] data-[state=active]:!bg-[#ffd23c] data-[state=active]:!text-[#160e33]" style={{ backgroundColor: '#241a52', borderWidth: '1px', borderStyle: 'solid', borderColor: '#4a3f7a' }}>Calm</TabsTrigger>
                                <TabsTrigger value="rough" className="!text-[#b3aae0] data-[state=active]:!bg-[#ffd23c] data-[state=active]:!text-[#160e33]" style={{ backgroundColor: '#241a52', borderWidth: '1px', borderStyle: 'solid', borderColor: '#4a3f7a' }}>Rough</TabsTrigger>
                                <TabsTrigger value="storm" className="!text-[#b3aae0] data-[state=active]:!bg-[#ffd23c] data-[state=active]:!text-[#160e33]" style={{ backgroundColor: '#241a52', borderWidth: '1px', borderStyle: 'solid', borderColor: '#4a3f7a' }}>Warp Storm</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <Card className="glass-card border-none p-1" style={{ backgroundColor: '#1d1442' }}>
                    <CardContent className="pt-8 pb-10">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-4">
                            <div className="space-y-4">
                                <div className="text-center md:text-left">
                                    <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#b3aae0' }}>Time on Ship</div>
                                    <div className="text-5xl font-black" style={{ fontFamily: 'var(--font-bungee), cursive', color: '#ffd23c' }}>{shipTime.toFixed(1)} <span className="text-lg" style={{ color: '#b3aae0' }}>Weeks</span></div>
                                </div>
                                <div className="text-center md:text-left">
                                     <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#b3aae0' }}>Time in Realspace</div>
                                     <div className="text-5xl font-black" style={{ fontFamily: 'var(--font-bungee), cursive', color: '#ffd23c' }}>{realTime.toFixed(1)} <span className="text-lg" style={{ color: '#b3aae0' }}>Weeks</span></div>
                                     <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mt-4" style={{ backgroundColor: '#241a52', borderWidth: '1px', borderStyle: 'solid', borderColor: '#4a3f7a', color: '#ffd23c' }}>
                                        From the Warhammer 40,000 Lore
                                    </div>
                                </div>
                            </div>

                            <div className="w-full h-[200px] max-w-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} layout="vertical">
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={100} stroke="#4a3f7a" tickLine={false} axisLine={false} tick={{fill: '#b3aae0', fontSize: 10}} />
                                        <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#0c0824', border: 'none'}} />
                                        <Bar dataKey="weeks" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                         <div className="mt-10 px-4">
                            <ShareResult
                                title="Warp Transit Log"
                                text={`My ${distance} LY journey through the Warp took ${shipTime.toFixed(1)} weeks for me, but ${realTime.toFixed(1)} weeks for you. The Gellar Field held... mostly.`}
                                className="w-full py-6 text-lg font-black tracking-tight rounded-2xl border-none !bg-[#ffd23c] hover:!bg-[#ffd23c] !text-[#160e33]"
                            />
                        </div>
                    </CardContent>
                </Card>

                 <Alert style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a' }}>
                    <RotateCcw className="h-4 w-4" style={{ color: '#ffd23c' }} />
                    <AlertTitle style={{ color: '#ECEAE3' }}>Temporal Warning</AlertTitle>
                    <AlertDescription className="text-xs" style={{ color: '#b3aae0' }}>
                        Arriving before you departed is theoretically possible but administratively frowned upon by the Ordo Chronos.
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    )
}
