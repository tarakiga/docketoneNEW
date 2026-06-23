"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { AlertCircle, Bug } from "lucide-react"
import { useMemo, useState } from "react"

export function FloodInfectionCalculator() {
    const [biomass, setBiomass] = useState(7) // Billion
    const [defense, setDefense] = useState(5) // 1-10

    const { timeToGlassing, status } = useMemo(() => {
        const spreadRate = (biomass / 10) * (11 - defense)
        const hoursLeft = 24 / spreadRate
        let currentStatus = "Combat Operations Active"
        if (hoursLeft < 5) currentStatus = "General Quarters - Evacuation Impossible"
        if (hoursLeft < 1) currentStatus = "VAPORIZE PLANET IMMEDIATELY"
        return { timeToGlassing: hoursLeft, status: currentStatus }
    }, [biomass, defense])

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 h-fit" style={{ backgroundColor: "#1d1442", borderColor: "#4a3f7a", color: "#ECEAE3" }}>
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: "#241a52", borderColor: "#ffd23c", borderWidth: 1, color: "#ffd23c" }}>
                            HALO
                        </div>
                    </div>
                    <CardTitle className="flex items-center gap-2" style={{ color: "#ECEAE3" }}>
                        <Bug className="w-5 h-5" style={{ color: "#ffd23c" }} />
                        Infection Parameters
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: "#b3aae0" }}>Local Biomass (Billions)</Label>
                        <Slider value={[biomass]} onValueChange={(v) => setBiomass(v[0])} min={1} max={50} step={1} className="py-4" />
                    </div>
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: "#b3aae0" }}>Local Defense Rating</Label>
                        <Slider value={[defense]} onValueChange={(v) => setDefense(v[0])} min={1} max={10} step={1} className="py-4" />
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <Card className="border-none p-1" style={{ backgroundColor: "#0c0824" }}>
                     <CardContent className="pt-12 pb-16 text-center">
                        <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "#b3aae0" }}>Time Until Glassing Required</div>
                        <div className="text-6xl font-black mb-2" style={{ fontFamily: "var(--font-bungee), cursive", color: "#ffd23c" }}>{timeToGlassing.toFixed(2)} Hrs</div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-4" style={{ backgroundColor: "#241a52", borderColor: "#4a3f7a", borderWidth: 1, color: "#ffd23c" }}>
                            From the HALO Lore
                        </div>
                        <div className="inline-block px-4 py-2 font-bold rounded-lg" style={{ backgroundColor: "#241a52", borderColor: "#ff8a8a", borderWidth: 1, color: "#ff8a8a" }}>
                            {status}
                        </div>

                         <div className="mt-10 px-4">
                            <ShareResult
                                title="Flood Outbreak Protocol"
                                text={`The parasite is consuming us. We have ${timeToGlassing.toFixed(1)} hours before planetary sterilization is the only option. Status: ${status}.`}
                                className="w-full py-6 text-lg font-black tracking-tight rounded-2xl border-none !bg-[#ffd23c] hover:!bg-[#ffd23c] !text-[#160e33] !border-none"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Alert style={{ backgroundColor: "#1d1442", borderColor: "#4a3f7a", color: "#ECEAE3" }}>
                    <AlertCircle className="h-4 w-4" style={{ color: "#ff8a8a" }} />
                    <AlertTitle style={{ color: "#ECEAE3" }}>Gravemind Detect</AlertTitle>
                    <AlertDescription className="text-xs" style={{ color: "#b3aae0" }}>
                        {`“I am a monument to all your sins.” - One spore can destroy an entire species.`}
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    )
}
