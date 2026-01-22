"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Fuel, Gauge, Rocket } from "lucide-react"
import { useMemo, useState } from "react"

const DESTINATIONS = {
  'moon': { name: 'Moon', emoji: '🌙', distKm: 384400, color: 'text-gray-300' },
  'mercury': { name: 'Mercury', emoji: '☿️', distKm: 77000000, color: 'text-gray-400' },
  'venus': { name: 'Venus', emoji: '♀️', distKm: 41000000, color: 'text-yellow-400' },
  'mars': { name: 'Mars', emoji: '🔴', distKm: 78000000, color: 'text-red-500' },
  'jupiter': { name: 'Jupiter', emoji: '🪐', distKm: 628000000, color: 'text-orange-400' },
  'saturn': { name: 'Saturn', emoji: '🪐', distKm: 1200000000, color: 'text-yellow-600' },
  'uranus': { name: 'Uranus', emoji: '🔵', distKm: 2700000000, color: 'text-cyan-400' },
  'neptune': { name: 'Neptune', emoji: '🔵', distKm: 4300000000, color: 'text-blue-500' },
  'proxima': { name: 'Proxima Centauri', emoji: '⭐', distKm: 4.24 * 9.461e12, color: 'text-yellow-200' },
  'andromeda': { name: 'Andromeda Galaxy', emoji: '🌌', distKm: 2.5e6 * 9.461e12, color: 'text-purple-400' },
}

const PROPULSION = {
  'car': { name: 'Highway Speed', speed: 100, label: '100 km/h' },
  'jet': { name: 'Jet Aircraft', speed: 900, label: '900 km/h' },
  'rocket': { name: 'Chemical Rocket', speed: 40000, label: '40,000 km/h' },
  'ion': { name: 'Ion Drive', speed: 200000, label: '200,000 km/h' },
  'parker': { name: 'Parker Solar Probe', speed: 692000, label: '692,000 km/h' },
  'fusion': { name: 'Fusion Ramjet', speed: 54000000, label: '15% Light Speed' },
  'light': { name: 'Speed of Light', speed: 1079252849, label: '1c' },
  'warp1': { name: 'Warp 1', speed: 1079252849, label: '1c' },
  'warp5': { name: 'Warp 5', speed: 125 * 1079252849, label: '125c' },
  'warp9': { name: 'Warp 9', speed: 1516 * 1079252849, label: '1,516c' },
}

