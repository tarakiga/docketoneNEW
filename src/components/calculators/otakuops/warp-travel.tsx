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
                { name: "Ship Time", weeks: sTime, fill: "var(--dk-yel-ink)" },
                { name: "Realspace Time", weeks: rTime, fill: "var(--dk-yel-ink)" },
            ]
        }
    }, [distance, stormIntensity])

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <Card className="glass-card lg:col-span-1 h-fit" style={{ backgroundColor: 'var(--dk-surface)', borderColor: 'var(--dk-line)' }}>
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: 'var(--dk-raised)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--dk-line)', color: 'var(--dk-yel-ink)' }}>
                            Warhammer 40,000
                        </div>
                    </div>
                    <CardTitle className="flex items-center gap-2" style={{ color: 'var(--dk-ink)' }}>
                        <Disc className="w-5 h-5" style={{ color: 'var(--dk-yel-ink)' }} />
                        Navigation Auspex
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--dk-ink-soft)' }}>Distance (Light Years)</Label>
                        <Slider value={[distance]} onValueChange={(v) => setDistance(v[0])} min={10} max={5000} step={50} className="py-4" />
                        <div className="text-right text-xs font-mono font-bold" style={{ color: 'var(--dk-yel-ink)' }}>{distance} LY</div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--dk-ink-soft)' }}>Warp Conditions</Label>
                        <Tabs defaultValue="calm" onValueChange={(v) => setStormIntensity(v as "calm" | "rough" | "storm")} className="w-full">
                            <TabsList className="grid w-full grid-cols-3" style={{ backgroundColor: 'var(--dk-sunk)' }}>
                                <TabsTrigger value="calm" className="!text-[var(--dk-ink-soft)] data-[state=active]:!bg-[var(--dk-yel)] data-[state=active]:!text-[var(--dk-on-fill)]" style={{ backgroundColor: 'var(--dk-raised)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--dk-line)' }}>Calm</TabsTrigger>
                                <TabsTrigger value="rough" className="!text-[var(--dk-ink-soft)] data-[state=active]:!bg-[var(--dk-yel)] data-[state=active]:!text-[var(--dk-on-fill)]" style={{ backgroundColor: 'var(--dk-raised)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--dk-line)' }}>Rough</TabsTrigger>
                                <TabsTrigger value="storm" className="!text-[var(--dk-ink-soft)] data-[state=active]:!bg-[var(--dk-yel)] data-[state=active]:!text-[var(--dk-on-fill)]" style={{ backgroundColor: 'var(--dk-raised)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--dk-line)' }}>Warp Storm</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <Card className="glass-card border-none p-1" style={{ backgroundColor: 'var(--dk-surface)' }}>
                    <CardContent className="pt-8 pb-10">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-4">
                            <div className="space-y-4">
                                <div className="text-center md:text-left">
                                    <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--dk-ink-soft)' }}>Time on Ship</div>
                                    <div className="text-5xl font-black" style={{ fontFamily: 'var(--font-fredoka), cursive', color: 'var(--dk-yel-ink)' }}>{shipTime.toFixed(1)} <span className="text-lg" style={{ color: 'var(--dk-ink-soft)' }}>Weeks</span></div>
                                </div>
                                <div className="text-center md:text-left">
                                     <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--dk-ink-soft)' }}>Time in Realspace</div>
                                     <div className="text-5xl font-black" style={{ fontFamily: 'var(--font-fredoka), cursive', color: 'var(--dk-yel-ink)' }}>{realTime.toFixed(1)} <span className="text-lg" style={{ color: 'var(--dk-ink-soft)' }}>Weeks</span></div>
                                     <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mt-4" style={{ backgroundColor: 'var(--dk-raised)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--dk-line)', color: 'var(--dk-yel-ink)' }}>
                                        From the Warhammer 40,000 Lore
                                    </div>
                                </div>
                            </div>

                            <div className="w-full h-[200px] max-w-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} layout="vertical">
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={100} stroke="var(--dk-ink-soft)" tickLine={false} axisLine={false} tick={{fill: 'var(--dk-ink-soft)', fontSize: 10}} />
                                        <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: 'var(--dk-sunk)', border: 'none'}} />
                                        <Bar dataKey="weeks" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                         <div className="mt-10 px-4">
                            <ShareResult
                                title="Warp Transit Log"
                                text={`My ${distance} LY journey through the Warp took ${shipTime.toFixed(1)} weeks for me, but ${realTime.toFixed(1)} weeks for you. The Gellar Field held... mostly.`}
                                className="w-full py-6 text-lg font-black tracking-tight rounded-2xl border-none !bg-[var(--dk-yel)] hover:!bg-[var(--dk-yel)] !text-[var(--dk-on-fill)]"
                            />
                        </div>
                    </CardContent>
                </Card>

                 <Alert style={{ backgroundColor: 'var(--dk-sunk)', borderColor: 'var(--dk-line)' }}>
                    <RotateCcw className="h-4 w-4" style={{ color: 'var(--dk-yel-ink)' }} />
                    <AlertTitle style={{ color: 'var(--dk-ink)' }}>Temporal Warning</AlertTitle>
                    <AlertDescription className="text-xs" style={{ color: 'var(--dk-ink-soft)' }}>
                        Arriving before you departed is theoretically possible but administratively frowned upon by the Ordo Chronos.
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    )
}
