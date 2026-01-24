"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Crosshair, Target } from "lucide-react"
import { useEffect, useState } from "react"

export function MACRoundImpactCalculator() {
    const [mass, setMass] = useState(600) // Tons
    const [velocity, setVelocity] = useState(40) // % of light speed
    
    const [energy, setEnergy] = useState(0) // Gigatons
    const [shipsGutted, setShipsGutted] = useState(0)

    useEffect(() => {
        calculate()
    }, [mass, velocity])

    const calculate = () => {
        // KE = 0.5 * m * v^2
        // Mass in kg = mass * 1000
        // Velocity in m/s = velocity/100 * 299792458
        
        const m = mass * 1000
        const v = (velocity / 100) * 299792458
        
        const keJoules = 0.5 * m * Math.pow(v, 2)
        
        // 1 Gigaton TNT = 4.184 x 10^18 Joules
        const gigatons = keJoules / 4.184e18
        
        const gutted = Math.floor(gigatons / 10) // Arbitrary "ship HP"

        setEnergy(gigatons)
        setShipsGutted(gutted)
    }

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <Card className="glass-card lg:col-span-1 h-fit">
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                            HALO
                        </div>
                    </div>
                    <CardTitle className="flex items-center gap-2">
                        <Crosshair className="w-5 h-5 text-primary" />
                        Firing Solution
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Projectile Mass (Tons)</Label>
                        <Slider value={[mass]} onValueChange={(v) => setMass(v[0])} min={100} max={3000} step={100} className="py-4" />
                        <div className="text-right text-xs font-mono text-primary font-bold">{mass} Tons</div>
                    </div>
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Velocity (% Speed of Light)</Label>
                        <Slider value={[velocity]} onValueChange={(v) => setVelocity(v[0])} min={1} max={50} step={1} className="py-4" />
                        <div className="text-right text-xs font-mono text-primary font-bold">{velocity}% c</div>
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <Card className="glass-card border-none bg-gradient-to-br from-indigo-900 to-slate-950 p-1">
                     <CardContent className="pt-12 pb-16 text-center">
                        <div className="text-[10px] uppercase opacity-60 tracking-widest mb-2">Impact Energy</div>
                        <div className="text-5xl md:text-7xl font-black text-white mb-2">{energy.toFixed(2)} <span className="text-2xl text-slate-500">Gigatons</span></div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-8">
                            From the HALO Lore
                        </div>

                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 max-w-sm mx-auto">
                            <div className="flex items-center justify-center gap-4 text-red-500 mb-2">
                                <Target className="w-6 h-6" />
                                <span className="font-black text-2xl">{shipsGutted} Targets</span>
                            </div>
                            <div className="text-xs opacity-60">Covenant Capital Ships Penetrated</div>
                        </div>

                         <div className="mt-10 px-4">
                            <ShareResult 
                                title="MAC Firing Report"
                                text={`I just fired a ${mass}-ton slug at ${velocity}% light speed. It released ${energy.toFixed(2)} Gigatons of energy, gutting ${shipsGutted} Covenant ships.`}
                                className="w-full py-6 text-lg font-black tracking-tight rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white border-none shadow-2xl shadow-indigo-900/20"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
