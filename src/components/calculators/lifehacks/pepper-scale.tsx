"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Flame, Info, Milk } from "lucide-react"
import { useState } from "react"

// Pepper Data
const PEPPERS = [
  { name: "Bell Pepper", shu: 0, desc: "A crunchy vegetable. Zero danger.", survival: "None needed." },
  { name: "Banana Pepper", shu: 500, desc: "Tangy. A slight tingle for babies.", survival: "Napkin." },
  { name: "Poblano", shu: 1500, desc: "Earthy. Great for stuffing.", survival: "Water." },
  { name: "Jalapeño", shu: 5000, desc: "The gateway pepper. Respectable heat.", survival: "Tortilla chips." },
  { name: "Serrano", shu: 20000, desc: "Jalapeño's angry cousin. Crisp bite.", survival: "Cold beer." },
  { name: "Cayenne", shu: 50000, desc: "Pure heat powder. Sneaky.", survival: "Bread." },
  { name: "Thai Chili", shu: 100000, desc: "Small but violent. Instant sweat.", survival: "Rice & Yogurt." },
  { name: "Habanero", shu: 300000, desc: "Floral, fruity, then pain.", survival: "Whole Milk." },
  { name: "Ghost Pepper", shu: 1000000, desc: "A spiritual experience (bad kind).", survival: "Ice Cream + Prayer." },
  { name: "Carolina Reaper", shu: 2200000, desc: "Weaponized agriculture. Why?", survival: "Call an ambulance." },
  { name: "Pepper X", shu: 2693000, desc: "The Surface of the Sun.", survival: "Make a will." },
]

export function PepperScale() {
  const [selectedPepper, setSelectedPepper] = useState(PEPPERS[3])

  const handleSelect = (name: string) => {
    const p = PEPPERS.find(p => p.name === name)
    if (p) setSelectedPepper(p)
  }

  // Calculate heat percentage relative to Pepper X
  const heatPercent = (selectedPepper.shu / 2693000) * 100

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="bg-red-950 border-red-900 text-red-50 shadow-[0_0_50px_rgba(220,38,38,0.3)]">
        <CardHeader>
           <CardTitle className="text-3xl font-display text-red-500 flex items-center gap-3">
              <Flame className="h-8 w-8 fill-red-500 animate-pulse" />
              How Hot Is That Pepper?
           </CardTitle>
           <CardDescription className="text-red-300/60">
              Scoville Scale Visualizer & Survival Guide.
           </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
           
           <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <div className="space-y-2">
                    <Label className="uppercase text-xs font-bold text-red-400 tracking-widest">Select a Pepper</Label>
                    <Select value={selectedPepper.name} onValueChange={handleSelect}>
                       <SelectTrigger className="bg-red-900/50 border-red-800 text-white h-12 text-lg font-bold"><SelectValue/></SelectTrigger>
                       <SelectContent>
                          {PEPPERS.map(p => (
                             <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
                          ))}
                       </SelectContent>
                    </Select>
                 </div>

                 <div className="space-y-4">
                    <div className="bg-black/40 p-6 rounded-xl border border-red-900/50 space-y-4">
                       <div className="flex justify-between items-end">
                          <div className="text-sm text-red-400 uppercase font-bold">Scoville Heat Units (SHU)</div>
                          <div className="text-4xl font-black text-white">{selectedPepper.shu.toLocaleString()}</div>
                       </div>
                       
                       {/* Thermometer Bar */}
                       <div className="relative w-full h-6 bg-red-950 rounded-full overflow-hidden border border-red-900">
                          <div 
                            className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 transition-all duration-700 ease-out"
                            style={{ width: `${Math.max(1, heatPercent)}%` }} // Minimum 1% to show something
                          ></div>
                       </div>
                    </div>

                    <div className="bg-red-900/20 p-4 rounded-xl space-y-2">
                       <div className="flex gap-2 font-bold text-red-300 items-center">
                          <Info className="w-4 h-4" /> Description
                       </div>
                       <p className="text-red-100 italic">"{selectedPepper.desc}"</p>
                    </div>

                    <div className="bg-white/10 p-4 rounded-xl space-y-2 border border-white/10">
                       <div className="flex gap-2 font-bold text-white items-center">
                          <Milk className="w-4 h-4" /> Survival Kit
                       </div>
                       <p className="text-white font-mono">{selectedPepper.survival}</p>
                    </div>
                 </div>
              </div>

              <div className="flex items-center justify-center p-8 relative">
                 {/* Visual Pepper Representation - dynamic color/glow */}
                 <div className={`relative w-48 h-64 transition-all duration-700 ${selectedPepper.shu > 100000 ? 'animate-shake' : ''}`}>
                    {/* SVG Pepper */}
                    <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl">
                       <path 
                          d="M50 10 C 60 0, 80 0, 70 20 C 90 40, 90 90, 50 110 C 10 90, 10 40, 30 20 C 20 0, 40 0, 50 10" 
                          fill={selectedPepper.shu < 5000 ? "#22c55e" : selectedPepper.shu < 50000 ? "#facc15" : selectedPepper.shu < 500000 ? "#f97316" : "#ef4444"}
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="2"
                       />
                       {/* Face */}
                       <circle cx="35" cy="50" r="3" fill="black" opacity="0.6"/>
                       <circle cx="65" cy="50" r="3" fill="black" opacity="0.6"/>
                       <path 
                          d={selectedPepper.shu > 100000 ? "M30 70 Q 50 50, 70 70" : "M30 65 Q 50 85, 70 65"} 
                          stroke="black" fill="transparent" strokeWidth="3" opacity="0.6"
                       />
                       {/* Beads of sweat for hot peppers */}
                       {selectedPepper.shu > 50000 && (
                          <circle cx="75" cy="30" r="2" fill="#38bdf8" className="animate-ping" />
                       )}
                    </svg>
                    
                    {/* Fire effect for extreme heat */}
                    {selectedPepper.shu > 500000 && (
                       <div className="absolute -bottom-4 left-0 right-0 h-20 bg-gradient-to-t from-red-600 to-transparent opacity-50 blur-xl animate-pulse"></div>
                    )}
                 </div>
              </div>
           </div>

           <div className="flex justify-center">
              <ShareResult 
                 title="Pepper Survival Check" 
                 text={`I'm about to eat a ${selectedPepper.name} (${selectedPepper.shu.toLocaleString()} SHU). Required survival gear: ${selectedPepper.survival}. Wish me luck. 🌶️`} 
              />
           </div>

        </CardContent>
      </Card>
      
      <style jsx>{`
         @keyframes shake {
            0%, 100% { transform: rotate(-1deg); }
            50% { transform: rotate(1deg); }
         }
         .animate-shake {
            animation: shake 0.2s linear infinite;
         }
      `}</style>
    </div>
  )
}
