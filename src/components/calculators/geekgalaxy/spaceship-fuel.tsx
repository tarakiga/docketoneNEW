"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Flame } from "lucide-react"
import { useMemo, useState } from "react"

const DISTANCES = {
  'Earth': { 'Mars': 0.000023, 'Jupiter': 0.000082, 'Alpha Centauri': 4.37, 'Kepler-186f': 500, 'Andromeda': 2537000 },
  'Mars': { 'Earth': 0.000023, 'Jupiter': 0.00006, 'Alpha Centauri': 4.37, 'Kepler-186f': 500, 'Andromeda': 2537000 },
  'Jupiter': { 'Earth': 0.000082, 'Mars': 0.00006, 'Alpha Centauri': 4.38, 'Kepler-186f': 500, 'Andromeda': 2537000 },
} as const

const SHIPS = {
  'fighter': { name: 'Star-Fighter', type: 'Combat', efficiency: 1.5e6, icon: '🚀' },
  'freighter': { name: 'Heavy Freighter', type: 'Transport', efficiency: 5.0e6, icon: '🚛' },
  'explorer': { name: 'Deep Space Explorer', type: 'Science', efficiency: 2.5e6, icon: '🛸' },
  'yacht': { name: 'Royal Space Yacht', type: 'Luxury', efficiency: 3.5e6, icon: '🥂' }
}

const FUELS = [
  { name: 'Kerosene (RP-1)', density: 34.2, color: 'bg-yellow-600', textColor: 'text-yellow-500' },
  { name: 'Liquid Hydrogen', density: 143, color: 'bg-blue-600', textColor: 'text-blue-500' },
  { name: 'Nuclear Fission', density: 8.2e7, color: 'bg-green-600', textColor: 'text-green-500' },
  { name: 'Fusion Plasma', density: 3.0e11, color: 'bg-purple-600', textColor: 'text-purple-500' },
  { name: 'Antimatter', density: 8.9e16, color: 'bg-red-600', textColor: 'text-red-500' },
]

export function SpaceshipFuelCalculator() {
  const [origin, setOrigin] = useState("Earth")
  const [destination, setDestination] = useState("Mars")
  const [ship, setShip] = useState<keyof typeof SHIPS>("explorer")

  const calculation = useMemo(() => {
    // @ts-ignore
    const distLY = DISTANCES[origin]?.[destination] || 0
    const shipEff = SHIPS[ship].efficiency // Joules per meter-ish factor
    // Conversion: 1 Light Year = 9.461e15 meters
    // Assume efficiency is Joules per 1000km or something arbitrary for sci-fi scaling. 
    // Let's use legacy logic: tripDistance * LY_TO_PJ * shipEfficiency
    // Legacy: LY_TO_PJ = 9.461 (meaning 1 LY approx 9.46 Petajoules of energy needed base?)
    
    // Legacy logic exactly:
    // requiredEnergy = tripDistance * 9.461 * shipEfficiency (in PJ?)
    // Actually simplicity: Let's make logical sense. 
    // Energy (Joules) = Distance (m) * Force (N). 
    // Let's stick to legacy relative scale.
    
    const energyRequired = distLY * 9.461 * shipEff // units? Arbitrary 'Energy Units'
    
    const fuelNeeds = FUELS.map(fuel => ({
      ...fuel,
      amount: (energyRequired * 1e6) / fuel.density // Amount in Liters/KG
    }))

    return { distLY, energyRequired, fuelNeeds }
  }, [origin, destination, ship])

  const formatAmount = (n: number) => {
    if (n < 1) return n.toPrecision(3)
    if (n < 1000) return n.toFixed(1)
    if (n < 1e6) return (n/1000).toFixed(1) + " k"
    if (n < 1e9) return (n/1e6).toFixed(1) + " M"
    if (n < 1e12) return (n/1e9).toFixed(1) + " B"
    return n.toExponential(2)
  }

  return (
    <Card className="bg-slate-950 border-orange-900/50">
      <CardHeader>
        <CardTitle className="text-3xl font-display text-orange-500 flex items-center gap-2">
          <Flame className="h-8 w-8 text-orange-600" />
          Fuel Logistics
        </CardTitle>
        <CardDescription>Plan energy requirements for your interstellar voyage.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        
        {/* Route Selection */}
        <div className="grid md:grid-cols-3 gap-4 p-4 rounded-xl bg-orange-950/10 border border-orange-900/20">
          <div className="space-y-2">
            <Label className="text-orange-200">Origin</Label>
            <Select value={origin} onValueChange={setOrigin}>
              <SelectTrigger className="bg-slate-900 border-orange-900/50 text-orange-100"><SelectValue/></SelectTrigger>
              <SelectContent>
                {Object.keys(DISTANCES).map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-center pt-6">
            <div className="h-0.5 w-full bg-orange-800/50 relative">
              <div className="absolute -top-1.5 left-1/2 -ml-1 text-orange-500">➜</div>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-orange-200">Destination</Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger className="bg-slate-900 border-orange-900/50 text-orange-100"><SelectValue/></SelectTrigger>
              <SelectContent>
                 {/* @ts-ignore */}
                {Object.keys(DISTANCES[origin] || {}).map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Ship Selection */}
        <div className="space-y-3">
          <Label className="text-orange-200">Vessel Class</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(SHIPS).map(([key, data]) => (
              <button
                key={key}
                onClick={() => setShip(key as any)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  ship === key 
                    ? "bg-orange-600/20 border-orange-500 ring-1 ring-orange-500" 
                    : "bg-slate-900 border-slate-800 hover:border-orange-700"
                }`}
              >
                <div className="text-2xl mb-1">{data.icon}</div>
                <div className="font-bold text-sm text-orange-100">{data.name}</div>
                <div className="text-xs text-orange-400/60">{data.type}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
           <div className="flex items-center justify-between text-sm text-slate-400 px-2">
             <span>Distance: {calculation.distLY} Light Years</span>
             <span>Total Energy: {calculation.energyRequired.toExponential(2)} MJ</span>
           </div>

           <div className="rounded-xl overflow-hidden border border-slate-800">
             <div className="grid grid-cols-3 bg-slate-900 p-3 text-xs uppercase tracking-wider text-slate-500 font-bold">
               <div className="col-span-1">Fuel Type</div>
               <div className="col-span-1 text-right">Mass Required</div>
               <div className="col-span-1 text-right">Volume</div>
             </div>
             {calculation.fuelNeeds.map((fuel) => (
               <div key={fuel.name} className="grid grid-cols-3 p-4 border-t border-slate-800 bg-slate-950/50 hover:bg-slate-900/80 transition-colors items-center">
                 <div className="col-span-1 flex items-center gap-2 font-bold text-white">
                   <div className={`w-2 h-8 rounded-full ${fuel.color}`} />
                   <span>{fuel.name}</span>
                 </div>
                 <div className={`col-span-1 text-right font-mono ${fuel.textColor}`}>
                    {formatAmount(fuel.amount)} kg
                 </div>
                 <div className="col-span-1 text-right text-slate-500 text-sm">
                    {/* Just verifying generic density logic visual */}
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                       <div className={`h-full ${fuel.color}`} style={{ width: `${Math.min(100, Math.max(1, 100 - (Math.log10(fuel.amount) * 5)))}%` }} />
                    </div>
                 </div>
               </div>
             ))}
           </div>
        </div>

      </CardContent>
    </Card>
  )
}
