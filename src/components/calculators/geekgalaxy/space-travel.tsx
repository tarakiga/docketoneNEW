"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ShareResult } from "@/components/molecules/share-result"
import { ChevronDown, Clock, Fuel, Gauge, Rocket } from "lucide-react"
import { useMemo, useState } from "react"

// Correcting the object structure to ensure consistency
const DEST_VALS = {
  'moon': { name: 'Moon', emoji: '🌙', distKm: 384400, color: 'text-gray-300', au: 1.002, period: 0.074 },
  'mercury': { name: 'Mercury', emoji: '☿️', distKm: 77000000, color: 'text-gray-300', au: 0.387, period: 0.241 },
  'venus': { name: 'Venus', emoji: '♀️', distKm: 41000000, color: 'text-yellow-300', au: 0.723, period: 0.615 },
  'mars': { name: 'Mars', emoji: '🔴', distKm: 78000000, color: 'text-red-300', au: 1.524, period: 1.881 },
  'jupiter': { name: 'Jupiter', emoji: '🪐', distKm: 628000000, color: 'text-orange-400', au: 5.204, period: 11.86 },
  'saturn': { name: 'Saturn', emoji: '🪐', distKm: 1200000000, color: 'text-amber-300', au: 9.582, period: 29.45 },
  'uranus': { name: 'Uranus', emoji: '🔵', distKm: 2700000000, color: 'text-cyan-400', au: 19.22, period: 84.01 },
  'neptune': { name: 'Neptune', emoji: '🔵', distKm: 4300000000, color: 'text-sky-300', au: 30.07, period: 164.8 },
  'proxima': { name: 'Proxima Centauri', emoji: '⭐', distKm: 4.24 * 9.461e12, color: 'text-yellow-200', au: 268000, period: 1000000 },
  'andromeda': { name: 'Andromeda Galaxy', emoji: '🌌', distKm: 2.5e6 * 9.461e12, color: 'text-purple-400', au: 1.5e11, period: 1e15 },
}

const PROPULSION = {
  'car': { name: 'Highway Speed', emoji: '🚗', speed: 0.1, label: '100 km/h', color: 'from-slate-800 to-slate-900', class: 'Civilian', isFTL: false },
  'jet': { name: 'Jet Aircraft', emoji: '✈️', speed: 0.9, label: '900 km/h', color: 'from-blue-800 to-blue-900', class: 'Aviation', isFTL: false },
  'artemis': { name: 'Artemis SLS', emoji: '🌕', speed: 27.35, label: '27.35k km/h', color: 'from-orange-800 to-red-900', class: 'Super Heavy Lift', isFTL: false },
  'dragon': { name: 'SpaceX Dragon', emoji: '🐉', speed: 28, label: '28k km/h', color: 'from-blue-900 to-indigo-950', class: 'LEO Transport', isFTL: false },
  'starship': { name: 'SpaceX Starship', emoji: '🚀', speed: 30, label: '30k km/h', color: 'from-blue-800 to-indigo-900', class: 'Super Heavy', isFTL: false },
  'rocket': { name: 'Chemical Rocket', emoji: '🧨', speed: 40, label: '40k km/h', color: 'from-orange-900 to-red-900', class: 'Traditional', isFTL: false },
  'ion': { name: 'Ion Drive', emoji: '🔋', speed: 200, label: '200k km/h', color: 'from-emerald-900 to-teal-950', class: 'High Efficiency', isFTL: false },
  'fusion': { name: 'Fusion Ramjet', emoji: '☢️', speed: 54000, label: '0.15c', color: 'from-purple-900 to-pink-900', class: 'Relativistic', isFTL: false },
  'light': { name: 'Speed of Light', emoji: '✨', speed: 1079252, label: '1.0c', color: 'from-yellow-900 to-orange-900', class: 'Universal Constant', isFTL: false },
  'nx01': { name: 'Enterprise NX-01', emoji: '🖖', speed: 125 * 1079252, label: 'Warp 5', isFTL: true, color: 'from-blue-900 to-cyan-950', class: 'Exploration' },
  'ncc1701': { name: 'USS Enterprise', emoji: '🛰️', speed: 512 * 1079252, label: 'Warp 8', isFTL: true, color: 'from-blue-800 to-cyan-900', class: 'Constitution' },
  'defiant': { name: 'USS Defiant', emoji: '🛡️', speed: 1640 * 1079252, label: 'Warp 9.5', isFTL: true, color: 'from-red-900 to-orange-950', class: 'Escort' },
  'entD': { name: 'Enterprise-D', emoji: '🏛️', speed: 1909 * 1079252, label: 'Warp 9.6', isFTL: true, color: 'from-indigo-900 to-blue-950', class: 'Galaxy Class' },
  'voyager': { name: 'USS Voyager', emoji: '🌌', speed: 4000 * 1079252, label: 'Warp 9.975', isFTL: true, color: 'from-purple-900 to-indigo-950', class: 'Intrepid' },
  'borg': { name: 'Borg Cube', emoji: '🧊', speed: 20000 * 1079252, label: 'Transwarp', isFTL: true, color: 'from-green-900 to-emerald-950', class: 'Collective' },
}

