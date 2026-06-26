"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShareResult } from "@/components/molecules/share-result"
import { Flame } from "lucide-react"
import { useMemo, useState } from "react"

const DISTANCES = {
  'Earth': { 'Mars': 0.000023, 'Jupiter': 0.000082, 'Alpha Centauri': 4.37, 'Kepler-186f': 500, 'Andromeda': 2537000 },
  'Mars': { 'Earth': 0.000023, 'Jupiter': 0.00006, 'Alpha Centauri': 4.37, 'Kepler-186f': 500, 'Andromeda': 2537000 },
  'Jupiter': { 'Earth': 0.000082, 'Mars': 0.00006, 'Alpha Centauri': 4.38, 'Kepler-186f': 500, 'Andromeda': 2537000 },
} as const

type Origin = keyof typeof DISTANCES
const DESTINATIONS = ["Earth", "Mars", "Jupiter", "Alpha Centauri", "Kepler-186f", "Andromeda"] as const
type Destination = typeof DESTINATIONS[number]

const SHIPS = {
  'fighter': { name: 'Star-Fighter', type: 'Combat', efficiency: 1.5e6, icon: '🚀' },
  'freighter': { name: 'Heavy Freighter', type: 'Transport', efficiency: 5.0e6, icon: '🚛' },
  'explorer': { name: 'Deep Space Explorer', type: 'Science', efficiency: 2.5e6, icon: '🛸' },
  'yacht': { name: 'Royal Space Yacht', type: 'Luxury', efficiency: 3.5e6, icon: '🥂' }
}

const FUELS = [
  { name: 'Kerosene (RP-1)', density: 34.2, color: '#ffd23c', textColor: '#ffd23c' },
  { name: 'Liquid Hydrogen', density: 143, color: '#86efac', textColor: '#86efac' },
  { name: 'Nuclear Fission', density: 8.2e7, color: '#86efac', textColor: '#86efac' },
  { name: 'Fusion Plasma', density: 3.0e11, color: '#ff8a3c', textColor: '#ff8a3c' },
  { name: 'Antimatter', density: 8.9e16, color: '#ff8a8a', textColor: '#ff8a8a' },
]

export function SpaceshipFuelCalculator() {
  const [origin, setOrigin] = useState<Origin>("Earth")
  const [destination, setDestination] = useState<Destination>("Mars")
  const [ship, setShip] = useState<keyof typeof SHIPS>("explorer")

  const calculation = useMemo(() => {
    const destinations = DISTANCES[origin]
    const distLY = destinations?.[destination as keyof typeof destinations] || 0
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
    <Card style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
      <CardHeader>
        <CardTitle className="text-3xl font-display flex items-center gap-2" style={{ color: '#ff8a3c' }}>
          <Flame className="h-8 w-8" style={{ color: '#ff8a3c' }} />
          Fuel Logistics
        </CardTitle>
        <CardDescription style={{ color: '#b3aae0' }}>Plan energy requirements for your interstellar voyage.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">

        {/* Route Selection */}
        <div className="grid md:grid-cols-3 gap-4 p-4 rounded-xl border" style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a' }}>
          <div className="space-y-2">
            <Label style={{ color: '#ECEAE3' }}>Origin</Label>
            <Select value={origin} onValueChange={(value) => setOrigin(value as Origin)}>
              <SelectTrigger className="border" style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a', color: '#ECEAE3' }}><SelectValue/></SelectTrigger>
              <SelectContent>
                {Object.keys(DISTANCES).map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-center pt-6">
            <div className="h-0.5 w-full relative" style={{ backgroundColor: '#4a3f7a' }}>
              <div className="absolute -top-1.5 left-1/2 -ml-1" style={{ color: '#ff8a3c' }}>➜</div>
            </div>
          </div>
          <div className="space-y-2">
            <Label style={{ color: '#ECEAE3' }}>Destination</Label>
            <Select value={destination} onValueChange={(value) => setDestination(value as Destination)}>
              <SelectTrigger className="border" style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a', color: '#ECEAE3' }}><SelectValue/></SelectTrigger>
              <SelectContent>
                {DESTINATIONS.filter((item) => Object.prototype.hasOwnProperty.call(DISTANCES[origin] || {}, item)).map(k => (
                  <SelectItem key={k} value={k}>
                    {k}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Ship Selection */}
        <div className="space-y-3">
          <Label style={{ color: '#ECEAE3' }}>Vessel Class</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(SHIPS).map(([key, data]) => (
              <button
                key={key}
                onClick={() => setShip(key as keyof typeof SHIPS)}
                className="p-3 rounded-lg border text-left transition-all"
                style={
                  ship === key
                    ? { backgroundColor: '#241a52', borderColor: '#ff8a3c' }
                    : { backgroundColor: '#0c0824', borderColor: '#4a3f7a' }
                }
              >
                <div className="text-2xl mb-1">{data.icon}</div>
                <div className="font-bold text-sm" style={{ color: '#ECEAE3' }}>{data.name}</div>
                <div className="text-xs" style={{ color: '#b3aae0' }}>{data.type}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
           <div className="flex items-center justify-between text-sm px-2" style={{ color: '#b3aae0' }}>
             <span>Distance: {calculation.distLY} Light Years</span>
             <span>Total Energy: {calculation.energyRequired.toExponential(2)} MJ</span>
           </div>

           <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#4a3f7a' }}>
             <div className="grid grid-cols-3 p-3 text-xs uppercase tracking-wider font-bold" style={{ backgroundColor: '#241a52', color: '#b3aae0' }}>
               <div className="col-span-1">Fuel Type</div>
               <div className="col-span-1 text-right">Mass Required</div>
               <div className="col-span-1 text-right">Volume</div>
             </div>
             {calculation.fuelNeeds.map((fuel) => (
               <div key={fuel.name} className="grid grid-cols-3 p-2 sm:p-4 border-t transition-colors items-center" style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a' }}>
                 <div className="col-span-1 flex items-center gap-2 font-bold min-w-0" style={{ color: '#ECEAE3' }}>
                   <div className="w-2 h-8 rounded-full shrink-0" style={{ backgroundColor: fuel.color }} />
                   <span className="min-w-0 truncate">{fuel.name}</span>
                 </div>
                 <div className="col-span-1 text-right" style={{ fontFamily: 'var(--font-bungee), cursive', color: fuel.textColor }}>
                    {formatAmount(fuel.amount)} kg
                 </div>
                 <div className="col-span-1 text-right text-sm" style={{ color: '#b3aae0' }}>
                    {/* Just verifying generic density logic visual */}
                    <div className="w-full h-1.5 rounded-full mt-1 overflow-hidden" style={{ backgroundColor: '#241a52' }}>
                       <div className="h-full" style={{ width: `${Math.min(100, Math.max(1, 100 - (Math.log10(fuel.amount) * 5)))}%`, backgroundColor: fuel.color }} />
                    </div>
                 </div>
               </div>
             ))}
           </div>
        </div>

        <div className="flex justify-center mt-6">
          <ShareResult title="Spaceship Fuel" text={`My ${SHIPS[ship].name} needs ${formatAmount(calculation.fuelNeeds[0].amount)} kg of ${calculation.fuelNeeds[0].name} to reach ${destination}. ⛽🚀`} />
        </div>

      </CardContent>
    </Card>
  )
}
