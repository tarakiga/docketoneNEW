"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ShareResult } from "@/components/molecules/share-result"
import { AnimatePresence, motion } from "framer-motion"
import {
    Bomb,
    Coins,
    HeartCrack,
    Skull,
    Sparkles,
    Star,
    Timer
} from "lucide-react"
import { useMemo, useState } from "react"

export function GachaDespair() {
  const [pullRate, setPullRate] = useState(0.6) // Standard 0.6% rate
  const [targetPulls, setTargetPulls] = useState(80)
  const [pity, setPity] = useState(90) // Hard-pity guarantee
  const [hasFailed, setHasFailed] = useState(false)

  const stats = useMemo(() => {
    const rate = pullRate / 100
    // Hard pity: once you reach the pity cap the item is guaranteed, so failure
    // is only possible while you stay below it. Below that: (1 - rate)^pulls.
    const guaranteed = targetPulls >= pity
    const probFailure = guaranteed ? 0 : Math.pow(1 - rate, targetPulls)
    const probSuccess = 1 - probFailure
    const saltLevel = Math.min((targetPulls / 80) * (100 - (probSuccess * 100)), 100)

    return {
      guaranteed,
      successChance: (probSuccess * 100).toFixed(2),
      failureChance: (probFailure * 100).toFixed(2),
      saltLevel: Math.round(saltLevel),
      expectedCost: targetPulls * 2.5 // $2.5 avg per pull
    }
  }, [pullRate, targetPulls, pity])

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Glitch-Core Header */}
      <Card className="overflow-hidden relative group" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
         <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] pointer-events-none z-20" />
         <div className="absolute inset-0 group-hover:bg-[#241a52]/30 transition-colors pointer-events-none" />

         <CardHeader className="relative z-30 p-8 border-b" style={{ borderColor: '#4a3f7a' }}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="space-y-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                     <div className="p-2 rounded-lg animate-bounce" style={{ backgroundColor: '#ffd23c' }}>
                        <Star className="h-6 w-6" style={{ color: '#160e33' }} />
                     </div>
                     <CardTitle className="text-4xl font-black italic tracking-tighter uppercase underline underline-offset-8" style={{ color: '#ECEAE3', textDecorationColor: 'rgba(255,210,60,0.5)' }}>
                        Gacha Pit of Despair
                     </CardTitle>
                  </div>
                  <CardDescription className="font-bold uppercase text-[10px] tracking-[0.3em]" style={{ color: '#b3aae0' }}>
                     Probability forecasting for the emotionally compromised.
                  </CardDescription>
               </div>
               <div className="border p-4 rounded-2xl flex items-center gap-4" style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a' }}>
                  <div className="text-right">
                     <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#ffd23c' }}>Active Salt Accumulation</div>
                     <div className="text-2xl font-black" style={{ color: '#ECEAE3' }}>{stats.saltLevel}%</div>
                  </div>
                  <HeartCrack className="h-8 w-8 animate-pulse" style={{ color: '#ff8a8a' }} />
               </div>
            </div>
         </CardHeader>

         <CardContent className="p-0 relative z-30">
            <div className="grid lg:grid-cols-2">
               
               {/* Controls */}
               <div className="p-5 sm:p-8 lg:p-12 space-y-10 border-b lg:border-b-0 lg:border-r" style={{ borderColor: '#4a3f7a' }}>
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <div className="flex justify-between items-end">
                           <Label className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#b3aae0' }}>Base Drop Rate (%)</Label>
                           <span className="text-xl font-black" style={{ color: '#ECEAE3' }}>{pullRate}%</span>
                        </div>
                        <Slider
                           value={[pullRate]}
                           onValueChange={([v]) => setPullRate(v)}
                           min={0.1}
                           max={5}
                           step={0.1}
                           className="[&_[data-slot=slider-range]]:bg-[#ffd23c] [&_[data-slot=slider-thumb]]:border-[#ffd23c]"
                        />
                     </div>

                     <div className="space-y-4">
                        <div className="flex justify-between items-end">
                           <Label className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#b3aae0' }}>Planned Pull Count</Label>
                           <span className="text-xl font-black" style={{ color: '#ECEAE3' }}>{targetPulls}</span>
                        </div>
                        <Slider
                           value={[targetPulls]}
                           onValueChange={([v]) => setTargetPulls(v)}
                           min={1}
                           max={300}
                           step={1}
                           className="[&_[data-slot=slider-range]]:bg-[#ffd23c] [&_[data-slot=slider-thumb]]:border-[#ffd23c]"
                        />
                     </div>

                     <div className="space-y-4">
                        <div className="flex justify-between items-end">
                           <Label className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#b3aae0' }}>Pity Hard-Cap (Pulls)</Label>
                           <span className="text-xl font-black" style={{ color: '#ECEAE3' }}>{pity}</span>
                        </div>
                        <Slider
                           value={[pity]}
                           onValueChange={([v]) => setPity(v)}
                           min={10}
                           max={200}
                           step={1}
                           className="[&_[data-slot=slider-range]]:bg-[#ffd23c] [&_[data-slot=slider-thumb]]:border-[#ffd23c]"
                        />
                        <p className="text-[10px] font-medium" style={{ color: '#b3aae0' }}>Most banners guarantee the unit at a fixed pull count.</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="border p-5 rounded-3xl text-center space-y-1" style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a' }}>
                        <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#b3aae0' }}>Estimated Investment</div>
                        <div className="text-2xl font-black" style={{ color: '#ECEAE3' }}>${stats.expectedCost.toLocaleString()}</div>
                     </div>
                     <div className="border p-5 rounded-3xl text-center space-y-1 transition-colors" style={stats.guaranteed ? { backgroundColor: '#241a52', borderColor: '#ffd23c' } : { backgroundColor: '#0c0824', borderColor: '#4a3f7a' }}>
                        <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#b3aae0' }}>Pity Status</div>
                        <div className="text-2xl font-black" style={{ color: stats.guaranteed ? '#ffd23c' : '#ECEAE3' }}>{stats.guaranteed ? "GUARANTEED" : `${pity} PULLS`}</div>
                     </div>
                  </div>

                  <div className="pt-4">
                     <Button
                       onClick={() => setHasFailed(!hasFailed)}
                       className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-lg"
                       style={hasFailed ? { backgroundColor: '#ff8a8a', color: '#160e33' } : { backgroundColor: '#ffd23c', color: '#160e33' }}
                     >
                        {hasFailed ? "RECOVERY MODE ACTIVE" : "EXECUTE SUMMON SEQUENCE"}
                     </Button>
                  </div>
               </div>

               {/* Forecast Display */}
               <div className="p-5 sm:p-8 lg:p-12 flex flex-col justify-center gap-12 relative overflow-hidden">
                  <AnimatePresence mode="wait">
                     <motion.div 
                        key={stats.successChance}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-12 relative z-10"
                     >
                        <div className="text-center space-y-2">
                           <div className="text-[10px] font-black uppercase tracking-[0.4em] mb-4" style={{ color: '#b3aae0' }}>Outcome Forecast</div>
                           <div className="text-6xl md:text-8xl font-black tracking-tighter" style={{ fontFamily: 'var(--font-bungee), cursive', color: '#ffd23c' }}>
                              {stats.successChance}%
                           </div>
                           <div className="text-[9px] md:text-xs font-black uppercase tracking-widest" style={{ color: '#ffd23c' }}>Total Success Probability</div>
                           {stats.guaranteed && (
                              <div className="inline-block mt-3 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest" style={{ backgroundColor: '#241a52', borderColor: '#ffd23c', color: '#ffd23c' }}>
                                 ✓ Pity guarantees it at {pity} pulls
                              </div>
                           )}
                        </div>

                        <div className="space-y-6">
                           <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: '#4a3f7a' }}>
                              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#b3aae0' }}>Psychological Warning</span>
                              <span className="text-[10px] font-black uppercase italic" style={{ color: stats.saltLevel > 70 ? '#ff8a8a' : '#86efac' }}>
                                 {stats.saltLevel > 70 ? "CRITICAL SALT RISK" : "STABLE EMOTIONAL STATE"}
                              </span>
                           </div>

                           <div className="grid gap-4">
                              <div className="flex items-center gap-6 p-6 rounded-3xl border group transition-colors hover:border-[#ffd23c]" style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a' }}>
                                 <div className="p-4 rounded-2xl group-hover:scale-110 transition-transform" style={{ backgroundColor: '#241a52' }}>
                                    <Skull className="h-8 w-8" style={{ color: '#ffd23c' }} />
                                 </div>
                                 <div className="space-y-1 text-left">
                                    <div className="text-xl font-black tracking-tight" style={{ color: '#ECEAE3' }}>{stats.failureChance}%</div>
                                    <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#b3aae0' }}>Probability of “Total Shaft”</div>
                                 </div>
                              </div>

                              <div className="flex items-center gap-6 p-6 rounded-3xl border group transition-colors hover:border-[#ffd23c]" style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a' }}>
                                 <div className="p-4 rounded-2xl group-hover:scale-110 transition-transform" style={{ backgroundColor: '#241a52' }}>
                                    <Bomb className="h-8 w-8" style={{ color: '#ff8a8a' }} />
                                 </div>
                                 <div className="space-y-1 text-left">
                                    <div className="text-xl font-black tracking-tight" style={{ color: '#ECEAE3' }}>{Math.round(stats.expectedCost * 1.5)}$</div>
                                    <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#b3aae0' }}>Estimated “Sunk Cost” Trap</div>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="flex justify-center mt-6">
                           <ShareResult title="Gacha Pit of Despair" text={`${stats.successChance}% chance to get my unit - $${stats.expectedCost.toLocaleString()} of suffering. 🎲😭`} />
                        </div>
                     </motion.div>
                  </AnimatePresence>
               </div>

            </div>
         </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
         {[
           { title: "Pity Meta", txt: "Calculates the exact moment your luck is forced by code.", icon: Timer, color: "#ffd23c" },
           { title: "Emotional Debt", txt: "The non-refundable cost of expectations.", icon: HeartCrack, color: "#ff8a8a" },
           { title: "Currency Drain", txt: "Visualize how fast your gems become dust.", icon: Coins, color: "#ffd23c" },
           { title: "RNG Aura", txt: "Simulated luck based on celestial (random) alignment.", icon: Sparkles, color: "#86efac" }
         ].map((item, idx) => (
           <Card key={idx} className="p-5 transition-all cursor-default hover:border-[#ffd23c]" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
              <item.icon className="w-5 h-5 mb-3" style={{ color: item.color }} />
              <div className="font-black text-[10px] uppercase tracking-widest mb-1" style={{ color: '#ECEAE3' }}>{item.title}</div>
              <p className="text-[9px] font-medium leading-tight" style={{ color: '#b3aae0' }}>{item.txt}</p>
           </Card>
         ))}
      </div>
    </div>
  )
}
