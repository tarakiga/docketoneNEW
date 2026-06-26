"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"
import { useMemo, useState } from "react"

const BESKAR_TYPES = {
  'pure': { name: 'Pure Beskar', purity: 99, durability: 10, color: '#e2e8f0' },
  'alloy': { name: 'Beskar Alloy', purity: 85, durability: 8, color: '#94a3b8' },
  'durasteel': { name: 'Durasteel Mix', purity: 60, durability: 6, color: '#64748b' },
  'scrap': { name: 'Scrap Metal', purity: 30, durability: 3, color: '#475569' }
}

const DAMAGE_TYPES = {
  'blaster': { name: 'Blaster Fire', mod: 1.0 },
  'lightsaber': { name: 'Lightsaber', mod: 1.5 }, // Pure beskar resists better
  'vibro': { name: 'Vibroblade', mod: 0.8 },
  'explosive': { name: 'Explosives', mod: 0.7 }
}

export function BeskarArmorCalculator() {
  const [beskar, setBeskar] = useState<keyof typeof BESKAR_TYPES>('pure')
  const [damage, setDamage] = useState<keyof typeof DAMAGE_TYPES>('blaster')
  const [intensity, setIntensity] = useState(5)
  const [age, setAge] = useState(5)

  const stats = useMemo(() => {
    const b = BESKAR_TYPES[beskar]
    const d = DAMAGE_TYPES[damage]
    
    let integ = b.durability * 10
    
    // Intensity
    integ *= (1 - ((intensity - 1) * 0.08))
    
    // Age
    integ *= (1 - (age * 0.005))
    
    // Damage Mod
    // Special rule: Pure beskar resists lightsaber better (0.9 mult instead of standard dmg)
    let finalMod = d.mod
    if (damage === 'lightsaber') {
       finalMod = beskar === 'pure' ? 0.9 : 0.4
    }
    integ *= finalMod
    
    const integrity = Math.max(0, Math.min(100, Math.round(integ)))
    const repairCost = Math.round((100 - integrity) * (b.purity * 2))

    return { integrity, repairCost }
  }, [beskar, damage, intensity, age])

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="shadow-2xl overflow-hidden" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
        <CardHeader className="border-b" style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a' }}>
           <CardTitle className="text-2xl font-bold flex items-center gap-2" style={{ color: '#ECEAE3' }}>
             <Shield className="h-6 w-6" style={{ color: '#ff8a3c' }}/> Mandalorian Forge
           </CardTitle>
           <CardDescription style={{ color: '#b3aae0' }}>Configure your loadout. This is the Way.</CardDescription>
        </CardHeader>
        
        <CardContent className="grid lg:grid-cols-2 gap-12 p-8">
           
           <div className="space-y-8">
              <div className="space-y-4">
                 <h3 className="font-bold uppercase text-xs tracking-wider" style={{ color: '#b3aae0' }}>Material Grade</h3>
                 <div className="grid grid-cols-2 gap-3">
                    {Object.entries(BESKAR_TYPES).map(([k, v]) => (
                      <button
                        key={k}
                        onClick={() => setBeskar(k as keyof typeof BESKAR_TYPES)}
                        className="p-4 rounded border text-left transition-all"
                        style={beskar === k
                          ? { backgroundColor: '#241a52', borderColor: '#ff8a3c', color: '#ECEAE3' }
                          : { backgroundColor: '#0c0824', borderColor: '#4a3f7a', color: '#b3aae0' }}
                      >
                        <div className="font-bold">{v.name}</div>
                        <div className="text-xs opacity-70">Purity: {v.purity}%</div>
                      </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-4">
                 <h3 className="font-bold uppercase text-xs tracking-wider" style={{ color: '#b3aae0' }}>Primary Threat</h3>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries(DAMAGE_TYPES).map(([k, v]) => (
                      <button
                        key={k}
                        onClick={() => setDamage(k as keyof typeof DAMAGE_TYPES)}
                        className="p-2 py-4 rounded border text-center text-xs leading-tight break-words min-w-0 transition-all"
                        style={damage === k
                          ? { backgroundColor: '#241a52', borderColor: '#ff8a3c', color: '#ECEAE3' }
                          : { backgroundColor: '#0c0824', borderColor: '#4a3f7a', color: '#b3aae0' }}
                      >
                        {v.name}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-4">
                 <h3 className="font-bold uppercase text-xs tracking-wider" style={{ color: '#b3aae0' }}>Combat Variables</h3>
                 <div className="space-y-2">
                   <div className="flex justify-between text-sm" style={{ color: '#ECEAE3' }}>
                     <span>Intensity Level</span><span>{intensity}/10</span>
                   </div>
                   <input type="range" min="1" max="10" value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} className="w-full" style={{ accentColor: '#ff8a3c' }}/>
                 </div>
                 <div className="space-y-2">
                   <div className="flex justify-between text-sm" style={{ color: '#ECEAE3' }}>
                     <span>Armor Age</span><span>{age} Years</span>
                   </div>
                   <input type="range" min="0" max="50" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full" style={{ accentColor: '#ff8a3c' }}/>
                 </div>
              </div>
           </div>

           <div className="flex flex-col items-center justify-center space-y-8 rounded-xl p-6 border" style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a' }}>

              {/* Helmet Viz */}
              <div className="relative w-48 h-48 flex items-center justify-center">
                 <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                    <path
                      fill={BESKAR_TYPES[beskar].color}
                      d="M20,30 Q20,5 50,5 Q80,5 80,30 V60 Q80,95 50,95 Q20,95 20,60 Z" // Simplified helmet shape
                    />
                     <path
                      fill="#0c0824" // Visor
                      d="M45,30 H55 V60 H80 V70 H55 V85 H45 V70 H20 V60 H45 Z" // T-shape
                    />
                 </svg>
                 <div className="absolute -bottom-4 px-3 py-1 rounded text-xs font-mono" style={{ backgroundColor: '#241a52', color: '#ECEAE3' }}>
                   {stats.integrity}% INTEGRITY
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full">
                 <div className="min-w-0 p-3 sm:p-4 rounded text-center border" style={{ backgroundColor: '#241a52', borderColor: '#4a3f7a' }}>
                    <div className="text-xs uppercase mb-1" style={{ color: '#b3aae0' }}>Survival Rate</div>
                    <div className="min-w-0 text-xl sm:text-2xl font-black break-words" style={{ color: stats.integrity > 50 ? '#86efac' : '#ff8a8a' }}>
                      {Math.round(stats.integrity * 0.9 + 5)}%
                    </div>
                 </div>
                 <div className="min-w-0 p-3 sm:p-4 rounded text-center border" style={{ backgroundColor: '#241a52', borderColor: '#4a3f7a' }}>
                    <div className="text-xs uppercase mb-1" style={{ color: '#b3aae0' }}>Repair Cost</div>
                    <div className="min-w-0 text-xl sm:text-2xl font-black flex flex-wrap items-center justify-center gap-1 break-words" style={{ fontFamily: 'var(--font-bungee), cursive', color: '#ff8a3c' }}>
                      {stats.repairCost.toLocaleString()}C
                    </div>
                 </div>
              </div>

              <div className="text-center text-sm italic" style={{ color: '#b3aae0' }}>
                {stats.integrity > 80 ? "Ready for battle." : stats.integrity > 40 ? "Caution advised." : "CRITICAL FAILURE IMMINENT."}
              </div>

              <ShareResult 
                 title="Beskar Armor Config"
                 text={`My custom ${BESKAR_TYPES[beskar].name} armor has ${stats.integrity}% integrity against ${DAMAGE_TYPES[damage].name}. Survival Rate: ${Math.round(stats.integrity * 0.9 + 5)}%.`}
              />

           </div>
           
        </CardContent>
      </Card>
    </div>
  )
}