export function SpaceTravelCalculator() {
  const [destination, setDestination] = useState<keyof typeof DESTINATIONS>("mars")
  const [propulsion, setPropulsion] = useState<keyof typeof PROPULSION>("rocket")

  const stats = useMemo(() => {
    const dist = DESTINATIONS[destination].distKm
    const speed = PROPULSION[propulsion].speed
    const hours = dist / speed
    
    // Formatting time
    let timeLabel = ""
    if (hours < 1) timeLabel = Math.round(hours * 60) + " minutes"
    else if (hours < 24) timeLabel = hours.toFixed(1) + " hours"
    else if (hours < 24 * 365) timeLabel = Math.floor(hours / 24).toLocaleString() + " days"
    else if (hours < 24 * 365 * 1000) timeLabel = Math.floor(hours / (24 * 365)).toLocaleString() + " years"
    else timeLabel = (hours / (24 * 365 * 1000000)).toFixed(1) + " million years"

    // Relativistic check
    const c = 1079252849
    const percentC = (speed / c) * 100
    
    // Fuel estim (very rough, just for fun scaling)
    const fuelIndex = speed < 1000 ? 1 : speed / 10000
    const fuelReq = (dist / 1000000) * fuelIndex
    
    let fuelLabel = ""
    if (fuelReq < 1000) fuelLabel = fuelReq.toFixed(1) + " kg"
    else if (fuelReq < 1000000) fuelLabel = (fuelReq / 1000).toFixed(1) + " tons"
    else fuelLabel = (fuelReq / 1000000).toFixed(1) + " kilotons"

    return { timeLabel, percentC, fuelLabel, dist, speed }
  }, [destination, propulsion])

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="bg-slate-950 border-blue-900/50">
        <CardHeader>
          <CardTitle className="text-3xl font-display text-blue-400 flex items-center gap-2">
            <Rocket className="h-8 w-8 text-blue-500" />
            Space Travel Planner
          </CardTitle>
          <CardDescription className="text-blue-200/60">Calculate travel times across the cosmos.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8 md:grid-cols-2">
          
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-blue-300">Destination</Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(DESTINATIONS).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => setDestination(key as any)}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      destination === key 
                        ? "bg-blue-900/40 border-blue-500 ring-1 ring-blue-500" 
                        : "bg-slate-900/50 border-slate-800 hover:border-blue-700 hover:bg-slate-800"
                    }`}
                  >
                    <span className="text-2xl">{data.emoji}</span>
                    <div className="text-left">
                      <div className={`font-bold text-sm ${data.color}`}>{data.name}</div>
                      <div className="text-[10px] text-slate-300">{(data.distKm).toExponential(1)} km</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-blue-300">Propulsion System</Label>
              <Select value={propulsion} onValueChange={(v) => setPropulsion(v as any)}>
                <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">🚗 Highway Speed (100 km/h)</SelectItem>
                  <SelectItem value="jet">✈️ Jet Aircraft (900 km/h)</SelectItem>
                  <SelectItem value="rocket">🚀 Chemical Rocket (40,000 km/h)</SelectItem>
                  <SelectItem value="ion">🔋 Ion Drive (200,000 km/h)</SelectItem>
                  <SelectItem value="parker">☀️ Solar Probe (692,000 km/h)</SelectItem>
                  <SelectItem value="fusion">☢️ Fusion Ramjet (15% Leight Speed)</SelectItem>
                  <SelectItem value="warp1">✨ Warp 1 (Light Speed)</SelectItem>
                  <SelectItem value="warp5">🌌 Warp 5 (125x Light Speed)</SelectItem>
                  <SelectItem value="warp9">🌠 Warp 9 (1,516x Light Speed)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-slate-900/60 rounded-xl p-8 border border-white/5 flex flex-col justify-center gap-8 relative overflow-hidden">
             {/* Starfield Background Effect */}
             <div className="absolute inset-0 opacity-20 pointer-events-none" 
                  style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

             <div className="relative z-10 text-center space-y-2">
                <div className="text-blue-400 uppercase text-xs tracking-widest mb-2">Estimated Travel Time</div>
                <div className="text-5xl font-black text-white glow-text">{stats.timeLabel}</div>
                <div className="text-sm text-slate-400">
                  to {DESTINATIONS[destination].name}
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                   <div className="flex items-center gap-2 text-yellow-400 mb-1">
                      <Gauge className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase">Speed</span>
                   </div>
                   <div className="text-lg font-mono text-white">{PROPULSION[propulsion].label}</div>
                   {stats.percentC > 0 && stats.percentC < 100 && (
                      <div className="text-xs text-slate-500 mt-1">{stats.percentC.toFixed(4)}% Light Speed</div>
                   )}
                </div>
                <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                   <div className="flex items-center gap-2 text-red-400 mb-1">
                      <Fuel className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase">Est. Fuel</span>
                   </div>
                   <div className="text-lg font-mono text-white">{stats.fuelLabel}</div>
                   <div className="text-xs text-slate-500 mt-1">Theoretical Load</div>
                </div>
             </div>

             {stats.percentC >= 100 && (
               <div className="bg-purple-900/30 border border-purple-500/30 p-3 rounded-lg flex gap-3 items-start relative z-10">
                 <Clock className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                 <div className="text-xs text-purple-200">
                   <span className="font-bold text-purple-300">Relativistic Warning:</span> FTL travel violates causality in standard physics. You might arrive before you left. Time dilation effects ignored.
                 </div>
               </div>
             )}
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
