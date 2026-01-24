"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { AlertCircle, Bug } from "lucide-react"
import { useEffect, useState } from "react"

export function FloodInfectionCalculator() {
    const [biomass, setBiomass] = useState(7) // Billion
    const [defense, setDefense] = useState(5) // 1-10

    const [timeToGlassing, setTimeToGlassing] = useState(0) // Hours
    const [status, setStatus] = useState("Containment Possible")

    useEffect(() => {
        calculate()
    }, [biomass, defense])

    const calculate = () => {
        // More biomass = faster spread. Higher defense = slower.
        // Base spread: 1 billion infected per hour?
        const spreadRate = (biomass / 10) * (11 - defense)
        
        const hoursLeft = 24 / spreadRate 
        
        let currentStatus = "Combat Operations Active"
        if (hoursLeft < 5) currentStatus = "General Quarters - Evacuation Impossible"
        if (hoursLeft < 1) currentStatus = "VAPORIZE PLANET IMMEDIATELY"

        setTimeToGlassing(hoursLeft)
        setStatus(currentStatus)
    }

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <Card className="glass-card lg:col-span-1 h-fit">
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-[10px] font-bold text-yellow-500 uppercase tracking-widest">
                            HALO
                        </div>
                    </div>
                    <CardTitle className="flex items-center gap-2">
                        <Bug className="w-5 h-5 text-green-400" />
                        Infection Parameters
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Local Biomass (Billions)</Label>
                        <Slider value={[biomass]} onValueChange={(v) => setBiomass(v[0])} min={1} max={50} step={1} className="py-4" />
                    </div>
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Local Defense Rating</Label>
                        <Slider value={[defense]} onValueChange={(v) => setDefense(v[0])} min={1} max={10} step={1} className="py-4" />
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <Card className="glass-card border-none bg-gradient-to-br from-yellow-900 to-slate-950 p-1">
                     <CardContent className="pt-12 pb-16 text-center">
                        <div className="text-[10px] uppercase opacity-60 tracking-widest mb-2">Time Until Glassing Required</div>
                        <div className="text-6xl font-black text-yellow-500 mb-2">{timeToGlassing.toFixed(2)} Hrs</div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-[10px] font-bold text-yellow-500 uppercase tracking-wider mb-4">
                            From the HALO Lore
                        </div>
                        <div className="inline-block px-4 py-2 bg-red-500/20 text-red-500 font-bold rounded-lg border border-red-500/30">
                            {status}
                        </div>

                         <div className="mt-10 px-4">
                            <ShareResult 
                                title="Flood Outbreak Protocol"
                                text={`The parasite is consuming us. We have ${timeToGlassing.toFixed(1)} hours before planetary sterilization is the only option. Status: ${status}.`}
                                className="w-full py-6 text-lg font-black tracking-tight rounded-2xl bg-yellow-600 hover:bg-yellow-500 text-black border-none shadow-2xl shadow-yellow-900/20"
                            />
                        </div>
                    </CardContent>
                </Card>
                
                <Alert className="bg-white/5 border-white/10">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <AlertTitle>Gravemind Detect</AlertTitle>
                    <AlertDescription className="text-xs opacity-70">
                        "I am a monument to all your sins." - One spore can destroy an entire species.
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    )
}
