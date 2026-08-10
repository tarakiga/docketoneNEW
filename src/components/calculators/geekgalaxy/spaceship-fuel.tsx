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
  { name: 'Kerosene (RP-1)', density: 34.2, color: 'var(--dk-yel-ink)', textColor: 'var(--dk-yel-ink)' },
  { name: 'Liquid Hydrogen', density: 143, color: 'var(--dk-pos-ink)', textColor: 'var(--dk-pos-ink)' },
  { name: 'Nuclear Fission', density: 8.2e7, color: 'var(--dk-pos-ink)', textColor: 'var(--dk-pos-ink)' },
  { name: 'Fusion Plasma', density: 3.0e11, color: 'var(--dk-org-ink)', textColor: 'var(--dk-org-ink)' },
  { name: 'Antimatter', density: 8.9e16, color: 'var(--dk-neg-ink)', textColor: 'var(--dk-neg-ink)' },
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
    <Card style={{ backgroundColor: 'var(--dk-surface)', borderColor: 'var(--dk-line)' }}>
      <CardHeader>
        <CardTitle className="text-3xl font-display flex items-center gap-2" style={{ color: 'var(--dk-org-ink)' }}>
          <Flame className="h-8 w-8" style={{ color: 'var(--dk-org-ink)' }} />
          Fuel Logistics
        </CardTitle>
        <CardDescription style={{ color: 'var(--dk-ink-soft)' }}>Plan energy requirements for your interstellar voyage.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">

        {/* Route Selection */}
        <div className="grid md:grid-cols-3 gap-4 p-4 rounded-xl border" style={{ backgroundColor: 'var(--dk-sunk)', borderColor: 'var(--dk-line)' }}>
          <div className="space-y-2">
            <Label style={{ color: 'var(--dk-ink)' }}>Origin</Label>
            <Select value={origin} onValueChange={(value) => setOrigin(value as Origin)}>
              <SelectTrigger className="border" style={{ backgroundColor: 'var(--dk-sunk)', borderColor: 'var(--dk-line)', color: 'var(--dk-ink)' }}><SelectValue/></SelectTrigger>
              <SelectContent>
                {Object.keys(DISTANCES).map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-center pt-6">
            <div className="h-0.5 w-full relative" style={{ backgroundColor: 'var(--dk-mute)' }}>
              <div className="absolute -top-1.5 left-1/2 -ml-1" style={{ color: 'var(--dk-org-ink)' }}>➜</div>
            </div>
          </div>
          <div className="space-y-2">
            <Label style={{ color: 'var(--dk-ink)' }}>Destination</Label>
            <Select value={destination} onValueChange={(value) => setDestination(value as Destination)}>
              <SelectTrigger className="border" style={{ backgroundColor: 'var(--dk-sunk)', borderColor: 'var(--dk-line)', color: 'var(--dk-ink)' }}><SelectValue/></SelectTrigger>
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
          <Label style={{ color: 'var(--dk-ink)' }}>Vessel Class</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(SHIPS).map(([key, data]) => (
              <button
                key={key}
                onClick={() => setShip(key as keyof typeof SHIPS)}
                className="p-3 rounded-lg border text-left transition-all"
                style={
                  ship === key
                    ? { backgroundColor: 'var(--dk-raised)', borderColor: 'var(--dk-org-ink)' }
                    : { backgroundColor: 'var(--dk-sunk)', borderColor: 'var(--dk-line)' }
                }
              >
                <div className="text-2xl mb-1">{data.icon}</div>
                <div className="font-bold text-sm" style={{ color: 'var(--dk-ink)' }}>{data.name}</div>
                <div className="text-xs" style={{ color: 'var(--dk-ink-soft)' }}>{data.type}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
           <div className="flex items-center justify-between text-sm px-2" style={{ color: 'var(--dk-ink-soft)' }}>
             <span>Distance: {calculation.distLY} Light Years</span>
             <span>Total Energy: {calculation.energyRequired.toExponential(2)} MJ</span>
           </div>

           <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--dk-line)' }}>
             <div className="grid grid-cols-3 p-3 text-xs uppercase tracking-wider font-bold" style={{ backgroundColor: 'var(--dk-raised)', color: 'var(--dk-ink-soft)' }}>
               <div className="col-span-1">Fuel Type</div>
               <div className="col-span-1 text-right">Mass Required</div>
               <div className="col-span-1 text-right">Volume</div>
             </div>
             {calculation.fuelNeeds.map((fuel) => (
               <div key={fuel.name} className="grid grid-cols-3 p-2 sm:p-4 border-t transition-colors items-center" style={{ backgroundColor: 'var(--dk-sunk)', borderColor: 'var(--dk-line)' }}>
                 <div className="col-span-1 flex items-center gap-2 font-bold min-w-0" style={{ color: 'var(--dk-ink)' }}>
                   <div className="w-2 h-8 rounded-full shrink-0" style={{ backgroundColor: fuel.color }} />
                   <span className="min-w-0 truncate">{fuel.name}</span>
                 </div>
                 <div className="col-span-1 text-right" style={{ fontFamily: 'var(--font-fredoka), cursive', color: fuel.textColor }}>
                    {formatAmount(fuel.amount)} kg
                 </div>
                 <div className="col-span-1 text-right text-sm" style={{ color: 'var(--dk-ink-soft)' }}>
                    {/* Just verifying generic density logic visual */}
                    <div className="w-full h-1.5 rounded-full mt-1 overflow-hidden" style={{ backgroundColor: 'var(--dk-raised)' }}>
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
