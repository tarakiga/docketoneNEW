"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { AnimatePresence, motion } from "framer-motion"
import { Battery, Zap } from "lucide-react"
import { useEffect, useState } from "react"

export function LightningLifeCalculator() {
    const [age, setAge] = useState(25)
    const [lifestyle, setLifestyle] = useState<'low' | 'average' | 'high'>('average')
    const [results, setResults] = useState<{
        lightningStrikes: number
        totalEnergy: number
        energyPerYear: number
        homesForYear: number
        iPhoneBatteries: string
        tntEquivalent: number
        carMiles: string
        futureStrikes: string
    } | null>(null)

    useEffect(() => {
        calculate()
    }, [age, lifestyle])

    const calculate = () => {
        const lifestyleMultipliers = {
            low: 0.7,      // 56M joules/year
            average: 1.0,  // 80M joules/year  
            high: 1.5      // 120M joules/year
        }

        const baseEnergyPerYear = 80000000 // 80 million joules
        const lightningBoltEnergy = 1000000000 // 1 billion joules
        
        const energyPerYear = baseEnergyPerYear * lifestyleMultipliers[lifestyle]
        const totalEnergy = energyPerYear * age
        const lightningStrikes = totalEnergy / lightningBoltEnergy

        // Fun comparisons
        const homesForYear = Math.round(totalEnergy / 11000000000) // ~11B joules per home/year
        const iPhoneBatteries = Math.round(totalEnergy / 46800) // iPhone battery ~46.8k joules
        const tntEquivalent = Math.round(totalEnergy / 4184000) // TNT ~4.18M joules/kg
        const carMiles = Math.round(totalEnergy / 3600000) // Car ~3.6M joules/mile

        // Future projection (age 80)
        const futureEnergy = energyPerYear * 80
        const futureStrikes = (futureEnergy / lightningBoltEnergy).toFixed(1)

        setResults({
            lightningStrikes,
            totalEnergy,
            energyPerYear,
            homesForYear,
            iPhoneBatteries: iPhoneBatteries.toLocaleString(),
            tntEquivalent,
            carMiles: carMiles.toLocaleString(),
            futureStrikes
        })
    }

    const formatEnergy = (joules: number) => {
        if (joules >= 1e9) return (joules / 1e9).toFixed(1) + 'B joules'
        if (joules >= 1e6) return (joules / 1e6).toFixed(1) + 'M joules'
        return joules.toLocaleString() + ' joules'
    }

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Panel */}
            <Card className="glass-card lg:col-span-1 h-fit">
                <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <Label>Your Age: {age} years</Label>
                        <Slider 
                            value={[age]} 
                            onValueChange={(v) => setAge(v[0])} 
                            min={1} 
                            max={100} 
                            step={1} 
                            className="py-2"
                        />
                    </div>

                    <div className="space-y-4">
                        <Label>Lifestyle Energy Usage</Label>
                        <div className="grid grid-cols-3 gap-2">
                             <Button 
                                variant={lifestyle === 'low' ? 'default' : 'outline'}
                                onClick={() => setLifestyle('low')}
                                className="h-auto flex flex-col gap-2 py-4"
                            >
                                <span className="text-2xl">🌱</span>
                                <span className="text-xs">Eco</span>
                             </Button>
                             <Button 
                                variant={lifestyle === 'average' ? 'default' : 'outline'}
                                onClick={() => setLifestyle('average')}
                                className="h-auto flex flex-col gap-2 py-4"
                            >
                                <span className="text-2xl">🏠</span>
                                <span className="text-xs">Avg</span>
                             </Button>
                             <Button 
                                variant={lifestyle === 'high' ? 'default' : 'outline'}
                                onClick={() => setLifestyle('high')}
                                className="h-auto flex flex-col gap-2 py-4"
                            >
                                <span className="text-2xl">🚗</span>
                                <span className="text-xs">High</span>
                             </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
                {results && (
                     <Card className="glass-card overflow-hidden relative border-amber-500/20">
                        {/* Animated Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent pointer-events-none" />
                        
                        <CardContent className="pt-8 relative z-10 text-center space-y-6">
                            <AnimatePresence mode="wait">
                                <motion.div 
                                    key={results.lightningStrikes}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="inline-block"
                                >
                                    <div className="text-8xl mb-2 animate-pulse">⚡</div>
                                    <h2 className="text-5xl font-extrabold tracking-tight text-amber-500 mb-2">
                                        {results.lightningStrikes.toFixed(1)} Strikes
                                    </h2>
                                    <p className="text-muted-foreground text-lg">
                                        Amount of lightning needed to power your life so far!
                                    </p>
                                </motion.div>
                            </AnimatePresence>

                            <div className="grid sm:grid-cols-2 gap-4 mt-8">
                                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-blue-500/20 text-blue-500"><Battery className="w-5 h-5"/></div>
                                    <div className="text-left">
                                        <div className="text-xs text-muted-foreground">Total Energy</div>
                                        <div className="font-mono font-bold text-foreground">{formatEnergy(results.totalEnergy)}</div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-orange-500/20 text-orange-500"><Zap className="w-5 h-5"/></div>
                                    <div className="text-left">
                                        <div className="text-xs text-muted-foreground">Per Year</div>
                                        <div className="font-mono font-bold text-foreground">{formatEnergy(results.energyPerYear)}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <ShareResult 
                                    title="My Lightning Power ⚡" 
                                    text={`My life has consumed ${results.lightningStrikes.toFixed(1)} lightning strikes worth of energy! That's ${results.homesForYear} homes powered for a year. Calculate yours at Docket One.`}
                                    className="w-full bg-amber-500 hover:bg-amber-600 text-white border-none"
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {results && (
                    <div className="grid sm:grid-cols-2 gap-4">
                         <Card className="glass-card hover:bg-accent/5 transition-colors">
                            <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                                <div className="text-4xl">🏠</div>
                                <div className="text-2xl font-bold text-foreground">{results.homesForYear}</div>
                                <div className="text-sm text-muted-foreground">Homes powered for 1 year</div>
                            </CardContent>
                        </Card>
                        <Card className="glass-card hover:bg-accent/5 transition-colors">
                            <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                                <div className="text-4xl">📱</div>
                                <div className="text-2xl font-bold text-foreground">{results.iPhoneBatteries}</div>
                                <div className="text-sm text-muted-foreground">iPhone charges</div>
                            </CardContent>
                        </Card>
                        <Card className="glass-card hover:bg-accent/5 transition-colors">
                            <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                                <div className="text-4xl">🚗</div>
                                <div className="text-2xl font-bold text-foreground">{results.carMiles}</div>
                                <div className="text-sm text-muted-foreground">Miles driven</div>
                            </CardContent>
                        </Card>
                        <Card className="glass-card hover:bg-accent/5 transition-colors">
                            <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                                <div className="text-4xl">💣</div>
                                <div className="text-2xl font-bold text-foreground">{results.tntEquivalent.toLocaleString()}</div>
                                <div className="text-sm text-muted-foreground">Kg of TNT</div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}
