"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Zap } from "lucide-react"
import { useMemo, useState } from "react"

const CRYSTALS = {
  'jedi-blue': { name: 'Jedi Blue', efficiency: 0.85, baseLife: 8, color: '#00d4ff', shadow: '0 0 20px #00d4ff' },
  'sith-red': { name: 'Sith Red', efficiency: 0.65, baseLife: 6, color: '#ff0040', shadow: '0 0 20px #ff0040' },
  'mace-purple': { name: 'Mace Purple', efficiency: 0.95, baseLife: 12, color: '#8b5cf6', shadow: '0 0 20px #8b5cf6' },
  'luke-green': { name: 'Luke Green', efficiency: 0.88, baseLife: 9, color: '#00ff88', shadow: '0 0 20px #00ff88' },
  'white': { name: 'Ahsoka White', efficiency: 0.90, baseLife: 10, color: '#ffffff', shadow: '0 0 20px #ffffff' },
  'darksaber': { name: 'Darksaber', efficiency: 0.50, baseLife: 5, color: '#ffffff', shadow: '0 0 10px #ffffff, inset 0 0 10px black' } // Special handling for darksaber visual ideally
}

export function LightsaberBatteryCalculator() {
  const [crystal, setCrystal] = useState<keyof typeof CRYSTALS>('jedi-blue')
  const [intensity, setIntensity] = useState(5)
  const [mastery, setMastery] = useState(5)
  const [age, setAge] = useState(10)

  const result = useMemo(() => {
    const c = CRYSTALS[crystal]
    let life = c.baseLife * c.efficiency
    
    // Intensity factor: higher intensity = less life
    // 1 -> 1.0, 10 -> 0.28
    const intensityFactor = 1 - ((intensity - 1) * 0.08)
    life *= intensityFactor

    // Mastery factor: higher mastery = more life
    // 5 -> 1.0, 10 -> 1.25, 1 -> 0.8
    const masteryBonus = 1 + ((mastery - 5) * 0.05)
    life *= masteryBonus

    // Age factor: older = less efficiency
    const ageFactor = 1 - (age * 0.005)
    life *= Math.max(0.3, ageFactor)

    return Math.max(0.1, life)
  }, [crystal, intensity, mastery, age])

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="bg-slate-950 border-slate-800 overflow-hidden relative">
        {/* Glow effect based on crystal */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none transition-colors duration-1000"
          style={{ background: `radial-gradient(circle at 50% 30%, ${CRYSTALS[crystal].color}, transparent 70%)` }}
        />

        <CardHeader className="relative z-10">
          <CardTitle className="text-3xl font-display text-slate-100 flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-400" />
            Kyber Power Analysis
          </CardTitle>
          <CardDescription>Optimize your blade's energy consumption.</CardDescription>
        </CardHeader>
        
        <CardContent className="grid lg:grid-cols-2 gap-12 relative z-10">
          
          {/* Controls */}
          <div className="space-y-8">
            
            <div className="space-y-4">
              <Label className="text-slate-300">Kyber Crystal</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(CRYSTALS).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => setCrystal(key as any)}
                    className={`p-3 rounded-lg border transition-all text-sm font-bold flex flex-col items-center gap-2 ${
                      crystal === key 
                        ? "bg-slate-800 border-white/50 text-white ring-1 ring-white/30" 
                        : "bg-black/40 border-slate-800 text-slate-400 hover:bg-slate-900"
                    }`}
                  >
                    <div 
                      className="w-4 h-4 rounded-full shadow-[0_0_10px_currentColor]"
                      style={{ backgroundColor: data.color, color: data.color }}
                    />
                    {data.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label className="text-slate-300">Combat Intensity</Label>
                <span className="text-xs text-slate-500 font-mono">Level {intensity}</span>
              </div>
              <Slider 
                value={[intensity]} 
                onValueChange={([v]) => setIntensity(v)} 
                min={1} max={10} step={1}
                className="[&_.range-thumb]:bg-red-500"
              />
              <p className="text-xs text-slate-500">
                {intensity < 4 ? "Meditation & Form Practice" : intensity < 8 ? "Active Combat & Deflection" : "Duel of the Fates Intensity"}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label className="text-slate-300">Force Mastery</Label>
                <span className="text-xs text-slate-500 font-mono">Level {mastery}</span>
              </div>
              <Slider 
                value={[mastery]} 
                onValueChange={([v]) => setMastery(v)} 
                min={1} max={10} step={1}
                className="[&_.range-thumb]:bg-blue-500"
              />
              <p className="text-xs text-slate-500">
                {mastery < 4 ? "Padawan Learner" : mastery < 8 ? "Jedi Knight" : "Council Master"}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label className="text-slate-300">Hilt Age</Label>
                <span className="text-xs text-slate-500 font-mono">{age} Years</span>
              </div>
              <Slider 
                value={[age]} 
                onValueChange={([v]) => setAge(v)} 
                min={0} max={100} step={1}
                className="[&_.range-thumb]:bg-amber-600"
              />
            </div>

          </div>

          {/* Visualization */}
          <div className="flex flex-col items-center justify-center space-y-8 bg-black/40 rounded-xl p-6 border border-white/5">
            
            <div className="relative h-[300px] w-full flex items-center justify-center">
              {/* Hilt */}
              <div className="absolute bottom-10 flex flex-col items-center z-20">
                 <div className="w-8 h-24 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 rounded-sm relative shadow-xl">
                    <div className="absolute top-2 w-full h-1 bg-black/50" />
                    <div className="absolute bottom-4 w-full h-8 bg-black/80 mx-auto w-[90%] left-[5%] rounded" />
                    <div className="absolute top-0 w-10 h-2 bg-slate-300 -left-1 rounded-full" />
                 </div>
              </div>
              
              {/* Blade */}
              <div 
                className="absolute bottom-[130px] w-4 rounded-t-full transition-all duration-300 z-10 origin-bottom"
                style={{ 
                  height: result * 20 + 'px', // Scale height with life
                  maxHeight: '280px',
                  backgroundColor: 'white',
                  boxShadow: `0 0 10px ${CRYSTALS[crystal].color}, 0 0 20px ${CRYSTALS[crystal].color}, 0 0 40px ${CRYSTALS[crystal].color}, 0 0 60px ${CRYSTALS[crystal].color}`
                }}
              >
                <div className="absolute inset-0 animate-pulse opacity-50 bg-white blur-sm"></div>
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="text-5xl font-black text-white" style={{ textShadow: `0 0 20px ${CRYSTALS[crystal].color}` }}>
                {result.toFixed(1)} hrs
              </div>
              <div className="text-sm text-slate-400 uppercase tracking-widest">Est. Continuous Runtime</div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4">
               <div className="bg-slate-900/50 p-3 rounded text-center border border-white/5">
                 <div className="text-xs text-slate-500 mb-1">Recharge Rate</div>
                 <div className="font-mono text-white">{(2 + (age * 0.05)).toFixed(1)}h</div>
               </div>
               <div className="bg-slate-900/50 p-3 rounded text-center border border-white/5">
                 <div className="text-xs text-slate-500 mb-1">Efficiency</div>
                 <div className="font-mono text-white">{Math.round((result / CRYSTALS[crystal].baseLife) * 100)}%</div>
               </div>
            </div>

            <ShareResult 
               title="Lightsaber Battery Analysis"
               text={`My ${CRYSTALS[crystal].name} lightsaber lasts ${result.toFixed(1)} hours in combat! How efficient is your build?`}
            />

          </div>

        </CardContent>
      </Card>
    </div>
  )
}
