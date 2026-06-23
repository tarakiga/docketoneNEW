"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Crosshair, Target } from "lucide-react"
import { useMemo, useState } from "react"

export function MACRoundImpactCalculator() {
    const [mass, setMass] = useState(600) // Tons
    const [velocity, setVelocity] = useState(40) // % of light speed
    
    const { energy, shipsGutted } = useMemo(() => {
        const m = mass * 1000
        const v = (velocity / 100) * 299792458
        const keJoules = 0.5 * m * Math.pow(v, 2)
        const gigatons = keJoules / 4.184e18
        const gutted = Math.floor(gigatons / 10)

        return { energy: gigatons, shipsGutted: gutted }
    }, [mass, velocity])

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 h-fit" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: '#241a52', borderWidth: 1, borderStyle: 'solid', borderColor: '#4a3f7a', color: '#ffd23c' }}>
                            HALO
                        </div>
                    </div>
                    <CardTitle className="flex items-center gap-2" style={{ color: '#ECEAE3' }}>
                        <Crosshair className="w-5 h-5" style={{ color: '#ffd23c' }} />
                        Firing Solution
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#b3aae0' }}>Projectile Mass (Tons)</Label>
                        <Slider value={[mass]} onValueChange={(v) => setMass(v[0])} min={100} max={3000} step={100} className="py-4" />
                        <div className="text-right text-xs font-mono font-bold" style={{ color: '#ffd23c' }}>{mass} Tons</div>
                    </div>
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#b3aae0' }}>Velocity (% Speed of Light)</Label>
                        <Slider value={[velocity]} onValueChange={(v) => setVelocity(v[0])} min={1} max={50} step={1} className="py-4" />
                        <div className="text-right text-xs font-mono font-bold" style={{ color: '#ffd23c' }}>{velocity}% c</div>
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <Card className="border-none p-1" style={{ backgroundColor: '#1d1442' }}>
                     <CardContent className="pt-12 pb-16 text-center">
                        <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: '#b3aae0' }}>Impact Energy</div>
                        <div className="text-5xl md:text-7xl font-black mb-2" style={{ fontFamily: 'var(--font-bungee), cursive', color: '#ffd23c' }}>{energy.toFixed(2)} <span className="text-2xl" style={{ color: '#b3aae0' }}>Gigatons</span></div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-8" style={{ backgroundColor: '#241a52', borderWidth: 1, borderStyle: 'solid', borderColor: '#4a3f7a', color: '#ffd23c' }}>
                            From the HALO Lore
                        </div>

                        <div className="p-6 rounded-3xl max-w-sm mx-auto" style={{ backgroundColor: '#0c0824', borderWidth: 1, borderStyle: 'solid', borderColor: '#4a3f7a' }}>
                            <div className="flex items-center justify-center gap-4 mb-2" style={{ color: '#ff8a8a' }}>
                                <Target className="w-6 h-6" />
                                <span className="font-black text-2xl">{shipsGutted} Targets</span>
                            </div>
                            <div className="text-xs" style={{ color: '#b3aae0' }}>Covenant Capital Ships Penetrated</div>
                        </div>

                         <div className="mt-10 px-4">
                            <ShareResult
                                title="MAC Firing Report"
                                text={`I just fired a ${mass}-ton slug at ${velocity}% light speed. It released ${energy.toFixed(2)} Gigatons of energy, gutting ${shipsGutted} Covenant ships.`}
                                className="w-full py-6 text-lg font-black tracking-tight rounded-2xl border-none !bg-[#ffd23c] hover:!bg-[#ffd23c] !text-[#160e33] !border-transparent"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
