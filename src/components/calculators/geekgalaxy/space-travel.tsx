"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ChevronDown, Clock, Fuel, Gauge, Rocket } from "lucide-react"
import { useMemo, useState } from "react"

const DESTINATIONS = {
  'moon': { name: 'Moon', emoji: '🌙', distKm: 384400, color: 'text-gray-300', au: 1.002, period: 0.074 },
  'mercury': { name: 'Mercury', emoji: '☿️', distKm: 77000000, color: 'text-gray-400', au: 0.387, period: 0.241 },
  'venus': { name: 'Venus', emoji: '♀️', distKm: 41000000, color: 'text-yellow-400', au: 0.723, period: 0.615 },
  'mars': { name: 'Mars', emoji: '🔴', distKm: 78000000, color: 'text-red-500', au: 1.524, period: 1.881 },
  'jupiter': { name: 'Jupiter', emoji: '🪐', distKm: 628000000, color: 'text-orange-400', au: 5.204, period: 11.86 },
  'saturn': { name: 'Saturn', emoji: '🪐', distKm: 1200000000, color: 'text-yellow-600', au: 9.582, period: 29.45 },
  'uranus': { name: 'Uranus', emoji: '🔵', distKm: 2700000000, color: 'text-cyan-400', au: 19.22, period: 84.01 },
  'neptune': { name: 'Neptune', emoji: '🔵', distKm: 4300000000, color: 'text-blue-500', au: 30.07, period: 164.8 },
  'proxima': { name: 'Proxima Centauri', emoji: '⭐', distKm: 4.24 * 9.461e12, color: 'text-yellow-200', au: 268000, period: 1000000 },
  'andromeda': { name: 'Andromeda Galaxy', emoji: '🌌', distKm: 2.5e6 * 9.461e12, color: 'text-purple-400', au: 1.5e11, period: 1e15 },
}

// Correcting the object structure to ensure consistency
const DEST_VALS = {
  'moon': { name: 'Moon', emoji: '🌙', distKm: 384400, color: 'text-gray-300', au: 1.002, period: 0.074 },
  'mercury': { name: 'Mercury', emoji: '☿️', distKm: 77000000, color: 'text-gray-400', au: 0.387, period: 0.241 },
  'venus': { name: 'Venus', emoji: '♀️', distKm: 41000000, color: 'text-yellow-400', au: 0.723, period: 0.615 },
  'mars': { name: 'Mars', emoji: '🔴', distKm: 78000000, color: 'text-red-500', au: 1.524, period: 1.881 },
  'jupiter': { name: 'Jupiter', emoji: '🪐', distKm: 628000000, color: 'text-orange-400', au: 5.204, period: 11.86 },
  'saturn': { name: 'Saturn', emoji: '🪐', distKm: 1200000000, color: 'text-yellow-600', au: 9.582, period: 29.45 },
  'uranus': { name: 'Uranus', emoji: '🔵', distKm: 2700000000, color: 'text-cyan-400', au: 19.22, period: 84.01 },
  'neptune': { name: 'Neptune', emoji: '🔵', distKm: 4300000000, color: 'text-blue-500', au: 30.07, period: 164.8 },
  'proxima': { name: 'Proxima Centauri', emoji: '⭐', distKm: 4.24 * 9.461e12, color: 'text-yellow-200', au: 268000, period: 1000000 },
  'andromeda': { name: 'Andromeda Galaxy', emoji: '🌌', distKm: 2.5e6 * 9.461e12, color: 'text-purple-400', au: 1.5e11, period: 1e15 },
}

