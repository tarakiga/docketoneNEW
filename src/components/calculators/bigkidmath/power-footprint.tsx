"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Atom, Info, Sun, Wind } from "lucide-react"
import { useEffect, useState } from "react"

export function PowerFootprintCalculator() {
    const [population, setPopulation] = useState(1000000) // 1 million
    const [kwhPerCapita, setKwhPerCapita] = useState(12000)
    
    // Land Area Results (km2)
    const [landSolar, setLandSolar] = useState(0)
    const [landWind, setLandWind] = useState(0)
    const [landNuclear, setLandNuclear] = useState(0)
    
    // Visualization Heights (%)
    const [vizData, setVizData] = useState({ solar: 0, wind: 0, nuclear: 0 })

    useEffect(() => {
        calculate()
    }, [population, kwhPerCapita])

    const calculate = () => {
        // Power Density (W/m2)
        const densitySolar = 10
        const densityWind = 3
        const densityNuclear = 800

        const totalKwhYear = population * kwhPerCapita
        // Convert Annual kWh to Average Power in Watts
        // (kWh * 1000) / (365*24) = Avg Watts
        const avgPowerWatts = (totalKwhYear * 1000) / (365 * 24)

        // Area = Power / Density
        // Result in m2, convert to km2 (/ 1e6)
        const solarKm2 = (avgPowerWatts / densitySolar) / 1e6
        const windKm2 = (avgPowerWatts / densityWind) / 1e6
        const nuclearKm2 = (avgPowerWatts / densityNuclear) / 1e6

        setLandSolar(solarKm2)
        setLandWind(windKm2)
        setLandNuclear(nuclearKm2)

        // Visualizer Normalization
        // Normalize against the largest renewable requirement (Wind usually largest area) plus some buffer
        const maxArea = Math.max(solarKm2, windKm2) * 1.1
        
        setVizData({
            solar: (solarKm2 / maxArea) * 100,
            wind: (windKm2 / maxArea) * 100,
            nuclear: Math.max(2, (nuclearKm2 / maxArea) * 100) // Min height 2% visibility
        })
    }

    const formatNumber = (num: number) => num.toLocaleString(undefined, { maximumFractionDigits: 1 })

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Panel */}
            <Card className="glass-card lg:col-span-1 h-fit">
                <CardHeader>
                    <CardTitle>Energy Target</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                         <div className="flex justify-between items-baseline">
                            <Label>Population</Label>
                            <span className="text-sm font-mono text-muted-foreground">{population.toLocaleString()} people</span>
                        </div>
                        <Slider 
                            value={[population]} 
                            onValueChange={(v) => setPopulation(v[0])} 
                            min={10000} 
                            max={10000000} 
                            step={10000} 
                        />
                         <p className="text-xs text-muted-foreground">
                            Equivalent to a city like {population > 8000000 ? 'New York City' : population > 3000000 ? 'Los Angeles' : population > 1000000 ? 'Dallas' : 'a small town'}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-baseline">
                            <Label>Consumption (kWh/person/yr)</Label>
                            <span className="text-sm font-mono text-muted-foreground">{kwhPerCapita.toLocaleString()}</span>
                        </div>
                        <Slider 
                            value={[kwhPerCapita]} 
                            onValueChange={(v) => setKwhPerCapita(v[0])} 
                            min={5000} 
                            max={20000} 
                            step={500} 
                        />
                        <p className="text-xs text-muted-foreground">
                            Global avg ~3.5k, US avg ~12k. Higher consumption assumes industrial load.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
                 <div className="grid md:grid-cols-3 gap-4">
                     {/* Solar Card */}
                     <Card className="glass-card border-orange-500/20 bg-orange-500/5">
                        <CardContent className="pt-6 text-center">
                            <Sun className="mx-auto w-8 h-8 text-orange-500 mb-2" />
                            <h3 className="font-semibold text-foreground">Solar PV</h3>
                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 my-2">
                                {formatNumber(landSolar)} km²
                            </div>
                            <div className="text-xs text-muted-foreground">Moderate Density</div>
                        </CardContent>
                     </Card>

                      {/* Wind Card */}
                     <Card className="glass-card border-blue-500/20 bg-blue-500/5">
                        <CardContent className="pt-6 text-center">
                            <Wind className="mx-auto w-8 h-8 text-blue-500 mb-2" />
                            <h3 className="font-semibold text-foreground">Wind</h3>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 my-2">
                                {formatNumber(landWind)} km²
                            </div>
                            <div className="text-xs text-muted-foreground">Low Density</div>
                        </CardContent>
                     </Card>

                      {/* Nuclear Card */}
                     <Card className="glass-card border-green-500/20 bg-green-500/5">
                        <CardContent className="pt-6 text-center">
                            <Atom className="mx-auto w-8 h-8 text-green-500 mb-2" />
                            <h3 className="font-semibold text-foreground">Nuclear</h3>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400 my-2">
                                {formatNumber(landNuclear)} km²
                            </div>
                            <div className="text-xs text-muted-foreground">Ultra High Density</div>
                        </CardContent>
                     </Card>
                 </div>

                 {/* Visualizer */}
                 <Card className="glass-card overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-center">Relative Land Area Visualizer</CardTitle>
                    </CardHeader>
                     <CardContent className="h-64 relative flex items-end justify-center gap-8 md:gap-16 pb-8 px-8">
                         {/* Ground Line */}
                         <div className="absolute bottom-8 left-0 right-0 h-px bg-border" />
                         
                         {/* Bars */}
                         <div className="w-20 md:w-24 relative group flex flex-col justify-end h-full">
                            <div 
                                className="w-full bg-orange-400 rounded-t-md transition-all duration-500 relative"
                                style={{ height: `${vizData.solar}%` }}
                            >
                                <div className="absolute -top-6 left-0 right-0 text-center text-xs font-bold text-orange-600 dark:text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {formatNumber(landSolar)}
                                </div>
                            </div>
                            <div className="text-center mt-2 font-medium text-sm text-foreground">Solar</div>
                         </div>

                         <div className="w-20 md:w-24 relative group flex flex-col justify-end h-full">
                            <div 
                                className="w-full bg-blue-400 rounded-t-md transition-all duration-500 relative"
                                style={{ height: `${vizData.wind}%` }}
                            >
                                <div className="absolute -top-6 left-0 right-0 text-center text-xs font-bold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {formatNumber(landWind)}
                                </div>
                            </div>
                             <div className="text-center mt-2 font-medium text-sm text-foreground">Wind</div>
                         </div>

                         <div className="w-20 md:w-24 relative group flex flex-col justify-end h-full">
                            <div 
                                className="w-full bg-green-500 rounded-t-md transition-all duration-500 relative min-h-[4px]"
                                style={{ height: `${vizData.nuclear}%` }}
                            >
                                <div className="absolute -top-6 left-0 right-0 text-center text-xs font-bold text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {formatNumber(landNuclear)}
                                </div>
                            </div>
                             <div className="text-center mt-2 font-medium text-sm text-foreground">Nuclear</div>
                         </div>
                     </CardContent>
                 </Card>
                
                 <div className="grid md:grid-cols-2 gap-4">
                    <Alert className="bg-primary/5 border-primary/20">
                         <Info className="h-4 w-4" />
                         <AlertTitle>Density Matters</AlertTitle>
                         <AlertDescription>
                             Nuclear power is so dense that to power a city of {population.toLocaleString()}, you'd need {formatNumber(landNuclear)} km², compared to {formatNumber(landWind)} km² for wind!
                         </AlertDescription>
                    </Alert>
                    
                    <ShareResult 
                        title="Energy Land Footprint 🦶" 
                        text={`To power ${population.toLocaleString()} people, we'd need ${formatNumber(landSolar)}km² of Solar vs only ${formatNumber(landNuclear)}km² of Nuclear! Calculated at Docket One.`}
                        className="w-full h-auto bg-foreground text-background hover:opacity-90 border-none"
                    />
                 </div>
            </div>
        </div>
    )
}
