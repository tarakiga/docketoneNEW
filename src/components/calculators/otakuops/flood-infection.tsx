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
            <Card className="lg:col-span-1 h-fit" style={{ backgroundColor: "var(--dk-surface)", borderColor: "var(--dk-line)", color: "var(--dk-ink)" }}>
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: "var(--dk-raised)", borderColor: "var(--dk-yel-ink)", borderWidth: 1, color: "var(--dk-yel-ink)" }}>
                            HALO
                        </div>
                    </div>
                    <CardTitle className="flex items-center gap-2" style={{ color: "var(--dk-ink)" }}>
                        <Bug className="w-5 h-5" style={{ color: "var(--dk-yel-ink)" }} />
                        Infection Parameters
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--dk-ink-soft)" }}>Local Biomass (Billions)</Label>
                        <Slider value={[biomass]} onValueChange={(v) => setBiomass(v[0])} min={1} max={50} step={1} className="py-4" />
                    </div>
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--dk-ink-soft)" }}>Local Defense Rating</Label>
                        <Slider value={[defense]} onValueChange={(v) => setDefense(v[0])} min={1} max={10} step={1} className="py-4" />
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <Card className="border-none p-1" style={{ backgroundColor: "var(--dk-sunk)" }}>
                     <CardContent className="pt-12 pb-16 text-center">
                        <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "var(--dk-ink-soft)" }}>Time Until Glassing Required</div>
                        <div className="text-6xl font-black mb-2" style={{ fontFamily: "var(--font-fredoka), cursive", color: "var(--dk-yel-ink)" }}>{timeToGlassing.toFixed(2)} Hrs</div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-4" style={{ backgroundColor: "var(--dk-raised)", borderColor: "var(--dk-line)", borderWidth: 1, color: "var(--dk-yel-ink)" }}>
                            From the HALO Lore
                        </div>
                        <div className="inline-block px-4 py-2 font-bold rounded-lg" style={{ backgroundColor: "var(--dk-raised)", borderColor: "var(--dk-neg-ink)", borderWidth: 1, color: "var(--dk-neg-ink)" }}>
                            {status}
                        </div>

                         <div className="mt-10 px-4">
                            <ShareResult
                                title="Flood Outbreak Protocol"
                                text={`The parasite is consuming us. We have ${timeToGlassing.toFixed(1)} hours before planetary sterilization is the only option. Status: ${status}.`}
                                className="w-full py-6 text-lg font-black tracking-tight rounded-2xl border-none !bg-[var(--dk-yel)] hover:!bg-[var(--dk-yel)] !text-[var(--dk-on-fill)] !border-none"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Alert style={{ backgroundColor: "var(--dk-surface)", borderColor: "var(--dk-line)", color: "var(--dk-ink)" }}>
                    <AlertCircle className="h-4 w-4" style={{ color: "var(--dk-neg-ink)" }} />
                    <AlertTitle style={{ color: "var(--dk-ink)" }}>Gravemind Detect</AlertTitle>
                    <AlertDescription className="text-xs" style={{ color: "var(--dk-ink-soft)" }}>
                        {`“I am a monument to all your sins.” - One spore can destroy an entire species.`}
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    )
}