const PROPULSION = {
  'car': { name: 'Highway Speed', emoji: '🚗', speed: 0.1, label: '100 km/h', color: 'from-slate-800 to-slate-900', class: 'Civilian', isFTL: false },
  'jet': { name: 'Jet Aircraft', emoji: '✈️', speed: 0.9, label: '900 km/h', color: 'from-blue-800 to-blue-900', class: 'Aviation', isFTL: false },
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
    const isRocketType = ['rocket', 'starship', 'dragon'].includes(propulsion)
    if (useHohmann && dest.au < 100 && isRocketType) {
      const r1 = 1.0 
      const r2 = dest.au
      const a_trans = (r1 + r2) / 2
      const p_trans_years = Math.sqrt(Math.pow(a_trans, 3))
      const travel_years = p_trans_years / 2
      hours = travel_years * 365 * 24
      method = "Hohmann Transfer Orbit"
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
      <Card className="bg-black border-slate-800/60 shadow-2xl shadow-blue-900/10">
        <CardHeader className="border-b border-slate-800/50">
          <CardTitle className="text-3xl font-display text-blue-400 flex items-center gap-2">
            <Rocket className="h-8 w-8 text-blue-500" />
            Interstellar Voyager
          </CardTitle>
          <CardDescription className="text-blue-200/40 font-medium">Orbital dynamics & cosmic mission planning center.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8 lg:grid-cols-12 p-8 lg:p-10">
          
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-3">
              <Label className="text-blue-400/60 uppercase tracking-widest text-[10px] font-bold">Target Destination</Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(DEST_VALS).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => setDestination(key as any)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      destination === key 
                        ? "bg-slate-900/80 border-blue-500/50 ring-1 ring-blue-500/30" 
                        : "bg-black border-slate-800 hover:border-blue-900/50 hover:bg-slate-900/20"
                    }`}
                  >
                    <span className="text-2xl">{data.emoji}</span>
                    <div className="text-left">
                      <div className={`font-bold text-xs ${data.color}`}>{data.name}</div>
                      <div className="text-[9px] text-slate-500">{(data.distKm).toExponential(1)} km</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-blue-400/60 uppercase tracking-widest text-[10px] font-bold">Propulsion System</Label>
              <div className="relative group/scroll">
                <div className="grid grid-cols-1 gap-2 max-h-[360px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                  {Object.entries(PROPULSION).map(([key, prop]) => (
                    <button
                      key={key}
                      onClick={() => setPropulsion(key as any)}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all relative overflow-hidden group/btn ${
                        propulsion === key 
                          ? "bg-slate-900/80 border-blue-500/50 ring-1 ring-blue-500/30" 
                          : "bg-black border-slate-800 hover:border-blue-900/50 hover:bg-slate-900/20"
                      }`}
                    >
                      <span className="text-3xl relative z-10 filter group-hover/btn:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all">{prop.emoji}</span>
                      <div className="text-left relative z-10 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-[11px] text-white uppercase tracking-tight">{prop.name}</div>
                          <div className="text-[8px] text-slate-500 font-bold uppercase">{prop.class}</div>
                        </div>
                        <div className="text-[10px] text-blue-400 font-bold mt-0.5">{prop.label}</div>
                      </div>
                      {propulsion === key && (
                        <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-2 h-12 bg-gradient-to-t from-black to-transparent pointer-events-none z-20 flex items-end justify-center pb-1">
                   <div className="flex flex-col items-center gap-1 animate-bounce opacity-40 group-hover/scroll:opacity-80 transition-opacity">
                      <span className="text-[7px] text-slate-500 font-bold uppercase tracking-wider">Hangar Scroll</span>
                      <ChevronDown className="h-3 w-3 text-slate-500" />
                   </div>
                </div>
              </div>
            </div>

            {['rocket', 'starship', 'dragon'].includes(propulsion) && DEST_VALS[destination].au < 100 && (
              <div className="space-y-3 pt-2">
                <Label className="text-blue-400/60 uppercase tracking-widest text-[10px] font-bold">Trajectory Mode</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setUseHohmann(true)}
                    className={`text-[10px] p-2.5 rounded-lg border uppercase tracking-widest font-black transition-all ${
                      useHohmann 
                        ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50" 
                        : "bg-black border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    Hohmann
                  </button>
                  <button
                    onClick={() => setUseHohmann(false)}
                    className={`text-[10px] p-2.5 rounded-lg border uppercase tracking-widest font-black transition-all ${
                      !useHohmann 
                        ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50" 
                        : "bg-black border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    Direct
                  </button>
                </div>
                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/50 mt-2">
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                    {useHohmann 
                      ? "📡 Hohmann Transfer: Maximum fuel efficiency via gravity drift." 
                      : "🔥 Direct Path: Brute-force trajectory. Ignores orbital curves."}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-slate-950 rounded-[2rem] p-10 border border-slate-800/80 flex flex-col justify-center gap-8 relative overflow-hidden group min-h-[340px] shadow-inner">
               <div className={`absolute -right-24 -top-24 w-96 h-96 bg-gradient-to-br ${PROPULSION[propulsion as keyof typeof PROPULSION].color} rounded-full blur-[120px] opacity-10 group-hover:opacity-30 transition-opacity duration-1000 animate-blob`} />
               <div className={`absolute -left-24 -bottom-24 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] opacity-10 animate-blob [animation-delay:3s]`} />

               <div className="relative z-10 text-center space-y-4">
                  <div className="text-blue-500 uppercase text-[10px] tracking-[0.4em] mb-3 font-black flex items-center justify-center gap-3">
                    <Clock className="h-4 w-4 animate-pulse" /> {stats.method}
                  </div>
                  <div className="text-8xl font-black text-white tracking-tighter group-hover:scale-105 transition-transform duration-700 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{stats.timeLabel}</div>
               </div>

               <div className="grid sm:grid-cols-2 gap-4 relative z-10">
                  <div className="bg-black/80 backdrop-blur-xl p-5 rounded-2xl border border-slate-800 shadow-xl">
                     <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <Gauge className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Warp Profile</span>
                     </div>
                     <div className="text-lg font-bold text-white leading-tight">{PROPULSION[propulsion as keyof typeof PROPULSION].name}</div>
                     <div className="text-[10px] text-blue-500 font-bold mt-1 uppercase tracking-widest">Active Velocity Computation</div>
                  </div>
                  
                  {DEST_VALS[destination].au < 100 && (
                    <div className="bg-black/80 backdrop-blur-xl p-5 rounded-2xl border border-slate-800 shadow-xl">
                       <div className="flex items-center gap-2 text-emerald-400 mb-2">
                          <Fuel className="h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Departure Window</span>
                       </div>
                       <div className="text-lg font-bold text-white leading-tight underline decoration-emerald-500/50 underline-offset-4">{stats.windows[0].month} {stats.windows[0].year}</div>
                       <div className="text-[10px] text-emerald-400 font-bold mt-1 uppercase tracking-widest italic font-mono">Launch Gate Primed</div>
                    </div>
                  )}
               </div>

               {stats.percentC >= 100 && (
                 <div className="bg-blue-950/40 border border-blue-500/30 p-4 rounded-xl flex gap-3 items-start relative z-10">
                   <Clock className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                   <div className="text-[10px] text-blue-200/80 leading-relaxed">
                     <span className="font-black text-blue-400 uppercase pr-1">Causality Violation:</span> 
                     Time dilation is significant. Perceived mission time follows crew-relative temporal flow.
                   </div>
                 </div>
               )}
            </div>

            <div className="grid md:grid-cols-1 gap-6">
              {DEST_VALS[destination].au < 100 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] flex items-center gap-2">
                      <Rocket className="h-3 w-3" /> Flight Manifest: {DEST_VALS[destination].name}
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-blue-500/40 to-transparent ml-6" />
                  </div>
                  
                  <div className="grid sm:grid-cols-3 gap-4">
                    {stats.windows.map((win, idx) => (
                      <div key={idx} className="bg-black border border-slate-800 rounded-[1.5rem] p-6 relative overflow-hidden group hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-700 shadow-lg">
                        <div className={`absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br ${PROPULSION[propulsion as keyof typeof PROPULSION].color} rounded-full blur-3xl opacity-10 group-hover:opacity-30 transition-opacity duration-700`} />
                        
                        <div className="flex flex-col gap-5 relative z-10">
                          <div className="space-y-1">
                            <div className="text-slate-500 uppercase text-[9px] font-black tracking-widest">Epoch</div>
                            <div className="text-3xl font-black text-white leading-none">{win.year}</div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="text-slate-500 uppercase text-[9px] font-black tracking-widest">Window</div>
                            <div className="text-xl font-bold text-blue-400 leading-tight">{win.month}</div>
                          </div>

                          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <Fuel className="h-3 w-3 text-emerald-500" />
                               <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Window</span>
                            </div>
                            <span className="text-[10px] text-white font-black bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-900/50">{win.days}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 py-4 bg-blue-950/20 border border-blue-900/30 rounded-2xl italic text-[11px] text-blue-200/60 leading-relaxed shadow-inner">
                    <span className="text-blue-400 font-black uppercase pr-2">Mission Log:</span>
                    Hohmann orbital arcs are prioritized for Delta-V efficiency. Gates occur at optimal planetary conjunctions.
                  </div>
                </div>
              ) : (
                <Card className="bg-black border-slate-800 shadow-2xl p-20 text-center relative overflow-hidden rounded-[2.5rem]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e1e2e_1px,_transparent_1px)] [background-size:24px_24px] opacity-10" />
                  <div className="relative z-10 space-y-4">
                    <div className="text-slate-400 italic text-lg font-semibold tracking-wide">Launch windows are nullified for extragalactic transit.</div>
                    <div className="text-blue-500/60 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Deep Space Protocol: Active</div>
                  </div>
                </Card>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: '🌐 Orbital Arc', text: 'Gravity-assisted drifting between planetary spheres. High efficiency, low speed.', color: 'text-blue-500' },
                { title: '🎯 Launch Gate', text: "Alignment-critical temporal window for mission start. Missing this gate causes indefinite stall.", color: 'text-orange-500' },
                { title: '⏳ Gate Lifecycle', text: "The operational duration of the departure window. Fuel costs scale exponentially pre/post gate.", color: 'text-emerald-500' },
                { title: '⚡ Brute Force', text: 'Direct High-Thrust trajectories ignoring orbital mechanics. Extreme energy cost.', color: 'text-purple-500' }
              ].map((card, i) => (
                <Card key={i} className="bg-black border-slate-800 hover:border-blue-500/40 transition-all group overflow-hidden relative rounded-2xl shadow-xl">
                  <div className={`absolute -right-8 -top-8 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-700`} />
                  <CardHeader className="pb-2 relative z-10">
                     <CardTitle className={`text-[10px] font-black flex items-center gap-2 ${card.color} uppercase tracking-widest`}>
                       {card.title}
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-[10px] text-slate-400 leading-relaxed font-bold italic">
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