export function SpaceTravelCalculator() {
  const [destination, setDestination] = useState<keyof typeof DEST_VALS>("mars")
  const [propulsion, setPropulsion] = useState<keyof typeof PROPULSION>("rocket")
  const [useHohmann, setUseHohmann] = useState(true)

  const stats = useMemo(() => {
    const dest = DEST_VALS[destination]
    const prop = PROPULSION[propulsion as keyof typeof PROPULSION]
    const c = 1079252849
    
    let hours = 0
    let timeLabel = ""
    let method = "Direct Path"

    // Only apply Hohmann to inner/outer solar system and traditional rockets
    const isRocketType = ['rocket', 'starship', 'dragon', 'artemis'].includes(propulsion)
    if (useHohmann && dest.au < 100 && isRocketType) {
      if (destination === 'moon') {
        // The standard Kepler calculation below is Heliocentric (Sun-orbit). 
        // For the Moon, we use a Geocentric translunar injection which takes roughly 3 to 5 days.
        hours = 120 // 5 days average for high-efficiency lunar transfer
        method = "Lunar Transfer Orbit"
      } else {
        const r1 = 1.0 
        const r2 = dest.au
        const a_trans = (r1 + r2) / 2
        const p_trans_years = Math.sqrt(Math.pow(a_trans, 3))
        const travel_years = p_trans_years / 2
        hours = travel_years * 365 * 24
        method = "Hohmann Transfer Orbit"
      }
    } else {
      const actualSpeed = prop.isFTL ? prop.speed : prop.speed * 1000
      hours = dest.distKm / actualSpeed
      method = prop.isFTL ? "Warp Bubble" : "Direct High-Thrust Path"
    }
    
    // Formatting time
    if (hours < 1) timeLabel = Math.round(hours * 60) + " minutes"
    else if (hours < 24) timeLabel = hours.toFixed(1) + " hours"
    else if (hours < 24 * 365) timeLabel = Math.floor(hours / 24).toLocaleString() + " days"
    else if (hours < 24 * 365 * 100) timeLabel = Math.floor(hours / (24 * 365)).toLocaleString() + " years"
    else timeLabel = (hours / (24 * 365 * 1000000)).toFixed(1) + " million years"

    const currentSpeedKmh = prop.isFTL ? prop.speed : prop.speed * 1000
    const percentC = ((currentSpeedKmh) / c) * 100
    
    // Synodic Period (Launch Window)
    const p1 = 1.0 // Earth years
    const p2 = dest.period
    const synodic = Math.abs(1 / ((1/p1) - (1/p2)))
    const daysWindow = Math.floor(synodic * 365)

    // Dynamic Launch Windows Generator
    const windows = []
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    
    // Reference epochs
    const epochs: Record<string, { year: number, month: number }> = {
      'moon': { year: 2026, month: 0 },
      'mercury': { year: 2026, month: 2 },
      'venus': { year: 2026, month: 9 },
      'mars': { year: 2026, month: 10 },
      'jupiter': { year: 2026, month: 11 },
      'saturn': { year: 2027, month: 0 },
      'uranus': { year: 2026, month: 10 },
      'neptune': { year: 2026, month: 8 },
    }

    const start = epochs[destination as string] || { year: 2026, month: 6 }
    let currentMonth = start.month
    let currentYear = start.year

    for (let i = 0; i < 3; i++) {
      windows.push({
        year: currentYear,
        month: months[currentMonth % 12],
        days: destination === 'moon' ? 'Every 27 Days' : `${Math.floor(synodic * 14)} days`
      })
      
      const totalMonths = Math.round(synodic * 12)
      currentMonth += totalMonths
      currentYear += Math.floor(currentMonth / 12)
      currentMonth = currentMonth % 12
    }

    return { timeLabel, percentC, hours, method, daysWindow, windows }
  }, [destination, propulsion, useHohmann])

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="shadow-2xl" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
        <CardHeader className="border-b" style={{ borderColor: '#4a3f7a' }}>
          <CardTitle className="text-3xl font-display flex items-center gap-2" style={{ color: '#ff8a3c' }}>
            <Rocket className="h-8 w-8" style={{ color: '#ff8a3c' }} />
            Interstellar Voyager
          </CardTitle>
          <CardDescription className="font-medium" style={{ color: '#b3aae0' }}>Orbital dynamics & cosmic mission planning center.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8 lg:grid-cols-12 p-4 sm:p-6 lg:p-10">
          
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-3">
              <Label className="uppercase tracking-widest text-[10px] font-bold" style={{ color: '#ff8a3c' }}>Target Destination</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(DEST_VALS).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => setDestination(key as keyof typeof DEST_VALS)}
                    className="flex items-center gap-3 p-3 rounded-xl border transition-all"
                    style={destination === key
                      ? { backgroundColor: '#241a52', borderColor: '#ff8a3c' }
                      : { backgroundColor: '#0c0824', borderColor: '#4a3f7a' }}
                  >
                    <span className="text-2xl">{data.emoji}</span>
                    <div className="text-left">
                      <div className={`font-bold text-xs ${data.color}`}>{data.name}</div>
                      <div className="text-[9px]" style={{ color: '#b3aae0' }}>{(data.distKm).toExponential(1)} km</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="uppercase tracking-widest text-[10px] font-bold" style={{ color: '#ff8a3c' }}>Propulsion System</Label>
              <div className="relative group/scroll">
                <div className="grid grid-cols-1 gap-2 max-h-[300px] sm:max-h-[360px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent">
                  {Object.entries(PROPULSION).map(([key, prop]) => (
                    <button
                      key={key}
                      onClick={() => setPropulsion(key as keyof typeof PROPULSION)}
                      className="flex items-center gap-3 p-4 rounded-xl border transition-all relative overflow-hidden group/btn min-w-0"
                      style={propulsion === key
                        ? { backgroundColor: '#241a52', borderColor: '#ff8a3c' }
                        : { backgroundColor: '#0c0824', borderColor: '#4a3f7a' }}
                    >
                      <span className="text-3xl relative z-10 transition-all shrink-0">{prop.emoji}</span>
                      <div className="text-left relative z-10 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-bold text-[11px] uppercase tracking-tight break-words min-w-0" style={{ color: '#ECEAE3' }}>{prop.name}</div>
                          <div className="text-[8px] font-bold uppercase" style={{ color: '#b3aae0' }}>{prop.class}</div>
                        </div>
                        <div className="text-[10px] font-bold mt-0.5" style={{ color: '#ff8a3c' }}>{prop.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-2 h-12 pointer-events-none z-20 flex items-end justify-center pb-1">
                   <div className="flex flex-col items-center gap-1 animate-bounce opacity-40 group-hover/scroll:opacity-80 transition-opacity">
                      <span className="text-[7px] font-bold uppercase tracking-wider" style={{ color: '#b3aae0' }}>Hangar Scroll</span>
                      <ChevronDown className="h-3 w-3" style={{ color: '#b3aae0' }} />
                   </div>
                </div>
              </div>
            </div>

            {['rocket', 'starship', 'dragon', 'artemis'].includes(propulsion) && DEST_VALS[destination].au < 100 && (
              <div className="space-y-3 pt-2">
                <Label className="uppercase tracking-widest text-[10px] font-bold" style={{ color: '#ff8a3c' }}>Trajectory Mode</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setUseHohmann(true)}
                    className="text-[10px] p-2.5 rounded-lg border uppercase tracking-widest font-black transition-all"
                    style={useHohmann
                      ? { backgroundColor: '#ff8a3c', borderColor: '#ff8a3c', color: '#160e33' }
                      : { backgroundColor: '#0c0824', borderColor: '#4a3f7a', color: '#b3aae0' }}
                  >
                    Hohmann
                  </button>
                  <button
                    onClick={() => setUseHohmann(false)}
                    className="text-[10px] p-2.5 rounded-lg border uppercase tracking-widest font-black transition-all"
                    style={!useHohmann
                      ? { backgroundColor: '#ff8a3c', borderColor: '#ff8a3c', color: '#160e33' }
                      : { backgroundColor: '#0c0824', borderColor: '#4a3f7a', color: '#b3aae0' }}
                  >
                    Direct
                  </button>
                </div>
                <div className="p-4 rounded-xl border mt-2" style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a' }}>
                  <p className="text-[10px] font-medium leading-relaxed italic" style={{ color: '#b3aae0' }}>
                    {useHohmann 
                      ? "📡 Hohmann Transfer: Maximum fuel efficiency via gravity drift." 
                      : "🔥 Direct Path: Brute-force trajectory. Ignores orbital curves."}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-10 border flex flex-col justify-center gap-6 sm:gap-8 relative overflow-hidden group min-h-[280px] sm:min-h-[340px]" style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a' }}>
               <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full opacity-20 animate-blob" style={{ backgroundColor: '#241a52' }} />
               <div className="absolute -left-24 -bottom-24 w-64 h-64 rounded-full opacity-20 animate-blob [animation-delay:3s]" style={{ backgroundColor: '#241a52' }} />

               <div className="relative z-10 text-center space-y-4">
                  <div className="uppercase text-[10px] tracking-[0.4em] mb-3 font-black flex items-center justify-center gap-3" style={{ color: '#ff8a3c' }}>
                    <Clock className="h-4 w-4 animate-pulse" /> {stats.method}
                  </div>
                  <div className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter group-hover:scale-105 transition-transform duration-700" style={{ fontFamily: 'var(--font-bungee), cursive', color: '#ff8a3c' }}>{stats.timeLabel}</div>
                  <div className="flex justify-center mt-6">
                    <ShareResult title="Space Travel Time" text={`It would take ${stats.timeLabel} to reach ${DEST_VALS[destination].name} by ${PROPULSION[propulsion as keyof typeof PROPULSION].name}. 🚀`} />
                  </div>
               </div>

               <div className="grid sm:grid-cols-2 gap-4 relative z-10">
                  <div className="p-5 rounded-2xl border" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
                     <div className="flex items-center gap-2 mb-2" style={{ color: '#b3aae0' }}>
                        <Gauge className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Warp Profile</span>
                     </div>
                     <div className="text-lg font-bold leading-tight" style={{ color: '#ECEAE3' }}>{PROPULSION[propulsion as keyof typeof PROPULSION].name}</div>
                     <div className="text-[10px] font-bold mt-1 uppercase tracking-widest" style={{ color: '#ff8a3c' }}>Active Velocity Computation</div>
                  </div>

                  {DEST_VALS[destination].au < 100 && (
                    <div className="p-5 rounded-2xl border" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
                       <div className="flex items-center gap-2 mb-2" style={{ color: '#86efac' }}>
                          <Fuel className="h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Departure Window</span>
                       </div>
                       <div className="text-lg font-bold leading-tight underline decoration-[#86efac]/50 underline-offset-4" style={{ color: '#ECEAE3' }}>{stats.windows[0].month} {stats.windows[0].year}</div>
                       <div className="text-[10px] font-bold mt-1 uppercase tracking-widest italic font-mono" style={{ color: '#86efac' }}>Launch Gate Primed</div>
                    </div>
                  )}
               </div>

               {stats.percentC >= 100 && (
                 <div className="p-4 rounded-xl flex gap-3 items-start relative z-10 border" style={{ backgroundColor: '#241a52', borderColor: '#ff8a3c' }}>
                   <Clock className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#ff8a3c' }} />
                   <div className="text-[10px] leading-relaxed" style={{ color: '#b3aae0' }}>
                     <span className="font-black uppercase pr-1" style={{ color: '#ff8a3c' }}>Causality Violation:</span>
                     Time dilation is significant. Perceived mission time follows crew-relative temporal flow.
                   </div>
                 </div>
               )}
            </div>

            <div className="grid md:grid-cols-1 gap-6">
              {DEST_VALS[destination].au < 100 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="font-black uppercase tracking-[0.4em] text-[10px] flex items-center gap-2" style={{ color: '#ff8a3c' }}>
                      <Rocket className="h-3 w-3" /> Flight Manifest: {DEST_VALS[destination].name}
                    </h3>
                    <div className="h-px flex-1 ml-6" style={{ backgroundColor: '#4a3f7a' }} />
                  </div>
                  
                  <div className="grid sm:grid-cols-3 gap-4">
                    {stats.windows.map((win, idx) => (
                      <div key={idx} className="rounded-[1.5rem] p-4 sm:p-6 relative overflow-hidden group transition-all duration-700 border" style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a' }}>
                        <div className="flex flex-col gap-5 relative z-10">
                          <div className="space-y-1">
                            <div className="uppercase text-[9px] font-black tracking-widest" style={{ color: '#b3aae0' }}>Epoch</div>
                            <div className="text-3xl font-black leading-none" style={{ color: '#ECEAE3' }}>{win.year}</div>
                          </div>

                          <div className="space-y-1">
                            <div className="uppercase text-[9px] font-black tracking-widest" style={{ color: '#b3aae0' }}>Window</div>
                            <div className="text-xl font-bold leading-tight" style={{ color: '#ff8a3c' }}>{win.month}</div>
                          </div>

                          <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: '#4a3f7a' }}>
                            <div className="flex items-center gap-2">
                               <Fuel className="h-3 w-3" style={{ color: '#86efac' }} />
                               <span className="text-[10px] font-bold uppercase tracking-tight" style={{ color: '#b3aae0' }}>Window</span>
                            </div>
                            <span className="text-[10px] font-black px-2.5 py-1 rounded-full border" style={{ color: '#86efac', backgroundColor: '#241a52', borderColor: '#4a3f7a' }}>{win.days}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 py-4 rounded-2xl italic text-[11px] leading-relaxed border" style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a', color: '#b3aae0' }}>
                    <span className="font-black uppercase pr-2" style={{ color: '#ff8a3c' }}>Mission Log:</span>
                    Hohmann orbital arcs are prioritized for Delta-V efficiency. Gates occur at optimal planetary conjunctions.
                  </div>
                </div>
              ) : (
                <Card className="shadow-2xl p-8 sm:p-12 md:p-20 text-center relative overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem]" style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a' }}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#241a52_1px,_transparent_1px)] [background-size:24px_24px] opacity-30" />
                  <div className="relative z-10 space-y-4">
                    <div className="italic text-lg font-semibold tracking-wide" style={{ color: '#b3aae0' }}>Launch windows are nullified for extragalactic transit.</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse" style={{ color: '#ff8a3c' }}>Deep Space Protocol: Active</div>
                  </div>
                </Card>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: '🌐 Orbital Arc', text: 'Gravity-assisted drifting between planetary spheres. High efficiency, low speed.', color: '#ff8a3c' },
                { title: '🎯 Launch Gate', text: "Alignment-critical temporal window for mission start. Missing this gate causes indefinite stall.", color: '#ffd23c' },
                { title: '⏳ Gate Lifecycle', text: "The operational duration of the departure window. Fuel costs scale exponentially pre/post gate.", color: '#86efac' },
                { title: '⚡ Brute Force', text: 'Direct High-Thrust trajectories ignoring orbital mechanics. Extreme energy cost.', color: '#ff8a3c' }
              ].map((card, i) => (
                <Card key={i} className="transition-all group overflow-hidden relative rounded-2xl" style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a' }}>
                  <CardHeader className="pb-2 relative z-10">
                     <CardTitle className="text-[10px] font-black flex items-center gap-2 uppercase tracking-widest" style={{ color: card.color }}>
                       {card.title}
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-[10px] leading-relaxed font-bold italic" style={{ color: '#b3aae0' }}>
                      {card.text}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
